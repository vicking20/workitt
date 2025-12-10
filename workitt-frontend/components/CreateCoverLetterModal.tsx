/**
 * Create Cover Letter Modal
 * Shows different options for creating a cover letter
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CreateCoverLetterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateCoverLetterModal: React.FC<CreateCoverLetterModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const options = [
        {
            title: 'Generate from Persona',
            description: 'Use your saved persona or career profile to instantly generate a cover letter with AI assistance',
            icon: 'person',
            color: 'bg-green-500',
            action: () => {
                navigate('/cover-letters/create?mode=persona');
                onClose();
            }
        },
        {
            title: 'Summarize and Generate',
            description: 'Quickly build a cover letter by giving summary info about where you\'re applying to, and the AI agent does the rest',
            icon: 'auto_awesome',
            color: 'bg-purple-500',
            action: () => {
                navigate('/cover-letters/create?mode=summarize');
                onClose();
            }
        },
        {
            title: 'Create from Scratch',
            description: 'Start with a blank template and fill in details manually. Full creative control over your content',
            icon: 'edit_note',
            color: 'bg-brand-accent',
            action: () => {
                navigate('/cover-letters/create');
                onClose();
            }
        },
        {
            title: 'Upload Cover Letter',
            description: 'Upload an existing cover letter (PDF/DOCX) and we\'ll enhance it with AI for your next application',
            icon: 'upload_file',
            color: 'bg-blue-500',
            action: () => {
                navigate('/cover-letters/create?mode=upload');
                onClose();
            }
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white border-4 border-primary shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b-2 border-primary flex justify-between items-center sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="font-motif text-2xl lg:text-3xl uppercase text-primary">Create Cover Letter</h3>
                        <p className="text-slate-600 font-sans mt-1">Choose how you want to create your cover letter</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                {/* Options Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={option.action}
                            className="group text-left p-6 bg-white border-2 border-primary hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 ${option.color} border-2 border-primary group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined text-2xl text-white">{option.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg uppercase text-primary mb-2">{option.title}</h4>
                                    <p className="text-sm text-slate-600 font-sans">{option.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t-2 border-primary bg-slate-50">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-white border-2 border-primary text-primary font-bold uppercase hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCoverLetterModal;
