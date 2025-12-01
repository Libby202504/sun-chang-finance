import React, { useState } from 'react';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock password for demo purposes
        if (password === 'sunchang888' || password === 'admin') {
            onLogin();
        } else {
            setError('密碼錯誤，請聯繫財務部管理員 (提示: sunchang888)');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="bg-sunchang-900 p-8 text-center">
                     <div className="bg-white p-3 rounded-lg inline-block mb-4 shadow-lg">
                        <img 
                            src="https://images.squarespace-cdn.com/content/v1/64b5f426543b3b4293f773b4/b3310023-455b-4375-9c2b-d30d952865c3/SUNCHANG_LOGO_FINAL-02.jpg" 
                            alt="Sun Chang Logo" 
                            className="h-12 w-auto object-contain"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-wider">上澄聯合</h1>
                    <p className="text-sunchang-100 text-sm mt-1">財務指揮中心 (FCC)</p>
                </div>
                
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                系統權限密碼
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                    <i className="fas fa-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sunchang-500 focus:border-sunchang-500 outline-none transition-all"
                                    placeholder="請輸入訪問密碼"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center">
                                <i className="fas fa-exclamation-circle mr-2"></i>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-sunchang-600 hover:bg-sunchang-700 text-white font-bold py-3 rounded-lg shadow transition-colors flex justify-center items-center"
                        >
                            <i className="fas fa-sign-in-alt mr-2"></i>
                            登入系統
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-400">
                        <p>© 2024 Sun Chang Corporation. All Rights Reserved.</p>
                        <p className="mt-1">此系統包含機密財務資訊，未經授權請勿訪問。</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;