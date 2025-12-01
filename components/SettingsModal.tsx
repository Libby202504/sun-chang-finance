
import React, { useState, useEffect } from 'react';
import { fetchGoogleSheetData } from '../services/sheetService';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (url: string) => void;
    currentUrl: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentUrl }) => {
    const [url, setUrl] = useState(currentUrl);
    const [testStatus, setTestStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [testMessage, setTestMessage] = useState('');

    useEffect(() => {
        setUrl(currentUrl);
        setTestStatus('IDLE');
        setTestMessage('');
    }, [currentUrl, isOpen]);

    const handleTestConnection = async () => {
        if (!url) {
            setTestStatus('ERROR');
            setTestMessage('請先輸入網址');
            return;
        }

        setTestStatus('TESTING');
        setTestMessage('連線中...');

        try {
            const data = await fetchGoogleSheetData(url);
            if (data.length > 0) {
                setTestStatus('SUCCESS');
                setTestMessage(`成功！讀取到 ${data.length} 筆資料。首筆資料日期：${data[0].dueDate}`);
            } else {
                setTestStatus('ERROR');
                setTestMessage('連線成功但沒有資料，或資料格式不符。');
            }
        } catch (error: any) {
            setTestStatus('ERROR');
            if (error.message.includes('PERMISSION_DENIED')) {
                setTestMessage('權限錯誤：請確認部署時「誰可以存取」已設為「任何人」。');
            } else {
                setTestMessage(`連線失敗：${error.message}`);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">資料來源設定</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                        <p className="text-sm text-blue-700">
                            <strong>Google Sheets 連動：</strong> 貼上您的 Apps Script 網址，讓系統讀取「收支流水帳」。
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Google Apps Script URL
                        </label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://script.google.com/macros/s/..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sunchang-500 outline-none font-mono text-sm"
                        />
                    </div>

                    {/* Test Connection Section */}
                    <div className="flex items-center justify-between mt-2">
                        <button 
                            onClick={handleTestConnection}
                            disabled={testStatus === 'TESTING' || !url}
                            className={`text-sm font-medium px-3 py-1.5 rounded transition-colors ${
                                testStatus === 'TESTING' ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {testStatus === 'TESTING' ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className="fas fa-plug mr-1"></i>}
                            測試連線
                        </button>
                        
                        {testMessage && (
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                                testStatus === 'SUCCESS' ? 'text-green-700 bg-green-50' : 
                                testStatus === 'ERROR' ? 'text-red-700 bg-red-50' : 'text-gray-500'
                            }`}>
                                {testStatus === 'SUCCESS' && <i className="fas fa-check-circle mr-1"></i>}
                                {testStatus === 'ERROR' && <i className="fas fa-times-circle mr-1"></i>}
                                {testMessage}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button 
                        onClick={() => { setUrl(''); onSave(''); }}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                    >
                        清除設定
                    </button>
                    <button 
                        onClick={() => onSave(url)}
                        disabled={testStatus === 'TESTING'}
                        className="px-6 py-2 bg-sunchang-600 hover:bg-sunchang-700 text-white rounded-lg shadow font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        儲存並連線
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
