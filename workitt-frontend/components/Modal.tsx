import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = '2xl' }) => {
    // Close on ESC key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`bg-white border-4 border-primary shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] w-full max-w-${maxWidth} max-h-[90vh] overflow-y-auto`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 lg:p-6 border-b-4 border-primary bg-lavender-tint">
                    <h2 className="font-motif text-xl lg:text-2xl uppercase">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center bg-primary text-white hover:bg-brand-accent transition-colors"
                        aria-label="Close"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
