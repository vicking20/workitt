
/**
 * Cover Letter Editor Page
 * Unified editor with split layout, using modular components
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';
import { ToastProvider, useToast } from '../components/Toast';
import { useHistory } from '../hooks/useHistory';
import { TEMPLATES } from '../registries/TemplateRegistry';

// Components
import StartMethodTiles, { StartMethod } from '../components/CoverLetter/StartMethodTiles';
import BaselineControls from '../components/CoverLetter/BaselineControls';
import StylePanel, { CoverLetterStyle } from '../components/CoverLetter/StylePanel';
import BodyEditor from '../components/CoverLetter/BodyEditor';
import PreviewFrame from '../components/CoverLetter/PreviewFrame';

// --- Types ---

interface CoverLetterState {
    id?: string;
    title: string;
    templateId: string;

    // Job Info
    jobTitle: string;
    company: string;
    jobDescriptionText?: string;
    date: string;
    hiringManagerName: string;

    // Contact Info
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

    // Visibility for other fields
    visibility: {
        company: boolean;
        jobTitle: boolean;
        date: boolean;
        hiringManager: boolean;
    };

    // Generation Settings
    tone: 'formal' | 'neutral' | 'friendly';
    length: 'short' | 'medium' | 'long';

    // Content
    body: string;

    // Style
    style: CoverLetterStyle;

    // Meta
    personaId?: string;
    autoSavedAt?: Date;
    isATSFriendlyMode: boolean;
}

interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    job_sector: string;
    email: string;
    phone: string;
    address: string;
}

// --- Component ---

const CoverLetterEditorContent: React.FC = () => {
    const navigate = useNavigate();
    const { coverId } = useParams<{ coverId?: string }>();
    const isEditing = !!coverId;
    const { showToast } = useToast();

    // --- State ---

    // Initial State
    const defaultTemplate = TEMPLATES['modern'];
    const initialState: CoverLetterState = {
        title: 'New Cover Letter',
        templateId: defaultTemplate.id,
        jobTitle: '',
        company: '',
        date: new Date().toISOString().split('T')[0],
        hiringManagerName: 'Dear Hiring Manager',
        contact: {
            name: '',
            email: '',
            phone: '',
            address: '',
            visibility: {
                name: true,
                email: true,
                phone: true,
                address: true
            }
        },
        visibility: {
            company: true,
            jobTitle: true,
            date: true,
            hiringManager: true
        },
        tone: 'neutral',
        length: 'medium',
        body: '',
        style: {
            fontFamily: 'font-sans',
            fontSize: 11,
            headerFontColor: '#1e293b',
            contentFontColor: '#334155',
            lineSpacing: 1.5,
            margins: 8, // p-8 = 2rem
            paperSize: 'a4',
            headerAlignment: 'left',
            ...defaultTemplate.defaultStyle // Merge default styles from registry
        },
        isATSFriendlyMode: false
    };


    // History Hook for Undo/Redo
    const {
        state: editorState,
        set: setEditorStateHistory,
        updatePresent: updateEditorState,
        undo,
        redo,
        canUndo,
        canRedo
    } = useHistory<CoverLetterState>(initialState);

    // Helper to set state (compatible with old setEditorState)
    const setEditorState = (updates: Partial<CoverLetterState> | ((prev: CoverLetterState) => CoverLetterState)) => {
        if (typeof updates === 'function') {
            setEditorStateHistory(updates(editorState));
        } else {
            setEditorStateHistory({ ...editorState, ...updates });
        }
    };

    // UI State
    const [activeMethod, setActiveMethod] = useState<StartMethod>('blank');
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<string>('');
    const [jobDescription, setJobDescription] = useState('');
    const [aiPrompt, setAiPrompt] = useState('');
    const [pastedResumeText, setPastedResumeText] = useState('');
    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'visibility'>('content');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Status State
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // --- Data Fetching ---

    const fetchProfiles = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/profiles`, {
                withCredentials: true
            });
            setProfiles(response.data.profiles || []);
        } catch (err) {
            console.error('Failed to fetch profiles', err);
        }
    };

    const fetchCoverLetter = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${API_URL}/api/cover-letters/${coverId}`,
                { withCredentials: true }
            );

            const letter = response.data.cover_letter;
            // The backend now returns the full validated object in content
            // Fallback to old structure if needed for migration, but primarily use new structure
            const content = letter.content || {};

            // Handle legacy structure where content might be nested in content.content
            const legacyMetadata = content.metadata || {};
            const legacyContent = content.content || {};

            // Determine if we have new structure (flat) or old structure (nested)
            // New structure has 'contact' at top level of content object
            const isNewStructure = !!content.contact && !!content.style;

            let loadedState: CoverLetterState;

            if (isNewStructure) {
                loadedState = {
                    id: letter.cover_id,
                    title: content.title || letter.title || '',
                    templateId: content.templateId || 'modern',
                    jobTitle: content.jobTitle || '',
                    company: content.company || '',
                    date: content.date || new Date().toISOString().split('T')[0],
                    hiringManagerName: content.hiringManagerName || '',
                    contact: {
                        name: content.contact?.name || '',
                        email: content.contact?.email || '',
                        phone: content.contact?.phone || '',
                        address: content.contact?.address || '',
                        visibility: content.contact?.visibility || {
                            name: true, email: true, phone: true, address: true
                        }
                    },
                    visibility: content.visibility || {
                        company: true, jobTitle: true, date: true, hiringManager: true
                    },
                    tone: 'neutral',
                    length: 'medium',
                    body: content.body || '',
                    style: content.style || initialState.style,
                    autoSavedAt: new Date(letter.updated_at),
                    isATSFriendlyMode: false
                };

                // Load auxiliary state
                setJobDescription(content.jobDescription || '');
                setActiveMethod(content.resumeSource || 'blank');
                setSelectedProfileId(content.profileId || '');
                setAiPrompt(content.aiPrompt || '');

            } else {
                // Legacy fallback
                loadedState = {
                    id: letter.cover_id,
                    title: letter.title || '',
                    templateId: legacyMetadata.style?.templateId || 'modern',
                    jobTitle: legacyMetadata.job_title || '',
                    company: legacyMetadata.company || '',
                    date: legacyMetadata.date || new Date().toISOString().split('T')[0],
                    hiringManagerName: legacyMetadata.hiringManagerName || 'Hiring Manager',
                    contact: {
                        name: legacyMetadata.contact?.name || '',
                        email: legacyMetadata.contact?.email || '',
                        phone: legacyMetadata.contact?.phone || '',
                        address: legacyMetadata.address || '',
                        visibility: {
                            name: true, email: true, phone: true, address: true
                        }
                    },
                    visibility: {
                        company: true, jobTitle: true, date: true, hiringManager: true
                    },
                    tone: legacyMetadata.tone || 'neutral',
                    length: legacyMetadata.length || 'medium',
                    body: legacyContent.body || '',
                    style: {
                        ...initialState.style,
                        ...(legacyMetadata.style || {})
                    },
                    autoSavedAt: new Date(letter.updated_at),
                    isATSFriendlyMode: false
                };
            }

            setEditorStateHistory(loadedState);

        } catch (err: any) {
            console.error('Failed to fetch cover letter:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/login');
                return;
            }
            showToast('Failed to load cover letter', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Handlers ---

    const handleStateChange = (updates: Partial<CoverLetterState>) => {
        setEditorState(prev => ({ ...prev, ...updates }));
    };

    const handleContactChange = (field: keyof CoverLetterState['contact'], value: any) => {
        setEditorState(prev => ({
            ...prev,
            contact: { ...prev.contact, [field]: value }
        }));
    };

    const handleVisibilityChange = (field: keyof CoverLetterState['contact']['visibility']) => {
        setEditorState(prev => ({
            ...prev,
            contact: {
                ...prev.contact,
                visibility: {
                    ...prev.contact.visibility,
                    [field]: !prev.contact.visibility[field]
                }
            }
        }));
    };

    const handleFieldVisibilityChange = (field: 'company' | 'jobTitle' | 'date' | 'hiringManager') => {
        setEditorState(prev => ({
            ...prev,
            visibility: {
                ...prev.visibility,
                [field]: !prev.visibility[field]
            }
        }));
    };

    const handleStyleChange = (updates: Partial<CoverLetterStyle>) => {
        setEditorState(prev => ({
            ...prev,
            style: { ...prev.style, ...updates }
        }));
    };

    const handleStartMethod = async (method: StartMethod) => {
        setActiveMethod(method);
        if (method === 'blank') {
            setEditorState(prev => ({
                ...prev,
                body: '',
                jobTitle: '',
                company: ''
            }));
            showToast('Started blank cover letter', 'info');
        }
    };

    const toggleATSMode = () => {
        setEditorState(prev => {
            const newMode = !prev.isATSFriendlyMode;
            if (newMode) {
                return {
                    ...prev,
                    isATSFriendlyMode: true,
                    style: {
                        ...prev.style,
                        fontFamily: 'font-sans',
                        fontSize: 12,
                        headerFontColor: '#000000',
                        contentFontColor: '#000000',
                        lineSpacing: 1.5,
                        sectionSpacing: 6,
                        margins: 10,
                        headerAlignment: 'left'
                    },
                    templateId: 'minimal'
                };
            } else {
                return {
                    ...prev,
                    isATSFriendlyMode: false
                };
            }
        });
        showToast(editorState.isATSFriendlyMode ? 'ATS Mode Disabled' : 'ATS Mode Enabled', 'success');
    };

    // --- AI Generation ---

    const generateContent = async (type: 'persona' | 'job_desc' | 'rewrite' | 'shorten', additionalData?: any) => {
        setIsGenerating(true);

        try {
            const payload: any = {
                tone: editorState.tone,
                length: editorState.length,
                job_description: jobDescription,
                profile_id: selectedProfileId
            };

            if (type === 'rewrite') {
                payload.instruction = 'Rewrite the cover letter to be more persuasive.';
                payload.current_text = editorState.body;
            } else if (type === 'shorten') {
                payload.instruction = 'Shorten the cover letter.';
                payload.current_text = editorState.body;
            }

            let userPayload = '';
            if (selectedProfileId) {
                const profile = profiles.find(p => p.id === selectedProfileId);
                if (profile) {
                    userPayload = JSON.stringify(profile);
                }
            }

            // Fetch full persona data if persona is selected
            let personaData = null;
            if (selectedProfileId && activeMethod === 'persona') {
                try {
                    const personaResponse = await axios.get(
                        `${API_URL}/api/profile/switch/${selectedProfileId}`,
                        { withCredentials: true }
                    );
                    personaData = personaResponse.data.profile;
                } catch (err) {
                    console.error('Failed to fetch persona data', err);
                }
            }

            const response = await axios.post(
                `${API_URL}/api/cover_letter`,
                {
                    job_description: jobDescription || '',
                    job_title: editorState.jobTitle || '',
                    company: editorState.company || '',
                    resume_text: pastedResumeText || '',
                    ai_prompt: aiPrompt || '',
                    body: editorState.body || '',
                    // Include persona data if available
                    ...(personaData && {
                        profile_id: personaData.id,
                        first_name: personaData.first_name,
                        last_name: personaData.last_name,
                        profile_email: personaData.profile_email,
                        phone: personaData.phone,
                        address: personaData.address,
                        work_experience: personaData.work_experience,
                        skills: personaData.skills,
                        certifications: personaData.certifications
                    }),
                    user_payload: userPayload,
                    tone: editorState.tone,
                    length: editorState.length,
                    instruction: type === 'rewrite' || type === 'shorten' ? payload.instruction : undefined,
                    current_text: type === 'rewrite' || type === 'shorten' ? payload.current_text : undefined
                },
                { withCredentials: true }
            );

            if (response.data.body) {
                setEditorState(prev => ({
                    ...prev,
                    body: response.data.body
                }));
                showToast('Content generated successfully', 'success');
            }
        } catch (err) {
            console.error('Generation failed', err);
            showToast('Failed to generate content', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateFromPersona = async () => {
        if (!selectedProfileId) return;
        const profile = profiles.find(p => p.id === selectedProfileId);
        if (!profile) return;

        setEditorState(prev => ({
            ...prev,
            contact: {
                ...prev.contact,
                name: `${profile.first_name} ${profile.last_name}`,
                email: profile.email,
                phone: profile.phone,
                address: profile.address
            },
            personaId: profile.id
        }));

        await generateContent('persona');
    };

    const handleGenerateFromJobDesc = async () => {
        if (!jobDescription) return;
        await generateContent('job_desc');
    };

    const handleAIAction = async (action: 'rewrite' | 'shorten') => {
        if (!editorState.body) return;
        await generateContent(action);
    };

    const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.pdf')) {
            showToast('Please upload a PDF file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('File too large (max 5MB)', 'error');
            return;
        }

        setIsGenerating(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(
                `${API_URL}/api/resume/upload`,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            if (response.data.success) {
                setPastedResumeText(response.data.resume_text);
                setActiveMethod('job_desc'); // Switch to paste mode to show the extracted text
                showToast(`Resume uploaded successfully (${response.data.char_count} characters)`, 'success');
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Failed to upload resume';
            showToast(errorMsg, 'error');
        } finally {
            setIsGenerating(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            // Construct payload matching CoverLetterDataSchema
            const payload = {
                title: editorState.title,
                templateId: editorState.templateId,
                jobTitle: editorState.jobTitle,
                company: editorState.company,
                date: editorState.date,
                hiringManagerName: editorState.hiringManagerName,
                contact: {
                    name: editorState.contact.name,
                    email: editorState.contact.email,
                    phone: editorState.contact.phone,
                    address: editorState.contact.address,
                    visibility: editorState.contact.visibility
                },
                visibility: editorState.visibility,
                style: editorState.style,
                body: editorState.body,

                // Additional Metadata
                jobDescription: jobDescription,
                aiPrompt: aiPrompt
            };

            if (isEditing) {
                await axios.put(
                    `${API_URL}/api/cover-letters/${coverId}`,
                    payload,
                    { withCredentials: true }
                );
            } else {
                const response = await axios.post(
                    `${API_URL}/api/cover-letters`,
                    payload,
                    { withCredentials: true }
                );
                if (!isEditing) {
                    navigate(`/cover-letters/${response.data.cover_letter.cover_id}`, { replace: true });
                }
            }
            setEditorState(prev => ({ ...prev, autoSavedAt: new Date() }));
            showToast('Saved successfully', 'success');
        } catch (err) {
            console.error('Save failed', err);
            showToast('Failed to save', 'error');
        } finally {
            setIsSaving(false);
        }
    }, [editorState, isEditing, coverId, navigate, showToast, jobDescription, activeMethod, selectedProfileId, aiPrompt]);

    // --- ATS Compliance ---

    const checkATSCompliance = () => {
        const issues: string[] = [];

        // Check Fonts
        if (editorState.style.fontFamily === 'font-creative') {
            issues.push('Creative fonts may not be parsed correctly by older ATS. Recommend Sans-Serif or Serif.');
        }

        // Check Layout
        if (editorState.templateId === 'creative') {
            issues.push('Creative templates with complex layouts might confuse some ATS parsers.');
        }

        // Check Content Length
        if (editorState.body.length < 100) {
            issues.push('Cover letter seems too short.');
        } else if (editorState.body.length > 3000) {
            issues.push('Cover letter is quite long. Ensure it fits on one page for best results.');
        }

        if (issues.length > 0) {
            alert(`ATS Compliance Issues Found:\n\n- ${issues.join('\n- ')}\n\nConsider adjusting for maximum compatibility.`);
        } else {
            showToast('ATS Check Passed! Your cover letter uses standard formatting safe for most systems.', 'success');
        }
    };

    const handleExportPDF = () => {
        checkATSCompliance();
        setTimeout(() => window.print(), 500);
    };

    // --- Effects ---

    useEffect(() => {
        fetchProfiles();
        if (isEditing) {
            fetchCoverLetter();
        }
    }, [coverId]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    if (canRedo) {
                        redo();
                        showToast('Redo', 'info');
                    }
                } else {
                    if (canUndo) {
                        undo();
                        showToast('Undo', 'info');
                    }
                }
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo, editorState, handleSave, showToast]); // Dependencies for closure

    // --- Render Helpers ---

    if (isLoading) {
        return (
            <div className="min-h-screen bg-lavender-tint flex items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-brand-accent rounded-full"></div>
            </div>
        );
    }


    return (
        <div className="h-screen bg-lavender-tint flex flex-col overflow-hidden">
            <div className="shrink-0 h-16 print:hidden relative z-50">
                <AuthNavbar />
            </div>

            {/* Main Container - Fills remaining height, clips overflow */}
            <div className="flex-1 h-[calc(100vh-64px)] overflow-hidden">
                <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col lg:flex-row gap-4 px-4 lg:px-6 py-4 lg:py-6">

                    {/* LEFT COLUMN - Controls & Editor */}
                    <div className="flex-1 lg:w-[45%] lg:flex-none flex flex-col bg-transparent overflow-hidden print:hidden relative z-10 min-h-0 order-2 lg:order-1">

                        {/* Header Actions - Sticky within scrollable area if needed, or fixed at top of column */}
                        <div className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-primary p-4 mb-4 shrink-0">
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={undo}
                                    disabled={!canUndo}
                                    className="px-4 py-2 border-2 border-primary text-primary font-bold uppercase text-sm hover:bg-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Undo (Cmd/Ctrl+Z)"
                                >
                                    Undo
                                </button>
                                <button
                                    onClick={redo}
                                    disabled={!canRedo}
                                    className="px-4 py-2 border-2 border-primary text-primary font-bold uppercase text-sm hover:bg-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Redo (Cmd/Ctrl+Shift+Z)"
                                >
                                    Redo
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-brand-accent text-white font-bold uppercase text-sm hover:bg-primary transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>

                        {/* Editor Content Wrapper - No outer scroll */}
                        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                            {/* Tabs Navigation */}
                            <div className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-primary overflow-hidden mb-4 shrink-0">
                                <div className="flex border-b-2 border-primary">
                                    <button
                                        onClick={() => setActiveTab('content')}
                                        className={`flex-1 px-4 py-3 font-bold uppercase text-sm transition-colors ${activeTab === 'content'
                                            ? 'bg-primary text-white'
                                            : 'bg-white/50 text-primary hover:bg-white/80'
                                            }`}
                                    >
                                        Content
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('style')}
                                        className={`flex-1 px-4 py-3 font-bold uppercase text-sm transition-colors ${activeTab === 'style'
                                            ? 'bg-primary text-white'
                                            : 'bg-white/50 text-primary hover:bg-white/80'
                                            }`}
                                    >
                                        Style & Design
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('visibility')}
                                        className={`flex-1 px-4 py-3 font-bold uppercase text-sm transition-colors ${activeTab === 'visibility'
                                            ? 'bg-primary text-white'
                                            : 'bg-white/50 text-primary hover:bg-white/80'
                                            }`}
                                    >
                                        Visibility
                                    </button>
                                </div>
                            </div>

                            {/* Main Editor Panel - Fixed with inner scroll */}
                            <div className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-primary min-h-0 flex-1 flex flex-col overflow-hidden relative">
                                <div className="absolute inset-0 overflow-y-auto p-4">
                                    {/* CONTENT TAB */}
                                    {activeTab === 'content' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-left-2">
                                            <BaselineControls
                                                title={editorState.title}
                                                templateId={editorState.templateId}
                                                jobTitle={editorState.jobTitle}
                                                company={editorState.company}
                                                date={editorState.date}
                                                hiringManagerName={editorState.hiringManagerName}
                                                contact={editorState.contact}
                                                visibility={editorState.visibility}
                                                onUpdate={(field, value) => handleStateChange({ [field]: value })}
                                                onContactUpdate={handleContactChange}
                                                onVisibilityUpdate={handleVisibilityChange}
                                                onFieldVisibilityUpdate={handleFieldVisibilityChange}
                                            />

                                            {/* Job Description Section */}
                                            <div className="bg-white border-2 border-primary shadow-lg p-4">
                                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Job Description</label>
                                                <textarea
                                                    value={jobDescription}
                                                    onChange={(e) => setJobDescription(e.target.value)}
                                                    placeholder="Paste the job description here..."
                                                    className="w-full p-2 border border-slate-300 text-sm h-24"
                                                />
                                            </div>

                                            {/* User Data Section */}
                                            <div className="bg-white border-2 border-primary shadow-lg p-4">
                                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">User Data (Resume)</label>
                                                <div className="space-y-3">
                                                    {/* Radio Options */}
                                                    <div className="flex gap-4">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="userDataSource"
                                                                value="persona"
                                                                checked={activeMethod === 'persona'}
                                                                onChange={() => handleStartMethod('persona')}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm font-medium">From Persona</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="userDataSource"
                                                                value="job_desc"
                                                                checked={activeMethod === 'job_desc'}
                                                                onChange={() => handleStartMethod('job_desc')}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm font-medium">Paste Resume</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="userDataSource"
                                                                value="upload"
                                                                checked={activeMethod === 'upload'}
                                                                onChange={() => handleStartMethod('upload')}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm font-medium">Upload PDF</span>
                                                        </label>
                                                    </div>

                                                    {/* Conditional Content Based on Selection */}
                                                    {activeMethod === 'persona' && (
                                                        <div className="mt-3">
                                                            <select
                                                                value={selectedProfileId}
                                                                onChange={(e) => setSelectedProfileId(e.target.value)}
                                                                className="w-full p-2 border border-slate-300 text-sm"
                                                            >
                                                                <option value="">Choose a persona...</option>
                                                                {profiles.map(p => (
                                                                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name} ({p.job_sector})</option>
                                                                ))}
                                                            </select>
                                                            <button
                                                                onClick={handleGenerateFromPersona}
                                                                disabled={!selectedProfileId || isGenerating}
                                                                className="w-full mt-2 px-4 py-2 bg-brand-accent text-white font-bold uppercase text-sm hover:bg-primary transition-colors disabled:opacity-50"
                                                            >
                                                                {isGenerating ? 'Generating...' : 'Generate from Persona'}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {activeMethod === 'job_desc' && (
                                                        <div className="mt-3">
                                                            <textarea
                                                                value={pastedResumeText}
                                                                onChange={(e) => setPastedResumeText(e.target.value)}
                                                                placeholder="Paste your resume text here..."
                                                                className="w-full p-2 border border-slate-300 text-sm h-32"
                                                            />
                                                            <button
                                                                onClick={handleGenerateFromJobDesc}
                                                                disabled={!pastedResumeText || isGenerating}
                                                                className="w-full mt-2 px-4 py-2 bg-brand-accent text-white font-bold uppercase text-sm hover:bg-primary transition-colors disabled:opacity-50"
                                                            >
                                                                {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {activeMethod === 'upload' && (
                                                        <div className="mt-3">
                                                            <div
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="border-2 border-dashed border-slate-300 p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                                                            >
                                                                <span className="material-symbols-outlined text-3xl text-slate-400 mb-2 block">cloud_upload</span>
                                                                <p className="text-sm text-slate-600 font-bold">Click to upload PDF resume</p>
                                                                <p className="text-xs text-slate-400 mt-1">PDF only (Max 5MB)</p>
                                                                <input
                                                                    ref={fileInputRef}
                                                                    type="file"
                                                                    accept=".pdf"
                                                                    onChange={handlePDFUpload}
                                                                    className="hidden"
                                                                />
                                                            </div>
                                                            {pastedResumeText && (
                                                                <div className="mt-2 p-2 bg-green-50 border border-green-200 text-xs text-green-700">
                                                                    ✓ Resume extracted ({pastedResumeText.length} characters)
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Prompt Section */}
                                            <div className="bg-white border-2 border-primary shadow-lg p-4">
                                                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">AI Prompt (Optional)</label>
                                                <div className="flex flex-col md:flex-row gap-2">
                                                    <input
                                                        type="text"
                                                        value={aiPrompt}
                                                        onChange={(e) => setAiPrompt(e.target.value)}
                                                        placeholder="e.g., Make it more formal, emphasize leadership skills..."
                                                        className="flex-1 p-2 border border-slate-300 text-sm"
                                                    />
                                                    <button
                                                        onClick={handleGenerateFromJobDesc}
                                                        disabled={!jobDescription || isGenerating}
                                                        className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase hover:bg-brand-accent disabled:opacity-50"
                                                    >
                                                        {isGenerating ? 'Generating...' : 'Generate from Prompt'}
                                                    </button>
                                                </div>
                                            </div>

                                            <BodyEditor
                                                body={editorState.body}
                                                isGenerating={isGenerating}
                                                onUpdate={(value) => handleStateChange({ body: value })}
                                                onAIAction={handleAIAction}
                                            />
                                        </div>
                                    )}

                                    {/* STYLE TAB */}
                                    {activeTab === 'style' && (
                                        <div className="animate-in fade-in slide-in-from-right-2 h-full">
                                            <StylePanel
                                                style={editorState.style}
                                                templateId={editorState.templateId}
                                                onUpdate={handleStyleChange}
                                                onTemplateUpdate={(templateId) => handleStateChange({ templateId })}
                                            />
                                        </div>
                                    )}

                                    {/* VISIBILITY TAB */}
                                    {activeTab === 'visibility' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-2">

                                            {/* Contact Information Visibility */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <h3 className="text-base md:text-lg font-bold text-primary uppercase mb-4 flex items-center gap-2">
                                                    <span className="material-symbols-outlined">contact_mail</span>
                                                    Contact Information
                                                </h3>
                                                <div className="space-y-2">
                                                    {(Object.entries(editorState.contact.visibility) as [keyof typeof editorState.contact.visibility, boolean][]).map(([key, value]) => (
                                                        <label key={key} className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={value}
                                                                onChange={() => handleVisibilityChange(key)}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="capitalize">{key}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Letter Fields Visibility */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <h3 className="text-base md:text-lg font-bold text-primary uppercase mb-4 flex items-center gap-2">
                                                    <span className="material-symbols-outlined">description</span>
                                                    Letter Fields
                                                </h3>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={editorState.visibility.company}
                                                            onChange={() => handleFieldVisibilityChange('company')}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Company</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={editorState.visibility.jobTitle}
                                                            onChange={() => handleFieldVisibilityChange('jobTitle')}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Job Title</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={editorState.visibility.date}
                                                            onChange={() => handleFieldVisibilityChange('date')}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Date</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={editorState.visibility.hiringManager}
                                                            onChange={() => handleFieldVisibilityChange('hiringManager')}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Hiring Manager</span>
                                                    </label>
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Preview (Fills remaining space) */}
                    <div className="flex-1 lg:flex-none lg:w-[55%] flex flex-col gap-6 print:w-full print:p-0 min-h-0 order-1 lg:order-2">

                        {/* Preview Controls */}
                        <div className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-primary p-4 print:hidden shrink-0">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-slate-500">Live Preview</span>
                                <button
                                    onClick={handleExportPDF}
                                    className="px-3 py-1.5 text-xs font-bold uppercase text-white bg-slate-800 hover:bg-black flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                                    Export PDF
                                </button>
                            </div>
                        </div>

                        {/* Preview Frame */}
                        <div className="flex-1 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-primary overflow-hidden relative print:bg-white print:border-0 print:shadow-none print:p-0 print:overflow-visible min-h-0" style={{ backgroundColor: '#f1f5f9' }}>
                            <div className="absolute inset-0 overflow-auto flex items-start justify-center p-4 lg:p-8">
                                <div className="transition-transform duration-200 scale-[0.4] origin-top md:scale-[0.5] lg:scale-[0.65] xl:scale-[0.85] 2xl:scale-100">
                                    <PreviewFrame
                                        data={{
                                            title: editorState.title,
                                            jobTitle: editorState.jobTitle,
                                            company: editorState.company,
                                            date: editorState.date,
                                            hiringManagerName: editorState.hiringManagerName,
                                            contact: editorState.contact,
                                            body: editorState.body
                                        }}
                                        style={editorState.style}
                                        templateId={editorState.templateId}
                                        isATSFriendlyMode={editorState.isATSFriendlyMode}
                                        visibility={editorState.visibility}
                                        onExportPDF={handleExportPDF}
                                        onCheckATS={checkATSCompliance}
                                        onToggleATSMode={toggleATSMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Wrapper for Context
const CoverLetterEditor: React.FC = () => {
    return (
        <ToastProvider>
            <CoverLetterEditorContent />
        </ToastProvider>
    );
};

export default CoverLetterEditor;

