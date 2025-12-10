import React from 'react';

export type StartMethod = 'blank' | 'persona' | 'job_desc' | 'upload';

interface StartMethodTilesProps {
    activeMethod: StartMethod;
    onSelectMethod: (method: StartMethod) => void;
}

const StartMethodTiles: React.FC<StartMethodTilesProps> = ({ activeMethod, onSelectMethod }) => {
    const methods = [
        { id: 'blank', icon: 'edit_note', label: 'Start Blank' },
        { id: 'persona', icon: 'person', label: 'From Persona' },
        { id: 'job_desc', icon: 'auto_awesome', label: 'Paste Job' },
        { id: 'upload', icon: 'upload_file', label: 'Upload' }
    ];

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Start Method</h2>
                <span className="text-xs text-slate-400">Choose how to begin — you can change later</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
                {methods.map(method => (
                    <button
                        key={method.id}
                        onClick={() => onSelectMethod(method.id as StartMethod)}
                        className={`flex flex-col items-center justify-center p-3 border-2 transition-all ${activeMethod === method.id
                            ? 'border-brand-accent bg-brand-accent/5 text-brand-accent'
                            : 'border-slate-200 hover:border-primary text-slate-600'
                            }`}
                    >
                        <span className="material-symbols-outlined mb-1">{method.icon}</span>
                        <span className="text-[10px] font-bold uppercase text-center leading-tight">{method.label}</span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default StartMethodTiles;
