import React from 'react';
import { getAllTemplates } from '../../registries/TemplateRegistry';

export interface CoverLetterStyle {
    fontFamily: string;
    fontSize: number;
    headerFontColor: string;
    contentFontColor: string;
    lineSpacing: number;
    margins: number;
    paperSize: 'a4' | 'letter';
    headerAlignment: 'left' | 'center' | 'right';
}

interface StylePanelProps {
    style: CoverLetterStyle;
    templateId: string;
    onUpdate: (updates: Partial<CoverLetterStyle>) => void;
    onTemplateUpdate: (templateId: string) => void;
}

const FONTS = [
    { name: 'Inter', value: 'font-sans' },
    { name: 'Merriweather', value: 'font-serif' },
    { name: 'Roboto', value: 'font-roboto' },
    { name: 'Courier Prime', value: 'font-mono' },
];

const StylePanel: React.FC<StylePanelProps> = ({ style, templateId, onUpdate, onTemplateUpdate }) => {
    const templates = getAllTemplates();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-2">

            {/* Typography Section */}
            <div className="bg-white/80 border-2 border-primary p-4">
                <h3 className="text-lg font-bold text-primary uppercase mb-4">Typography</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Template</label>
                        <select
                            value={templateId}
                            onChange={(e) => onTemplateUpdate(e.target.value)}
                            className="w-full p-2 border-2 border-slate-300 text-sm"
                        >
                            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Font Family</label>
                        <select
                            value={style.fontFamily}
                            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                            className="w-full p-2 border-2 border-slate-300 text-sm"
                        >
                            {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                            Font Size ({style.fontSize}pt)
                        </label>
                        <input
                            type="range"
                            min="9"
                            max="14"
                            step="0.5"
                            value={style.fontSize}
                            onChange={(e) => onUpdate({ fontSize: parseFloat(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Header Font Color</label>
                        <input
                            type="color"
                            value={style.headerFontColor}
                            onChange={(e) => onUpdate({ headerFontColor: e.target.value })}
                            className="w-full h-10 border-2 border-slate-300 cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Content Font Color</label>
                        <input
                            type="color"
                            value={style.contentFontColor}
                            onChange={(e) => onUpdate({ contentFontColor: e.target.value })}
                            className="w-full h-10 border-2 border-slate-300 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Layout Section */}
            <div className="bg-white/80 border-2 border-primary p-4">
                <h3 className="text-lg font-bold text-primary uppercase mb-4">Layout</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Header Alignment</label>
                        <div className="flex border-2 border-slate-300 overflow-hidden">
                            {['left', 'center', 'right'].map(align => (
                                <button
                                    key={align}
                                    onClick={() => onUpdate({ headerAlignment: align as any })}
                                    className={`flex-1 py-2 text-xs uppercase font-bold ${style.headerAlignment === align
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {align}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                            Margins ({style.margins}mm)
                        </label>
                        <input
                            type="range"
                            min="4"
                            max="16"
                            step="1"
                            value={style.margins}
                            onChange={(e) => onUpdate({ margins: parseInt(e.target.value) })}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                            Line Spacing ({style.lineSpacing})
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="2"
                            step="0.1"
                            value={style.lineSpacing}
                            onChange={(e) => onUpdate({ lineSpacing: parseFloat(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Paper Size Section */}
            <div className="bg-white/80 border-2 border-primary p-4">
                <h3 className="text-lg font-bold text-primary uppercase mb-4">Paper Size</h3>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={style.paperSize === 'a4'}
                            onChange={() => onUpdate({ paperSize: 'a4' })}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-bold">A4 (210 × 297mm)</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={style.paperSize === 'letter'}
                            onChange={() => onUpdate({ paperSize: 'letter' })}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-bold">US Letter (8.5 × 11in)</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default StylePanel;
