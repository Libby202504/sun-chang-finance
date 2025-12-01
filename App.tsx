import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Receivables from './components/Receivables';
import Payables from './components/Payables';
import AIAdvisor from './components/AIAdvisor';
import Login from './components/Login';
import SettingsModal from './components/SettingsModal';
import { FinancialNode, TransactionType, ExpenseCategory } from './types';
import { fetchGoogleSheetData } from './services/sheetService';

// Mock Data representing the firm's structure with realistic TWD amounts
const INITIAL_DATA: FinancialNode[] = [
    // Receivables (Income)
    { id: '1', dueDate: '2023-10-25', description: 'Project Alpha - 第一階段設計 (SD)', amount: 1250000, type: TransactionType.INCOME, status: 'OVERDUE', relatedParty: 'Skyline 開發' },
    { id: '2', dueDate: '2023-11-05', description: 'Project Beta - 施工圖繪製 (CD)', amount: 850000, type: TransactionType.INCOME, status: 'PENDING', relatedParty: 'Urban Living 建設' },
    { id: '3', dueDate: '2023-11-15', description: '市中心翻新案 - 執照圖 (Permit)', amount: 2000000, type: TransactionType.INCOME, status: 'PENDING', relatedParty: '市政府都市發展局' },
    { id: '9', dueDate: '2023-11-20', description: '科技園區競圖案 - 簽約金', amount: 500000, type: TransactionType.INCOME, status: 'PENDING', relatedParty: '高科技園區管委會' },
    
    // Payables (Expenses - Subcontracting)
    { id: '4', dueDate: '2023-10-30', description: '機電工程 (MEP) 顧問費 - 第一期', amount: 450000, type: TransactionType.EXPENSE, category: ExpenseCategory.SUBCONTRACT, status: 'PENDING', relatedParty: 'Volts & Pipes 機電顧問' },
    { id: '5', dueDate: '2023-11-01', description: '結構計算與審查費', amount: 300000, type: TransactionType.EXPENSE, category: ExpenseCategory.SUBCONTRACT, status: 'PENDING', relatedParty: '穩固結構技師事務所' },
    { id: '10', dueDate: '2023-11-10', description: '綠建築標章 (LEED) 認證顧問', amount: 150000, type: TransactionType.EXPENSE, category: ExpenseCategory.SUBCONTRACT, status: 'PENDING', relatedParty: 'GreenLife 顧問' },
    
    // Payables (Expenses - Payroll & Fixed)
    { id: '6', dueDate: '2023-10-31', description: '十月份事務所薪資', amount: 1500000, type: TransactionType.EXPENSE, category: ExpenseCategory.PAYROLL, status: 'PENDING', relatedParty: '內部員工' },
    { id: '7', dueDate: '2023-11-01', description: '總部辦公室租金', amount: 120000, type: TransactionType.EXPENSE, category: ExpenseCategory.FIXED, status: 'PENDING', relatedParty: '大樓管理委員會' },
    { id: '8', dueDate: '2023-11-05', description: 'Autodesk & Adobe 軟體授權費', amount: 50000, type: TransactionType.EXPENSE, category: ExpenseCategory.FIXED, status: 'PENDING', relatedParty: '軟體經銷商' },
];

// ★★★ 您的 Google Apps Script 網址 (已修正) ★★★
const DEFAULT_URL = "https://script.google.com/macros/s/AKfycbyhiDUf5J057Vtd1oXwxqUVVQjO6qZjd_3aiaxg9i9e4GRXG_PmcW-IEqkoduMNcQsM/exec";

// 公司 LOGO 網址
const LOGO_URL = "https://images.squarespace-cdn.com/content/v1/64b5f426543b3b4293f773b4/b3310023-455b-4375-9c2b-d30d952865c3/SUNCHANG_LOGO_FINAL-02.jpg";

const App: React.FC = () => {
    const [data, setData] = useState<FinancialNode[]>(INITIAL_DATA);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Google Sheet Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [sheetUrl, setSheetUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState('');

    // Load URL from local storage or use DEFAULT on boot
    useEffect(() => {
        const savedUrl = localStorage.getItem('sunchang_sheet_url');
        if (savedUrl) {
            setSheetUrl(savedUrl);
            loadData(savedUrl);
        } else {
            // 自動載入預設網址
            setSheetUrl(DEFAULT_URL);
            loadData(DEFAULT_URL);
        }
    }, []);

    const loadData = async (url: string) => {
        if (!url) {
            setData(INITIAL_DATA);
            return;
        }
        setIsLoading(true);
        setLoadError('');
        try {
            const sheetData = await fetchGoogleSheetData(url);
            setData(sheetData);
        } catch (err) {
            console.error(err);
            setLoadError('無法連線至 Google Sheet，已切換回離線模式。請檢查 URL 或權限。');
            setData(INITIAL_DATA); // Fallback
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSettings = (newUrl: string) => {
        localStorage.setItem('sunchang_sheet_url', newUrl);
        setSheetUrl(newUrl);
        setIsSettingsOpen(false);
        loadData(newUrl);
    };

    if (!isAuthenticated) {
        return <Login onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <Router>
            <div className="flex h-screen bg-gray-50 font-sans text-slate-800 animate-fade-in">
                {/* Mobile Menu Button (With Logo) */}
                <div className="md:hidden fixed top-0 left-0 w-full bg-sunchang-900 p-4 z-20 flex justify-between items-center shadow-md">
                     <div className="flex items-center space-x-3">
                         <div className="bg-white p-1 rounded-md shadow-sm">
                            <img src={LOGO_URL} alt="Logo" className="h-8 w-auto" />
                         </div>
                         <span className="text-white font-bold text-lg tracking-wide">上澄聯合財務</span>
                     </div>
                     <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                         <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                     </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-30 bg-gray-900" style={{marginTop: '72px'}}>
                        <Sidebar />
                    </div>
                )}

                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shadow-sm hidden md:flex">
                        <div className="flex items-center gap-4">
                             {/* Desktop Logo in Header */}
                             <img src={LOGO_URL} alt="Sun Chang Logo" className="h-9 w-auto" />
                             
                             <div className="text-sm breadcrumbs text-gray-500 font-medium flex items-center gap-2">
                                 <span className="text-lg font-bold text-sunchang-900">上澄聯合 (Sun Chang Corp)</span>
                                 <span className="text-gray-300">|</span>
                                 <span>財務管理系統</span>
                                 {sheetUrl && (
                                     <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                                         <i className="fas fa-link mr-1"></i> 已連線至雲端
                                     </span>
                                 )}
                             </div>
                        </div>
                        <div className="flex items-center space-x-4">
                             {isLoading && (
                                 <div className="text-xs text-sunchang-600 font-medium animate-pulse">
                                     <i className="fas fa-sync fa-spin mr-1"></i> 資料同步中...
                                 </div>
                             )}
                             {loadError && (
                                 <div className="text-xs text-red-500 font-medium">
                                     <i className="fas fa-exclamation-circle mr-1"></i> 連線失敗
                                 </div>
                             )}
                             
                             <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                上個同步時間: {new Date().toLocaleTimeString()}
                             </div>
                             
                             <button className="text-gray-400 hover:text-sunchang-600 relative">
                                 <i className="fas fa-bell"></i>
                                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
                             </button>
                             
                             <div className="relative group">
                                <button className="text-gray-400 hover:text-sunchang-600">
                                    <i className="fas fa-cog"></i>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-100">
                                    <button 
                                        onClick={() => setIsSettingsOpen(true)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        <i className="fas fa-database mr-2 w-4"></i> 資料來源設定
                                    </button>
                                    <button onClick={() => setIsAuthenticated(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-t border-gray-100">
                                        <i className="fas fa-sign-out-alt mr-2 w-4"></i> 登出系統
                                    </button>
                                </div>
                             </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8 md:pt-8 pt-24 md:pt-8">
                        <Routes>
                            <Route path="/" element={<Dashboard data={data} />} />
                            <Route path="/receivables" element={<Receivables data={data} />} />
                            <Route path="/payables" element={<Payables data={data} />} />
                            <Route path="/analysis" element={<AIAdvisor data={data} />} />
                        </Routes>
                    </main>
                </div>
            </div>

            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
                onSave={handleSaveSettings}
                currentUrl={sheetUrl}
            />
        </Router>
    );
};

export default App;