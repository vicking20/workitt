import React from 'react';

interface BodyEditorProps {
    body: string;
    isGenerating: boolean;
    onUpdate: (value: string) => void;
    onAIAction: (action: 'rewrite' | 'shorten') => void;
}

const BodyEditor: React.FC<BodyEditorProps> = ({ body, isGenerating, onUpdate, onAIAction }) => {
    return (
        <div className="flex-1 flex flex-col min-h-[400px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Cover Letter Body</label>
                {/* AI Action Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => onAIAction('rewrite')}
                        disabled={isGenerating || !body.trim()}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-sm">auto_fix</span>
                        Rewrite
                    </button>
                    <button
                        onClick={() => onAIAction('shorten')}
                        disabled={isGenerating || !body.trim()}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-sm">compress</span>
                        Shorten
                    </button>

                    <div className="hidden md:block h-4 w-[1px] bg-slate-200"></div>

                    <button
                        onClick={() => alert('Translation feature coming soon!')}
                        disabled={!body.trim()}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-sm">translate</span>
                        Translate
                    </button>
                </div>
            </div>

            <div className="relative flex-1">
                <textarea
                    value={body}
                    onChange={(e) => onUpdate(e.target.value)}
                    className="w-full h-full min-h-[400px] p-3 md:p-4 border-2 border-slate-200 focus:border-brand-accent outline-none font-sans text-base md:text-sm leading-relaxed resize-none rounded break-words"
                    style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                    placeholder="Start writing here..."
                />
            </div>
        </div>
    );
};

export default BodyEditor;

