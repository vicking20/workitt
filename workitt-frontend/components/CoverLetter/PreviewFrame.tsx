import React from 'react';
import { CoverLetterStyle } from './StylePanel';

interface PreviewFrameProps {
    data: {
        title: string;
        jobTitle: string;
        company: string;
        date: string;
        hiringManagerName: string;
        contact: {
            name: string;
            email: string;
            phone: string;
            address: string;
            visibility: {
                name: boolean;
                email: boolean;
                phone: boolean;
                address: boolean;
            };
        };
        body: string;
    };
    style: CoverLetterStyle;
    templateId: string;
    isATSFriendlyMode: boolean;
    visibility: {
        company: boolean;
        jobTitle: boolean;
        date: boolean;
        hiringManager: boolean;
    };
    onExportPDF: () => void;
    onCheckATS: () => void;
    onToggleATSMode: () => void;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ data, style, templateId, isATSFriendlyMode, visibility, onExportPDF, onCheckATS, onToggleATSMode }) => {

    return (
        <>
            <style>{`
                @media screen {
                    .cover-letter-page {
                        page-break-after: always;
                        break-after: page;
                        margin-bottom: 20px;
                    }
                    .cover-letter-page:last-child {
                        page-break-after: auto;
                        break-after: auto;
                    }
                }
                @media print {
                    /* Hide everything except the cover letter preview */
                    body * {
                        visibility: hidden;
                    }
                    
                    /* Show only the cover letter preview and its children */
                    .cover-letter-preview-container,
                    .cover-letter-preview-container * {
                        visibility: visible;
                    }
                    
                    /* Position cover letter at top of page */
                    .cover-letter-preview-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: auto;
                        overflow: visible;
                    }
                    
                    /* Ensure proper page sizing and margins */
                    @page {
                        size: ${style.paperSize === 'a4' ? 'A4' : 'letter'};
                        margin: ${style.margins * 0.25}rem;
                    }
                    
                    /* Reset container styles for print */
                    .cover-letter-page {
                        page-break-inside: avoid;
                        break-inside: avoid;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        width: 100% !important;
                        max-width: none !important;
                        min-height: auto !important;
                        height: auto !important;
                        overflow: visible !important;
                    }
                    
                    /* Prevent orphans and widows */
                    .cover-letter-page * {
                        orphans: 3;
                        widows: 3;
                    }
                    
                    /* Ensure all content is visible */
                    .cover-letter-page h1,
                    .cover-letter-page h2,
                    .cover-letter-page h3,
                    .cover-letter-page p,
                    .cover-letter-page div,
                    .cover-letter-page span {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `}</style>
            <div
                className="cover-letter-preview-container mx-auto bg-white shadow-lg transition-all origin-top print:shadow-none print:m-0 cover-letter-page"
                style={{
                    width: style.paperSize === 'a4' ? '210mm' : '8.5in',
                    minHeight: style.paperSize === 'a4' ? '297mm' : '11in',
                    padding: `${style.margins * 0.25}rem`,
                    fontFamily: style.fontFamily === 'font-sans' ? 'Inter, sans-serif' :
                        style.fontFamily === 'font-serif' ? 'Merriweather, serif' :
                            style.fontFamily === 'font-mono' ? 'Courier Prime, monospace' : 'Roboto, sans-serif',
                    color: style.contentFontColor,
                    fontSize: `${style.fontSize}pt`,
                    lineHeight: style.lineSpacing,
                    overflow: 'visible'
                }}
            >
                {/* Content Preview */}
                <div className="h-full flex flex-col">

                    {/* Header Section */}
                    <div className={`mb-8 ${templateId === 'modern' ? 'border-b-2 border-slate-900 pb-1' : ''}`} style={{ textAlign: style.headerAlignment }}>
                        {data.contact.visibility.name && (
                            <h1 className="text-2xl font-bold uppercase tracking-wide mb-2" style={{ color: style.headerFontColor }}>
                                {data.contact.name || 'Your Name'}
                            </h1>
                        )}
                        <div className={`text-sm opacity-80 flex flex-wrap gap-x-4 gap-y-1 ${style.headerAlignment === 'center' ? 'justify-center' : style.headerAlignment === 'right' ? 'justify-end' : ''}`} style={{ color: style.contentFontColor }}>
                            {data.contact.visibility.email && data.contact.email && (
                                <span>{data.contact.email}</span>
                            )}
                            {data.contact.visibility.phone && data.contact.phone && (
                                <span>{data.contact.phone}</span>
                            )}
                            {data.contact.visibility.address && data.contact.address && (
                                <span>{data.contact.address}</span>
                            )}
                        </div>
                    </div>

                    {/* Date */}
                    {visibility.date && (
                        <div className="mb-4" style={{ color: style.contentFontColor }}>
                            {data.date ? new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    )}

                    {/* Recipient Info */}
                    <div className="mb-8" style={{ color: style.contentFontColor }}>
                        {visibility.hiringManager && <div>{data.hiringManagerName || 'Hiring Manager'}</div>}
                        {visibility.company && data.company && <div>{data.company}</div>}
                    </div>

                    {/* Subject Line */}
                    {visibility.jobTitle && data.jobTitle && (
                        <div className="mb-6 font-bold uppercase text-sm tracking-wide border-b border-slate-200 pb-2 inline-block" style={{ color: style.headerFontColor }}>
                            Application for {data.jobTitle}
                        </div>
                    )}

                    {/* Body */}
                    <div className="whitespace-pre-line break-words" style={{ color: style.contentFontColor }}>
                        {data.body || <span className="opacity-30 italic">Dear Hiring Manager, ...</span>}
                    </div>

                </div>
            </div>
        </>
    );
};

export default PreviewFrame;
