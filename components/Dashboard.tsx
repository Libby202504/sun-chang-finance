import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import StatsCard from './StatsCard';
import { FinancialNode, TransactionType } from '../types';

interface DashboardProps {
    data: FinancialNode[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    // Calculate Stats
    const totalReceivables = data
        .filter(n => n.type === TransactionType.INCOME && n.status !== 'PAID')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalPayables = data
        .filter(n => n.type === TransactionType.EXPENSE && n.status !== 'PAID')
        .reduce((acc, curr) => acc + curr.amount, 0);
    
    const overdueCount = data.filter(n => n.status === 'OVERDUE').length;

    // Prepare Chart Data (Mocking a 6-month projection based on current data)
    // Scaled to TWD Millions roughly
    const chartData = [
        { name: '1月', income: 4000000, expenses: 3200000 },
        { name: '2月', income: 3000000, expenses: 2800000 },
        { name: '3月', income: 5500000, expenses: 4000000 },
        { name: '4月', income: 4500000, expenses: 3500000 },
        { name: '5月', income: 6000000, expenses: 4800000 }, 
        { name: '6月', income: 3500000, expenses: 2500000 },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">財務總覽儀表板</h2>
                    <p className="text-gray-500">上澄聯合現金流節點即時追蹤</p>
                </div>
                <div className="text-right bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">預估月底餘額</p>
                    <p className="text-3xl font-bold text-sunchang-600">NT$ 12,450,000</p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard 
                    title="應收帳款節點 (AR)" 
                    value={`NT$ ${totalReceivables.toLocaleString()}`} 
                    icon="fa-hand-holding-dollar" 
                    color="green" 
                    trend="12%"
                />
                <StatsCard 
                    title="支付節點與支出 (AP)" 
                    value={`NT$ ${totalPayables.toLocaleString()}`} 
                    icon="fa-file-invoice-dollar" 
                    color="red"
                    trend="5%"
                />
                <StatsCard 
                    title="逾期/警示項目" 
                    value={overdueCount.toString()} 
                    icon="fa-exclamation-triangle" 
                    color="yellow"
                />
                <StatsCard 
                    title="淨現金流預測" 
                    value={`NT$ ${(totalReceivables - totalPayables).toLocaleString()}`} 
                    icon="fa-chart-line" 
                    color="blue"
                />
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">現金流預測 (未來半年)</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value/10000}萬`} />
                                <Tooltip 
                                    formatter={(value: number) => `NT$ ${value.toLocaleString()}`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="income" stroke="#00bcd4" strokeWidth={3} dot={{r: 4}} name="預估收入" />
                                <Line type="monotone" dataKey="expenses" stroke="#ef5350" strokeWidth={3} dot={{r: 4}} name="預估支出" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">支出類別分佈 (本月)</h3>
                     <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: '事務所薪資', value: 1500000 },
                                { name: '複委託支付', value: 900000 },
                                { name: '固定支出', value: 500000 },
                                { name: '稅務/規費', value: 200000 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value/10000}萬`} />
                                <Tooltip cursor={{fill: 'transparent'}} formatter={(value: number) => `NT$ ${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="value" fill="#006064" radius={[4, 4, 0, 0]} name="金額" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <i className="fas fa-info-circle text-blue-500"></i>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <span className="font-bold">AI 智慧通知：</span> 「Project Alpha」的主要複委託支付節點將在 5 天後到期。建議您追蹤「Skyline 開發」的應收帳款進度，以確保資金水位健康。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;