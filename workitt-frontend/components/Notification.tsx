import React, { useEffect } from 'react';

interface NotificationProps {
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
            <div className={`
                border-4 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] min-w-[300px] max-w-md
                ${type === 'success'
                    ? 'bg-green-50 border-green-600'
                    : 'bg-red-50 border-red-600'
                }
            `}>
                <div className="p-4 flex items-start gap-3">
                    <span className={`material-symbols-outlined text-2xl ${type === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <div className="flex-1">
                        <h3 className={`font-bold uppercase text-sm mb-1 ${type === 'success' ? 'text-green-900' : 'text-red-900'
                            }`}>
                            {type === 'success' ? 'Success' : 'Error'}
                        </h3>
                        <p className={`text-sm ${type === 'success' ? 'text-green-800' : 'text-red-800'
                            }`}>
                            {message}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`material-symbols-outlined text-xl hover:opacity-70 ${type === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notification;
