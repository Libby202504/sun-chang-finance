import React from 'react';
import { FinancialNode, TransactionType, ExpenseCategory } from '../types';

interface PayablesProps {
    data: FinancialNode[];
}

const Payables: React.FC<PayablesProps> = ({ data }) => {
    const payables = data.filter(n => n.type === TransactionType.EXPENSE);
    
    // Grouping logic for summary
    const grouped = {
        [ExpenseCategory.PAYROLL]: payables.filter(n => n.category === ExpenseCategory.PAYROLL).reduce((sum, n) => sum + n.amount, 0),
        [ExpenseCategory.SUBCONTRACT]: payables.filter(n => n.category === ExpenseCategory.SUBCONTRACT).reduce((sum, n) => sum + n.amount, 0),
        [ExpenseCategory.FIXED]: payables.filter(n => n.category === ExpenseCategory.FIXED).reduce((sum, n) => sum + n.amount, 0),
    };

    const exportToCSV = () => {
        const headers = ["ID", "到期日 (Due Date)", "類別 (Category)", "描述 (Description)", "受款人 (Payee)", "金額 (Amount)", "狀態 (Status)"];
        const rows = payables.map(n => [
            n.id, 
            n.dueDate, 
            getCategoryLabel(n.category!), 
            `"${n.description}"`, 
            `"${n.relatedParty}"`, 
            n.amount, 
            n.status
        ]);
        
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "上澄聯合_支付節點.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getCategoryLabel = (cat: ExpenseCategory) => {
        switch (cat) {
            case ExpenseCategory.PAYROLL: return '事務所薪資';
            case ExpenseCategory.SUBCONTRACT: return '複委託支付節點';
            case ExpenseCategory.FIXED: return '固定支出';
            default: return cat;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PAID': return '已付款';
            case 'OVERDUE': return '逾期';
            case 'PENDING': return '待支付';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">支付節點與固定支出 (AP)</h2>
                    <p className="text-sm text-gray-500">管理薪資、複委託及其他固定開銷</p>
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={exportToCSV}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center"
                    >
                        <i className="fas fa-file-csv mr-2 text-green-600"></i> 匯出報表
                    </button>
                    <button className="bg-sunchang-600 hover:bg-sunchang-700 text-white px-4 py-2 rounded-lg shadow transition-colors">
                        <i className="fas fa-plus mr-2"></i> 新增支付節點
                    </button>
                </div>
            </div>

            {/* Quick Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">事務所薪資 (待付)</p>
                        <p className="text-xl font-bold text-gray-800">NT$ {grouped.PAYROLL.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600"><i className="fas fa-users"></i></div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">複委託支付節點 (待付)</p>
                        <p className="text-xl font-bold text-gray-800">NT$ {grouped.SUBCONTRACT.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600"><i className="fas fa-hard-hat"></i></div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">固定支出 (待付)</p>
                        <p className="text-xl font-bold text-gray-800">NT$ {grouped.FIXED.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-full text-gray-600"><i className="fas fa-building"></i></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">到期日</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">類別</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">受款人</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">金額 (NT$)</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {payables.map(node => (
                                <tr key={node.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                        {node.dueDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium border
                                            ${node.category === ExpenseCategory.PAYROLL ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                              node.category === ExpenseCategory.SUBCONTRACT ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                              'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}>
                                            {getCategoryLabel(node.category!)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {node.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {node.relatedParty}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                        NT$ {node.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${node.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                                              node.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 
                                              'bg-gray-100 text-gray-800'}`}>
                                            {getStatusLabel(node.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payables;