import React, { useState } from 'react';
import { FinancialNode, TransactionType } from '../types';
import { generateReminderEmail } from '../services/geminiService';

interface ReceivablesProps {
    data: FinancialNode[];
    onAddClick: () => void;
}

const Receivables: React.FC<ReceivablesProps> = ({ data, onAddClick }) => {
    const receivables = data.filter(n => n.type === TransactionType.INCOME);
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);

    const handleGenerateEmail = async (node: FinancialNode) => {
        setGeneratingId(node.id);
        const email = await generateReminderEmail(node);
        setGeneratedEmail(email);
        setGeneratingId(null);
    };

    const exportToCSV = () => {
        const headers = ["ID", "到期日 (Due Date)", "項目描述 (Description)", "客戶/對象 (Client)", "金額 (Amount)", "狀態 (Status)"];
        const rows = receivables.map(n => [
            n.id, 
            n.dueDate, 
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
        link.setAttribute("download", "上澄聯合_應收帳款節點.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PAID': return '已入帳';
            case 'OVERDUE': return '逾期';
            case 'PENDING': return '待收款';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">應收帳款時間節點 (AR)</h2>
                    <p className="text-sm text-gray-500">追蹤所有專案階段性請款的時間點</p>
                </div>
                <div className="flex space-x-3">
                    <button 
                        onClick={exportToCSV}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center"
                    >
                        <i className="fas fa-file-csv mr-2 text-green-600"></i> 匯出報表
                    </button>
                    <button 
                        onClick={onAddClick}
                        className="bg-sunchang-600 hover:bg-sunchang-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
                    >
                        <i className="fas fa-plus mr-2"></i> 新增時間節點
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">到期日</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">專案 / 描述</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">客戶 / 對象</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">金額 (NT$)</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">動作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {receivables.map(node => (
                                <tr key={node.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                        {node.dueDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                        {node.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {node.relatedParty}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        NT$ {node.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${node.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                                              node.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 
                                              'bg-yellow-100 text-yellow-800'}`}>
                                            {getStatusLabel(node.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {node.status === 'OVERDUE' && (
                                            <button 
                                                onClick={() => handleGenerateEmail(node)}
                                                disabled={generatingId === node.id}
                                                className="text-sunchang-600 hover:text-sunchang-800 font-medium flex items-center"
                                            >
                                                {generatingId === node.id ? (
                                                    <i className="fas fa-spinner fa-spin mr-1"></i>
                                                ) : (
                                                    <i className="fas fa-wand-magic-sparkles mr-1"></i>
                                                )}
                                                {generatingId === node.id ? '產生中...' : '產生催款信'}
                                            </button>
                                        )}
                                        {node.status !== 'OVERDUE' && (
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <i className="fas fa-ellipsis-h"></i>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {generatedEmail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">AI 產生的提醒信</h3>
                            <button onClick={() => setGeneratedEmail(null)} className="text-gray-400 hover:text-gray-600">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                            {generatedEmail}
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setGeneratedEmail(null)} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                                捨棄
                            </button>
                            <button onClick={() => {
                                alert("郵件已傳送至郵件軟體！");
                                setGeneratedEmail(null);
                            }} className="px-4 py-2 bg-sunchang-600 text-white rounded hover:bg-sunchang-700">
                                <i className="fas fa-paper-plane mr-2"></i>
                                複製並開啟郵件
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Receivables;