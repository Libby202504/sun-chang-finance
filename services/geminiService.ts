import { GoogleGenAI } from "@google/genai";
import { FinancialNode } from '../types';

const getAiInstance = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key is missing");
    }
    return new GoogleGenAI({ apiKey });
};

export const analyzeFinancialHealth = async (nodes: FinancialNode[]): Promise<string> => {
    try {
        const ai = getAiInstance();
        // Summarize data to send to AI to save tokens and context
        const summary = nodes.map(n => 
            `${n.dueDate}: ${n.type} 金額 NT$${n.amount} 項目: ${n.description} (狀態: ${n.status}) - 對象: ${n.relatedParty}`
        ).join('\n');

        const prompt = `
        你是一間建築師事務所/工程顧問公司「上澄聯合 (Sun Chang Corporation)」的財務長 (CFO)。
        請分析以下的財務數據，重點關注「應收帳款時間節點」與「複委託支付節點」之間的關係。
        
        請找出：
        1. **現金流斷鏈風險**：在收到業主款項前，是否有大筆的複委託/外包款項需要支付？
        2. **時間節點優化**：針對支付時間點 (Payment Timing) 與收帳時間點，提供具體的時間管理建議。
        3. **高階主管摘要**：目前財務健康狀況的簡短總結。

        數據資料：
        ${summary}

        請使用「繁體中文」回答。保持專業、簡潔，並使用 Markdown 格式編排。
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "目前無法產生分析報告。";
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return "AI 分析暫時無法使用，請檢查 API Key。";
    }
};

export const generateReminderEmail = async (node: FinancialNode): Promise<string> => {
    try {
        const ai = getAiInstance();
        const prompt = `
        請撰寫一封禮貌但堅定的催款電子郵件 (Reminder Email)。
        
        情境：
        - 寄件人：上澄聯合 (財務部)
        - 收件人：${node.relatedParty}
        - 專案/項目：${node.description}
        - 應付金額：NT$${node.amount.toLocaleString()}
        - 到期日：${node.dueDate}
        
        請使用「繁體中文」撰寫。語氣應保持專業，並維護良好的商業合作關係，強調我們重視「時間節點」的承諾。
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "無法產生郵件草稿。";
    } catch (error) {
        console.error("Gemini Email Error:", error);
        return "AI 郵件產生功能暫時無法使用。";
    }
};