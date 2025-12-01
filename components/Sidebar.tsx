import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'bg-sunchang-600 text-white shadow-md' : 'text-sunchang-100 hover:bg-sunchang-800 hover:text-white';
    };

    return (
        <div className="w-64 bg-sunchang-900 min-h-screen flex flex-col shadow-xl z-10 hidden md:flex">
            <div className="p-6 flex flex-col items-center border-b border-sunchang-800">
                <div className="bg-white p-2 rounded mb-3 w-full">
                     {/* Using the logo provided in the prompt */}
                    <img 
                        src="https://images.squarespace-cdn.com/content/v1/64b5f426543b3b4293f773b4/b3310023-455b-4375-9c2b-d30d952865c3/SUNCHANG_LOGO_FINAL-02.jpg" 
                        alt="Sun Chang Corp" 
                        className="w-full h-auto object-contain"
                    />
                </div>
                <h1 className="text-white font-bold text-lg tracking-wide text-center">財務指揮中心</h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                <Link to="/" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/')}`}>
                    <i className="fas fa-chart-line w-5 text-center"></i>
                    <span className="font-medium">總覽儀表板</span>
                </Link>

                <Link to="/receivables" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/receivables')}`}>
                    <i className="fas fa-hand-holding-dollar w-5 text-center"></i>
                    <span className="font-medium">應收帳款 (AR)</span>
                </Link>

                <Link to="/payables" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/payables')}`}>
                    <i className="fas fa-file-invoice-dollar w-5 text-center"></i>
                    <span className="font-medium">應付帳款 (AP)</span>
                </Link>

                <Link to="/analysis" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive('/analysis')}`}>
                    <i className="fas fa-robot w-5 text-center"></i>
                    <span className="font-medium">AI 財務長洞察</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-sunchang-800">
                <div className="flex items-center space-x-3 text-sunchang-100">
                    <div className="w-8 h-8 rounded-full bg-sunchang-600 flex items-center justify-center">
                        <i className="fas fa-user text-xs"></i>
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold">管理員</p>
                        <p className="text-xs opacity-70">財務部</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;