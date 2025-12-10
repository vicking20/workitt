import { CoverLetterStyle } from '../components/CoverLetter/StylePanel';

export interface TemplateDefinition {
    id: string;
    name: string;
    description: string;
    thumbnail?: string; // URL or component
    defaultStyle: Partial<CoverLetterStyle>;
    // We could add a render component here later if we want fully custom layouts per template
    // render: (data: any) => React.ReactNode; 
}

export const TEMPLATES: Record<string, TemplateDefinition> = {
    modern: {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and professional with a subtle accent color.',
        defaultStyle: {
            fontFamily: 'font-sans',
            fontSize: 11,
            headerAlignment: 'left',
            margins: 8
        }
    },
    classic: {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional serif typography for formal applications.',
        defaultStyle: {
            fontFamily: 'font-serif',
            fontSize: 12,
            headerAlignment: 'center',
            margins: 10
        }
    },
    minimal: {
        id: 'minimal',
        name: 'Minimal',
        description: 'Stripped back design that focuses purely on the content.',
        defaultStyle: {
            fontFamily: 'font-mono',
            fontSize: 10,
            headerAlignment: 'left',
            margins: 12
        }
    },
    creative: {
        id: 'creative',
        name: 'Creative',
        description: 'Bold layout with unique typography for creative roles.',
        defaultStyle: {
            fontFamily: 'font-creative',
            fontSize: 11,
            headerAlignment: 'right',
            margins: 6
        }
    }
};

export const getTemplate = (id: string): TemplateDefinition => {
    return TEMPLATES[id] || TEMPLATES['modern'];
};

export const getAllTemplates = (): TemplateDefinition[] => {
    return Object.values(TEMPLATES);
};
