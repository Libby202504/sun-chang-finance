import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: string;
    trend?: string;
    color: 'blue' | 'green' | 'red' | 'yellow';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        yellow: 'bg-yellow-50 text-yellow-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <i className={`fas ${icon} text-xl`}></i>
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-500 font-medium mr-2">
                        <i className="fas fa-arrow-up mr-1"></i>
                        {trend}
                    </span>
                    <span className="text-gray-400">與上月相比</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;