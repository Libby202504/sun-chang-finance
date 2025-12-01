import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FinancialNode } from '../types';
import { analyzeFinancialHealth } from '../services/geminiService';

interface AIAdvisorProps {
    data: FinancialNode[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ data }) => {
    const [analysis, setAnalysis] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleRunAnalysis = async () => {
        setLoading(true);
        const result = await analyzeFinancialHealth(data);
        setAnalysis(result);
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-sunchang-800 to-sunchang-600 rounded-xl p-8 text-white shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-full">
                        <i className="fas fa-brain text-2xl"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">AI 財務長洞察</h2>
                        <p className="text-sunchang-100">利用 Gemini 2.5 Flash 分析支付節點與現金流風險。</p>
                    </div>
                </div>
                
                <button 
                    onClick={handleRunAnalysis} 
                    disabled={loading}
                    className="bg-white text-sunchang-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-md flex items-center"
                >
                    {loading ? (
                        <>
                            <i className="fas fa-circle-notch fa-spin mr-2"></i> 正在分析數據...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-search-dollar mr-2"></i> 產生高階主管報告
                        </>
                    )}
                </button>
            </div>

            {analysis && (
                <div className="bg-white rounded-xl shadow border border-gray-200 p-8 animate-fade-in">
                    <div className="prose prose-sunchang max-w-none">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                    <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                        <button className="text-gray-500 hover:text-sunchang-600 text-sm">
                            <i className="fas fa-download mr-1"></i> 匯出 PDF 報告
                        </button>
                    </div>
                </div>
            )}

            {/* Feature Highlights based on user request */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                 <div className="bg-white p-6 rounded-lg border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-2"><i className="fas fa-bell text-yellow-500 mr-2"></i>自動提醒功能</h3>
                    <p className="text-sm text-gray-600">系統會在「時間節點」前 5 天自動標記發票。使用「應收帳款」分頁中的「產生催款信」功能發送客製化提醒。</p>
                 </div>
                 <div className="bg-white p-6 rounded-lg border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-2"><i className="fas fa-network-wired text-blue-500 mr-2"></i>支付節點最佳化</h3>
                    <p className="text-sm text-gray-600">AI 會比較「複委託」付款到期日與客戶「應收帳款」日期，建議「延後付款」或「提早收款」策略，以維持正向流動性。</p>
                 </div>
            </div>
        </div>
    );
};

export default AIAdvisor;