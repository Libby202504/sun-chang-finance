
import { FinancialNode, TransactionType, ExpenseCategory } from '../types';

export const fetchGoogleSheetData = async (scriptUrl: string): Promise<FinancialNode[]> => {
    try {
        // Append a timestamp to prevent browser caching
        const targetUrl = `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}t=${new Date().getTime()}`;
        
        const response = await fetch(targetUrl);
        
        // Check if the response is HTML (Login page redirection issue)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
            throw new Error("PERMISSION_DENIED: 讀取到的是 HTML 登入頁面，請確認 Apps Script 部署權限是否設為「任何人 (Anyone)」。");
        }

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const jsonData = await response.json();
        
        if (jsonData.error) {
            console.error("Sheet Error:", jsonData.error);
            return [];
        }

        if (!Array.isArray(jsonData)) {
            console.warn("Data format warning: expected array", jsonData);
            return [];
        }

        return jsonData.map((item: any) => {
            // 1. Determine Type (Income/Expense) based on user's screenshot keywords
            let type = TransactionType.EXPENSE; // Default
            const rawType = String(item.type || "").trim();
            
            // Logic: Catch "應收帳款", "收入", "INCOME"
            if (rawType.includes('收') || rawType.includes('INCOME')) {
                type = TransactionType.INCOME;
            }

            // 2. Determine Status
            let status: 'PENDING' | 'PAID' | 'OVERDUE' = 'PENDING';
            const rawStatus = String(item.status || "").trim();
            const rawDate = parseDate(item.dueDate);
            const isPastDue = new Date(rawDate) < new Date() && rawDate !== new Date().toISOString().split('T')[0];

            if (rawStatus.includes('已') || rawStatus.includes('完成') || rawStatus.includes('付訖') || rawStatus.includes('收訖') || rawStatus.includes('OK')) {
                status = 'PAID';
            } else if (rawStatus.includes('取消') || rawStatus.includes('作廢')) {
                status = 'PAID'; // Treat cancelled as resolved/hidden or handle separately. Here mapping to PAID to remove from alert list, or could add CANCELLED type.
            } else if ((rawStatus.includes('待') || rawStatus === 'PENDING' || rawStatus === '') && isPastDue) {
                status = 'OVERDUE';
            } else {
                status = 'PENDING';
            }

            // 3. Intelligent Category Inference for Expenses
            let category: ExpenseCategory | undefined = undefined;
            if (type === TransactionType.EXPENSE) {
                const desc = String(item.item || "").toLowerCase();
                const vendor = String(item.vendor || "").toLowerCase();
                const rType = rawType.toLowerCase();

                if (rType.includes('薪') || desc.includes('薪') || vendor.includes('員工')) {
                    category = ExpenseCategory.PAYROLL;
                } else if (rType.includes('固定') || desc.includes('租') || desc.includes('水電') || desc.includes('軟體') || desc.includes('費') || desc.includes('稅')) {
                    category = ExpenseCategory.FIXED;
                } else {
                    // Default for Architecture/Engineering firms: Sub-contracting
                    // Usually "複委託" falls here
                    category = ExpenseCategory.SUBCONTRACT;
                }
            }

            // 4. Construct Description
            const displayDescription = item.projectCode 
                ? `[${item.projectCode}] ${item.item}` 
                : item.item || '未命名項目';

            return {
                id: String(item.id || Math.random()),
                dueDate: rawDate,
                description: displayDescription,
                amount: Number(item.amount) || 0,
                type: type,
                category: category,
                status: status,
                relatedParty: item.vendor || '未指定對象',
                notes: item.projectCode || ''
            };
        });
    } catch (error) {
        console.error("Error fetching Google Sheet data:", error);
        throw error;
    }
};

// Helper to handle date formats coming from Google Sheets
const parseDate = (dateVal: any): string => {
    if (!dateVal) return new Date().toISOString().split('T')[0];
    
    // If it is an ISO string like "2023-11-19T16:00:00.000Z" coming from Google Script
    // This usually means Midnight in Taiwan (GMT+8) becomes 16:00 previous day in UTC.
    // We need to shift it back to local time to get the correct "Day".
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
        // Add 8 hours to align with Taiwan visual date if it looks like a T16:00 timestamp
        // Or simpler: use toLocaleDateString with specific timezone
        return d.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Taipei'
        }).replace(/\//g, '-'); // Convert 2023/11/20 to 2023-11-20
    }
    
    // Fallback for simple strings
    return String(dateVal).split('T')[0];
};
