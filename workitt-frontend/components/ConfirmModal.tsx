/**
 * Confirmation Modal Component
 * Reusable confirmation dialog with Workitt design language
 */

import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white border-4 border-primary shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] max-w-md w-full">
                {/* Header */}
                <div className="p-6 border-b-2 border-primary">
                    <h3 className="font-motif text-2xl uppercase text-primary">{title}</h3>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-slate-700 font-sans">{message}</p>
                </div>

                {/* Actions */}
                <div className="p-6 border-t-2 border-primary flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border-2 border-primary text-primary font-bold uppercase hover:bg-slate-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-6 py-3 text-white font-bold uppercase transition-colors ${isDestructive
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-brand-accent hover:bg-primary'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
