/**
 * Resume Editor Page
 * Create and edit resumes with live preview
 * Matches Cover Letter Editor layout
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import AuthNavbar from '../components/AuthNavbar';
import Notification from '../components/Notification';
import { useHistory } from '../hooks/useHistory';

// State Interfaces
interface WorkExperience {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface Education {
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface Skill {
    id: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface Certification {
    id: string;
    name: string;
    authority: string;
    licenseNumber: string;
    certLink: string;
    startDate: string;
    endDate?: string;
    description: string;
}

interface Link {
    id: string;
    service: string;
    linkUrl: string;
}

interface OtherSection {
    id: string;
    title: string;
    content: string;
}

interface VisibilitySettings {
    personalInfo: {
        email: boolean;
        phone: boolean;
        address: boolean;
        city: boolean;
        country: boolean;
        linkedIn: boolean;
        website: boolean;
    };
    summary: boolean;
    workExperience: {
        visible: boolean;
        showLocation: boolean;
        showDates: boolean;
        showDescription: boolean;
    };
    education: {
        visible: boolean;
        showLocation: boolean;
        showDates: boolean;
        showDescription: boolean;
    };
    skills: boolean;
    certifications: {
        visible: boolean;
        showLicenseNumber: boolean;
        showLink: boolean;
        showDates: boolean;
        showDescription: boolean;
    };
    links: boolean;
    others: boolean;
}

interface ResumeState {
    id?: string;
    title: string;
    templateId: string;

    // Personal Information
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        country: string;
        linkedIn?: string;
        website?: string;
    };

    // Professional Summary
    summary: string;

    // Sections
    workExperience: WorkExperience[];
    education: Education[];
    skills: Skill[];
    certifications: Certification[];
    links: Link[];
    others: OtherSection[];

    // Section Order (for drag-and-drop)
    sectionOrder: string[];

    // Style
    style: {
        fontFamily: string;
        fontSize: number;
        headerFontColor: string;
        contentFontColor: string;
        lineSpacing: number;
        margins: number;
        paperSize: 'a4' | 'letter';
        headerAlignment: 'left' | 'center' | 'right';
    };

    // Visibility
    visibility: VisibilitySettings;
}

const initialState: ResumeState = {
    title: '',
    templateId: 'modern',
    personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        linkedIn: '',
        website: ''
    },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    links: [],
    others: [],
    sectionOrder: ['summary', 'workExperience', 'education', 'skills', 'certifications', 'links', 'others'],
    style: {
        fontFamily: 'font-sans',
        fontSize: 11,
        headerFontColor: '#1e293b',
        contentFontColor: '#334155',
        lineSpacing: 1.5,
        margins: 8,
        paperSize: 'a4',
        headerAlignment: 'left'
    },
    visibility: {
        personalInfo: {
            email: true,
            phone: true,
            address: true,
            city: true,
            country: true,
            linkedIn: true,
            website: true
        },
        summary: true,
        workExperience: {
            visible: true,
            showLocation: true,
            showDates: true,
            showDescription: true
        },
        education: {
            visible: true,
            showLocation: true,
            showDates: true,
            showDescription: true
        },
        skills: true,
        certifications: {
            visible: true,
            showLicenseNumber: true,
            showLink: true,
            showDates: true,
            showDescription: true
        },
        links: true,
        others: true
    }
};

interface ResumeCreationModalProps {
    onClose: () => void;
    onUploadSuccess: (data: Partial<ResumeState>) => void;
}

const ResumeCreationModal: React.FC<ResumeCreationModalProps> = ({ onClose, onUploadSuccess }) => {
    const [mode, setMode] = useState<'selection' | 'prompt'>('selection');
    const [prompt, setPrompt] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${API_URL}/api/resume/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );

            if (response.data.success && response.data.resume_data) {
                onUploadSuccess(response.data.resume_data);
                onClose();
            }
        } catch (err: any) {
            console.error('Upload failed:', err);
            const errorMessage = err.response?.data?.error || 'Failed to upload resume';
            alert(errorMessage);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (mode === 'prompt') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-lg border-2 border-primary shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative">
                    {isUploading && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                            <div className="animate-spin h-16 w-16 border-4 border-primary border-t-brand-accent rounded-full mb-4"></div>
                            <p className="text-xl font-bold text-primary uppercase animate-pulse">Generating Resume...</p>
                            <p className="text-sm text-slate-600 font-medium mt-2">This may take a moment</p>
                        </div>
                    )}
                    <div className="p-6 border-b-2 border-primary flex justify-between items-center bg-slate-50">
                        <h2 className="text-xl font-bold text-primary uppercase flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">auto_awesome</span>
                            Generate with AI
                        </h2>
                        <button
                            onClick={() => setMode('selection')}
                            disabled={isUploading}
                            className="w-8 h-8 flex items-center justify-center border-2 border-transparent hover:border-primary hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-primary">close</span>
                        </button>
                    </div>
                    <div className="p-6">
                        <p className="text-primary font-medium mb-4 text-sm uppercase tracking-wide">
                            Describe your experience, skills, and goals.
                        </p>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full h-40 p-4 border-2 border-primary focus:border-brand-accent outline-none resize-none text-primary text-sm font-mono bg-white"
                            placeholder="I AM A SOFTWARE ENGINEER WITH 5 YEARS OF EXPERIENCE..."
                        />
                    </div>
                    <div className="p-6 border-t-2 border-primary bg-slate-50 flex justify-end gap-3">
                        <button
                            onClick={() => setMode('selection')}
                            className="px-6 py-2 border-2 border-primary text-primary font-bold uppercase text-sm hover:bg-white transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={async () => {
                                if (!prompt.trim()) {
                                    alert('Please enter a description');
                                    return;
                                }

                                if (prompt.trim().split(/\s+/).length < 10) {
                                    alert('Please provide a more detailed description (at least 10 words)');
                                    return;
                                }

                                setIsUploading(true);

                                try {
                                    const response = await axios.post(
                                        `${API_URL}/api/resume/generate-from-prompt`,
                                        { prompt: prompt },
                                        { withCredentials: true }
                                    );

                                    if (response.data.success && response.data.resume_data) {
                                        onUploadSuccess(response.data.resume_data);
                                        onClose();
                                    }
                                } catch (err: any) {
                                    console.error('Generation failed:', err);
                                    const errorMessage = err.response?.data?.error || 'Failed to generate resume';
                                    alert(errorMessage);
                                } finally {
                                    setIsUploading(false);
                                }
                            }}
                            disabled={isUploading || !prompt.trim()}
                            className={`px-6 py-2 border-2 border-primary font-bold uppercase text-sm flex items-center gap-2 ${isUploading || !prompt.trim()
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                : 'bg-brand-accent text-white hover:bg-primary transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px]'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">auto_awesome</span>
                            {isUploading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {isUploading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="animate-spin h-16 w-16 border-4 border-primary border-t-brand-accent rounded-full mb-4"></div>
                    <p className="text-xl font-bold text-primary uppercase animate-pulse">Analyzing Resume...</p>
                    <p className="text-sm text-slate-600 font-medium mt-2">This may take a moment</p>
                </div>
            )}
            <div className="bg-white w-full max-w-4xl border-2 border-primary shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
                <div className="p-8 text-center border-b-2 border-primary bg-slate-50">
                    <h2 className="text-3xl font-black text-primary uppercase mb-2 tracking-tight">Create Your Resume</h2>
                    <p className="text-slate-600 font-bold uppercase text-sm tracking-widest">Choose your path</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white">
                    {/* Option 1: Upload PDF */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center p-4 md:p-8 border-r-2 border-b-2 md:border-b-0 border-primary hover:bg-lavender-tint transition-all group text-center relative overflow-hidden"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".pdf"
                            className="hidden"
                        />
                        <div className="w-14 h-14 md:w-20 md:h-20 border-2 border-primary bg-white flex items-center justify-center mb-3 md:mb-6 group-hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                            <span className="material-symbols-outlined text-3xl md:text-4xl text-primary">upload_file</span>
                        </div>
                        <h3 className="font-black text-primary uppercase text-base md:text-lg mb-2 md:mb-3">Upload PDF</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed max-w-[200px]">Extract data from your existing resume</p>
                    </button>

                    {/* Option 2: Start from Scratch */}
                    <button
                        onClick={onClose}
                        className="flex flex-col items-center p-4 md:p-8 border-r-2 border-b-2 md:border-b-0 border-primary hover:bg-lavender-tint transition-all group text-center"
                    >
                        <div className="w-14 h-14 md:w-20 md:h-20 border-2 border-primary bg-brand-accent flex items-center justify-center mb-3 md:mb-6 group-hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                            <span className="material-symbols-outlined text-3xl md:text-4xl text-white">edit_document</span>
                        </div>
                        <h3 className="font-black text-primary uppercase text-base md:text-lg mb-2 md:mb-3">Start from Scratch</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed max-w-[200px]">Fill in your details manually</p>
                    </button>

                    {/* Option 3: AI Prompt */}
                    <button
                        onClick={() => setMode('prompt')}
                        className="flex flex-col items-center p-4 md:p-8 border-primary hover:bg-lavender-tint transition-all group text-center"
                    >
                        <div className="w-14 h-14 md:w-20 md:h-20 border-2 border-primary bg-white flex items-center justify-center mb-3 md:mb-6 group-hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                            <span className="material-symbols-outlined text-3xl md:text-4xl text-brand-accent">auto_awesome</span>
                        </div>
                        <h3 className="font-black text-primary uppercase text-base md:text-lg mb-2 md:mb-3">AI Assistant</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed max-w-[200px]">Generate from a simple text description</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

const ResumeEditor: React.FC = () => {
    const navigate = useNavigate();
    const { resumeId } = useParams<{ resumeId?: string }>();
    const isEditing = !!resumeId;
    const [showCreationModal, setShowCreationModal] = useState(!isEditing);

    useEffect(() => {
        if (!isEditing) {
            setShowCreationModal(true);
        }
    }, [isEditing]);

    // History Hook for Undo/Redo
    const {
        state: resumeState,
        set: setResumeStateHistory,
        updatePresent: updateResumeState,
        undo,
        redo,
        canUndo,
        canRedo
    } = useHistory<ResumeState>(initialState);

    // Helper to set state (compatible with old setResumeState)
    const setResumeState = (updates: Partial<ResumeState> | ((prev: ResumeState) => ResumeState)) => {
        if (typeof updates === 'function') {
            setResumeStateHistory(updates(resumeState));
        } else {
            setResumeStateHistory({ ...resumeState, ...updates });
        }
    };

    const [activeTab, setActiveTab] = useState<'content' | 'style' | 'visibility'>('content');

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (isEditing) {
            fetchResume();
        }
    }, [resumeId]);

    const fetchResume = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${API_URL}/api/resumes/${resumeId}`,
                { withCredentials: true }
            );

            const resume = response.data.resume;
            const content = resume.content || {};

            setResumeStateHistory({
                id: resume.resume_id,
                title: content.title || resume.title || 'Resume title',
                templateId: content.templateId || 'modern',
                personalInfo: content.personalInfo || initialState.personalInfo,
                summary: content.summary || '',
                workExperience: content.workExperience || [],
                education: content.education || [],
                skills: content.skills || [],
                certifications: content.certifications || [],
                links: content.links || [],
                others: content.others || [],
                sectionOrder: content.sectionOrder || initialState.sectionOrder,
                style: content.style || initialState.style,
                visibility: content.visibility || initialState.visibility
            });
        } catch (err: any) {
            console.error('Failed to fetch resume:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            const payload = {
                title: resumeState.title,
                job_sector: resumeState.title,
                templateId: resumeState.templateId,
                content: {
                    title: resumeState.title,
                    templateId: resumeState.templateId,
                    personalInfo: resumeState.personalInfo,
                    summary: resumeState.summary,
                    workExperience: resumeState.workExperience,
                    education: resumeState.education,
                    skills: resumeState.skills,
                    certifications: resumeState.certifications,
                    links: resumeState.links,
                    others: resumeState.others,
                    sectionOrder: resumeState.sectionOrder,
                    style: resumeState.style,
                    visibility: resumeState.visibility
                }
            };

            if (isEditing) {
                await axios.put(
                    `${API_URL}/api/resumes/${resumeId}`,
                    payload,
                    { withCredentials: true }
                );
                setNotification({ type: 'success', message: 'Resume saved successfully!' });
            } else {
                const response = await axios.post(
                    `${API_URL}/api/resumes`,
                    payload,
                    { withCredentials: true }
                );
                navigate(`/resumes/${response.data.resume.resume_id}`, { replace: true });
            }
        } catch (err: any) {
            console.error('Failed to save resume:', err);
            setNotification({
                type: 'error',
                message: err.response?.data?.error || 'Failed to save resume. Please try again.'
            });
        } finally {
            setIsSaving(false);
        }
    }, [resumeState, isEditing, resumeId, navigate]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    if (canRedo) {
                        redo();
                    }
                } else {
                    if (canUndo) {
                        undo();
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
    }, [canUndo, canRedo, handleSave]);

    // Helper functions for adding/removing items
    const addWorkExperience = () => {
        setResumeState(prev => ({
            ...prev,
            workExperience: [...prev.workExperience, {
                id: Date.now().toString(),
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }]
        }));
    };

    const removeWorkExperience = (id: string) => {
        setResumeState(prev => ({
            ...prev,
            workExperience: prev.workExperience.filter(exp => exp.id !== id)
        }));
    };

    const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
        setResumeState(prev => ({
            ...prev,
            workExperience: prev.workExperience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const addEducation = () => {
        setResumeState(prev => ({
            ...prev,
            education: [...prev.education, {
                id: Date.now().toString(),
                school: '',
                degree: '',
                fieldOfStudy: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }]
        }));
    };

    const removeEducation = (id: string) => {
        setResumeState(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const updateEducation = (id: string, field: keyof Education, value: any) => {
        setResumeState(prev => ({
            ...prev,
            education: prev.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const addSkill = () => {
        setResumeState(prev => ({
            ...prev,
            skills: [...prev.skills, {
                id: Date.now().toString(),
                name: '',
                level: 'intermediate'
            }]
        }));
    };

    const removeSkill = (id: string) => {
        setResumeState(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill.id !== id)
        }));
    };

    const updateSkill = (id: string, field: keyof Skill, value: any) => {
        setResumeState(prev => ({
            ...prev,
            skills: prev.skills.map(skill =>
                skill.id === id ? { ...skill, [field]: value } : skill
            )
        }));
    };

    const addCertification = () => {
        setResumeState(prev => ({
            ...prev,
            certifications: [...prev.certifications, {
                id: Date.now().toString(),
                name: '',
                authority: '',
                licenseNumber: '',
                certLink: '',
                startDate: '',
                endDate: '',
                description: ''
            }]
        }));
    };

    const removeCertification = (id: string) => {
        setResumeState(prev => ({
            ...prev,
            certifications: prev.certifications.filter(cert => cert.id !== id)
        }));
    };

    const updateCertification = (id: string, field: keyof Certification, value: any) => {
        setResumeState(prev => ({
            ...prev,
            certifications: prev.certifications.map(cert =>
                cert.id === id ? { ...cert, [field]: value } : cert
            )
        }));
    };

    const addLink = () => {
        setResumeState(prev => ({
            ...prev,
            links: [...prev.links, {
                id: Date.now().toString(),
                service: '',
                linkUrl: ''
            }]
        }));
    };

    const removeLink = (id: string) => {
        setResumeState(prev => ({
            ...prev,
            links: prev.links.filter(link => link.id !== id)
        }));
    };

    const updateLink = (id: string, field: keyof Link, value: any) => {
        setResumeState(prev => ({
            ...prev,
            links: prev.links.map(link =>
                link.id === id ? { ...link, [field]: value } : link
            )
        }));
    };

    const addOther = () => {
        setResumeState(prev => ({
            ...prev,
            others: [...prev.others, {
                id: Date.now().toString(),
                title: '',
                content: ''
            }]
        }));
    };

    const removeOther = (id: string) => {
        setResumeState(prev => ({
            ...prev,
            others: prev.others.filter(other => other.id !== id)
        }));
    };

    const updateOther = (id: string, field: keyof OtherSection, value: any) => {
        setResumeState(prev => ({
            ...prev,
            others: prev.others.map(other =>
                other.id === id ? { ...other, [field]: value } : other
            )
        }));
    };

    // Move section up or down
    const moveSectionUp = (sectionName: string) => {
        setResumeState(prev => {
            const currentIndex = prev.sectionOrder.indexOf(sectionName);
            if (currentIndex > 0) {
                const newOrder = [...prev.sectionOrder];
                [newOrder[currentIndex - 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex - 1]];
                return { ...prev, sectionOrder: newOrder };
            }
            return prev;
        });
    };

    const moveSectionDown = (sectionName: string) => {
        setResumeState(prev => {
            const currentIndex = prev.sectionOrder.indexOf(sectionName);
            if (currentIndex < prev.sectionOrder.length - 1) {
                const newOrder = [...prev.sectionOrder];
                [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
                return { ...prev, sectionOrder: newOrder };
            }
            return prev;
        });
    };

    // AI Enhancement State
    const [enhancingField, setEnhancingField] = useState<string | null>(null);

    // AI Enhancement Handler
    const handleEnhanceText = async (
        sectionType: 'summary' | 'work_description' | 'education_description' | 'certification_description' | 'skills',
        currentText: string,
        context: any,
        onSuccess: (enhancedText: string) => void,
        fieldId?: string
    ) => {
        const fieldKey = fieldId ? `${sectionType}_${fieldId}` : sectionType;
        setEnhancingField(fieldKey);

        try {
            const response = await axios.post(
                `${API_URL}/api/resume/enhance-text`,
                {
                    section_type: sectionType,
                    current_text: currentText,
                    context: context
                },
                { withCredentials: true }
            );

            if (response.data.enhanced_text) {
                onSuccess(response.data.enhanced_text);
                setNotification({ type: 'success', message: currentText ? 'Text enhanced successfully!' : 'Text generated successfully!' });
            }
        } catch (err: any) {
            console.error('Enhancement failed:', err);
            setNotification({
                type: 'error',
                message: err.response?.data?.error || 'Failed to enhance text. Please try again.'
            });
        } finally {
            setEnhancingField(null);
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-lavender-tint flex items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-brand-accent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-lavender-tint flex flex-col overflow-hidden">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            {showCreationModal && (
                <ResumeCreationModal
                    onClose={() => setShowCreationModal(false)}
                    onUploadSuccess={(data) => {
                        setResumeState(prev => ({
                            ...prev,
                            ...data,
                            // Ensure arrays are initialized if missing
                            workExperience: data.workExperience || [],
                            education: data.education || [],
                            skills: data.skills || [],
                            certifications: data.certifications || [],
                            links: data.links || [],
                            others: data.others || [],
                            // Ensure visibility is initialized
                            visibility: data.visibility || initialState.visibility
                        }));
                    }}
                />
            )}
            <div className="shrink-0 h-16 print:hidden relative z-50">
                <AuthNavbar />
            </div>

            <div className="flex-1 h-[calc(100vh-64px)] overflow-hidden">
                <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col lg:flex-row gap-4 px-4 lg:px-6 py-4 lg:py-6">

                    {/* LEFT COLUMN - Controls & Editor (45%) */}
                    <div className="flex-1 lg:w-[45%] lg:flex-none flex flex-col bg-transparent overflow-hidden print:hidden relative z-10 min-h-0 order-2 lg:order-1">

                        {/* Action Buttons - Fixed at Top */}
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

                                            {/* Job Sector */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Job Sector</label>
                                                <input
                                                    type="text"
                                                    value={resumeState.title}
                                                    onChange={(e) => setResumeState(prev => ({ ...prev, title: e.target.value }))}
                                                    className="w-full p-3 border-2 border-slate-300 focus:border-brand-accent outline-none"
                                                    placeholder="e.g., Software Engineer"
                                                />
                                            </div>

                                            {/* Personal Information */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <h3 className="text-lg font-bold text-primary uppercase mb-4 flex items-center gap-2">
                                                    <span className="material-symbols-outlined">person</span>
                                                    Personal Information
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">First Name</label>
                                                            <input
                                                                type="text"
                                                                value={resumeState.personalInfo.firstName}
                                                                onChange={(e) => setResumeState(prev => ({
                                                                    ...prev,
                                                                    personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                                                                }))}
                                                                className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Last Name</label>
                                                            <input
                                                                type="text"
                                                                value={resumeState.personalInfo.lastName}
                                                                onChange={(e) => setResumeState(prev => ({
                                                                    ...prev,
                                                                    personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                                                                }))}
                                                                className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
                                                        <input
                                                            type="email"
                                                            value={resumeState.personalInfo.email}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                personalInfo: { ...prev.personalInfo, email: e.target.value }
                                                            }))}
                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone</label>
                                                        <input
                                                            type="tel"
                                                            value={resumeState.personalInfo.phone}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                personalInfo: { ...prev.personalInfo, phone: e.target.value }
                                                            }))}
                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Address</label>
                                                        <input
                                                            type="text"
                                                            value={resumeState.personalInfo.address}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                personalInfo: { ...prev.personalInfo, address: e.target.value }
                                                            }))}
                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">City</label>
                                                            <input
                                                                type="text"
                                                                value={resumeState.personalInfo.city}
                                                                onChange={(e) => setResumeState(prev => ({
                                                                    ...prev,
                                                                    personalInfo: { ...prev.personalInfo, city: e.target.value }
                                                                }))}
                                                                className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Country</label>
                                                            <input
                                                                type="text"
                                                                value={resumeState.personalInfo.country}
                                                                onChange={(e) => setResumeState(prev => ({
                                                                    ...prev,
                                                                    personalInfo: { ...prev.personalInfo, country: e.target.value }
                                                                }))}
                                                                className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">LinkedIn (Optional)</label>
                                                        <input
                                                            type="url"
                                                            value={resumeState.personalInfo.linkedIn}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                personalInfo: { ...prev.personalInfo, linkedIn: e.target.value }
                                                            }))}
                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                            placeholder="https://linkedin.com/in/yourprofile"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Website (Optional)</label>
                                                        <input
                                                            type="url"
                                                            value={resumeState.personalInfo.website}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                personalInfo: { ...prev.personalInfo, website: e.target.value }
                                                            }))}
                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                            placeholder="https://yourwebsite.com"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Professional Summary */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <h3 className="text-lg font-bold text-primary uppercase mb-4 flex items-center gap-2">
                                                    <span className="material-symbols-outlined">description</span>
                                                    Professional Summary
                                                </h3>
                                                <textarea
                                                    value={resumeState.summary}
                                                    onChange={(e) => setResumeState(prev => ({ ...prev, summary: e.target.value }))}
                                                    className="w-full h-32 p-3 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm resize-none"
                                                    placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
                                                />
                                                <button
                                                    onClick={() => {
                                                        const wordCount = resumeState.summary.trim().split(/\s+/).filter(w => w.length > 0).length;
                                                        if (resumeState.summary.trim() && wordCount < 3) {
                                                            setNotification({ type: 'error', message: 'Please write at least 3 words before enhancing' });
                                                            return;
                                                        }

                                                        // If generating (empty), send rich context. If enhancing, send minimal context
                                                        const context = resumeState.summary.trim() ? {} : {
                                                            firstName: resumeState.personalInfo.firstName,
                                                            lastName: resumeState.personalInfo.lastName,
                                                            workExperience: resumeState.workExperience.map(exp => ({
                                                                title: exp.title,
                                                                company: exp.company
                                                            })),
                                                            education: resumeState.education.map(edu => ({
                                                                degree: edu.degree,
                                                                fieldOfStudy: edu.fieldOfStudy,
                                                                school: edu.school
                                                            }))
                                                        };

                                                        handleEnhanceText(
                                                            'summary',
                                                            resumeState.summary,
                                                            context,
                                                            (enhancedText) => setResumeState(prev => ({ ...prev, summary: enhancedText }))
                                                        );
                                                    }}
                                                    disabled={enhancingField === 'summary' || (resumeState.summary.trim() && resumeState.summary.trim().split(/\s+/).filter(w => w.length > 0).length < 3)}
                                                    className={`mt-2 px-4 py-2 border-2 font-bold uppercase text-sm flex items-center gap-2 ${enhancingField === 'summary'
                                                        ? 'border-slate-300 text-slate-400 bg-slate-100 cursor-wait'
                                                        : (resumeState.summary.trim() && resumeState.summary.trim().split(/\s+/).filter(w => w.length > 0).length < 3)
                                                            ? 'border-slate-300 text-slate-400 bg-slate-100 cursor-not-allowed'
                                                            : 'border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                    {enhancingField === 'summary' ? 'Processing...' : (resumeState.summary.trim() ? 'Enhance with AI' : 'Generate with AI')}
                                                </button>
                                            </div>

                                            {/* Work Experience */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-bold text-primary uppercase flex items-center gap-2">
                                                        <span className="material-symbols-outlined">work</span>
                                                        Work Experience
                                                    </h3>
                                                    <button
                                                        onClick={addWorkExperience}
                                                        className="flex items-center gap-1 px-3 py-1 bg-brand-accent text-white text-xs font-bold uppercase hover:bg-primary transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">add</span>
                                                        Add
                                                    </button>
                                                </div>
                                                {resumeState.workExperience.length === 0 ? (
                                                    <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200">
                                                        <span className="material-symbols-outlined text-4xl mb-2 block">work</span>
                                                        <p className="text-sm">No work experience added yet</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {resumeState.workExperience.map((exp, index) => (
                                                            <div key={exp.id} className="border-2 border-slate-200 p-4 space-y-3 bg-white">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-bold text-slate-500">EXPERIENCE #{index + 1}</span>
                                                                    <button
                                                                        onClick={() => removeWorkExperience(exp.id)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Job Title</label>
                                                                    <input
                                                                        type="text"
                                                                        value={exp.title}
                                                                        onChange={(e) => updateWorkExperience(exp.id, 'title', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Company</label>
                                                                    <input
                                                                        type="text"
                                                                        value={exp.company}
                                                                        onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Location</label>
                                                                    <input
                                                                        type="text"
                                                                        value={exp.location}
                                                                        onChange={(e) => updateWorkExperience(exp.id, 'location', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <div>
                                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Start Date</label>
                                                                        <input
                                                                            type="month"
                                                                            value={exp.startDate}
                                                                            onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">End Date</label>
                                                                        <input
                                                                            type="month"
                                                                            value={exp.endDate}
                                                                            onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                                                                            disabled={exp.current}
                                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm disabled:bg-slate-100"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <label className="flex items-center gap-2 text-sm">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={exp.current}
                                                                        onChange={(e) => updateWorkExperience(exp.id, 'current', e.target.checked)}
                                                                        className="w-4 h-4"
                                                                    />
                                                                    <span>I currently work here</span>
                                                                </label>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                                                                    <textarea
                                                                        value={exp.description}
                                                                        onChange={(e) => updateWorkExperience(exp.id, 'description', e.target.value)}
                                                                        className="w-full h-24 p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm resize-none"
                                                                        placeholder="Describe your responsibilities and achievements..."
                                                                    />
                                                                    <button
                                                                        onClick={() => {
                                                                            const wordCount = exp.description.trim().split(/\s+/).filter(w => w.length > 0).length;
                                                                            if (exp.description.trim() && wordCount < 3) {
                                                                                setNotification({ type: 'error', message: 'Please write at least 3 words before enhancing' });
                                                                                return;
                                                                            }

                                                                            // If generating (empty), send rich context including summary. If enhancing, send minimal context
                                                                            const context = exp.description.trim() ? {} : {
                                                                                title: exp.title,
                                                                                company: exp.company,
                                                                                location: exp.location,
                                                                                startDate: exp.startDate,
                                                                                endDate: exp.endDate,
                                                                                professionalSummary: resumeState.summary
                                                                            };

                                                                            handleEnhanceText(
                                                                                'work_description',
                                                                                exp.description,
                                                                                context,
                                                                                (enhancedText) => updateWorkExperience(exp.id, 'description', enhancedText),
                                                                                exp.id
                                                                            );
                                                                        }}
                                                                        disabled={enhancingField === `work_description_${exp.id}` || (exp.description.trim() && exp.description.trim().split(/\s+/).filter(w => w.length > 0).length < 3)}
                                                                        className={`mt-2 px-3 py-1.5 border-2 font-bold uppercase text-xs flex items-center gap-1 ${enhancingField === `work_description_${exp.id}`
                                                                            ? 'border-slate-300 text-slate-400 bg-slate-100 cursor-wait'
                                                                            : (exp.description.trim() && exp.description.trim().split(/\s+/).filter(w => w.length > 0).length < 3)
                                                                                ? 'border-slate-300 text-slate-400 bg-slate-100 cursor-not-allowed'
                                                                                : 'border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors'
                                                                            }`}
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                                        {enhancingField === `work_description_${exp.id}` ? 'Processing...' : (exp.description.trim() ? 'Enhance with AI' : 'Generate with AI')}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Education */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-bold text-primary uppercase flex items-center gap-2">
                                                        <span className="material-symbols-outlined">school</span>
                                                        Education
                                                    </h3>
                                                    <button
                                                        onClick={addEducation}
                                                        className="flex items-center gap-1 px-3 py-1 bg-brand-accent text-white text-xs font-bold uppercase hover:bg-primary transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">add</span>
                                                        Add
                                                    </button>
                                                </div>
                                                {resumeState.education.length === 0 ? (
                                                    <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200">
                                                        <span className="material-symbols-outlined text-4xl mb-2 block">school</span>
                                                        <p className="text-sm">No education added yet</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {resumeState.education.map((edu, index) => (
                                                            <div key={edu.id} className="border-2 border-slate-200 p-4 space-y-3 bg-white">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-bold text-slate-500">EDUCATION #{index + 1}</span>
                                                                    <button
                                                                        onClick={() => removeEducation(edu.id)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">School</label>
                                                                    <input
                                                                        type="text"
                                                                        value={edu.school}
                                                                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        placeholder="e.g., University of Technology"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Degree</label>
                                                                    <input
                                                                        type="text"
                                                                        value={edu.degree}
                                                                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        placeholder="e.g., Bachelor of Science"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Field of Study</label>
                                                                    <input
                                                                        type="text"
                                                                        value={edu.fieldOfStudy}
                                                                        onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        placeholder="e.g., Computer Science"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Location</label>
                                                                    <input
                                                                        type="text"
                                                                        value={edu.location}
                                                                        onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <div>
                                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Start Date</label>
                                                                        <input
                                                                            type="month"
                                                                            value={edu.startDate}
                                                                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">End Date</label>
                                                                        <input
                                                                            type="month"
                                                                            value={edu.endDate}
                                                                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                                                            disabled={edu.current}
                                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm disabled:bg-slate-100"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <label className="flex items-center gap-2 text-sm">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={edu.current}
                                                                        onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                                                                        className="w-4 h-4"
                                                                    />
                                                                    <span>I currently study here</span>
                                                                </label>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                                                                    <textarea
                                                                        value={edu.description}
                                                                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                                                        className="w-full h-24 p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm resize-none"
                                                                        placeholder="Describe your studies, achievements, etc..."
                                                                    />
                                                                    <button
                                                                        onClick={() => {
                                                                            const wordCount = edu.description.trim().split(/\s+/).filter(w => w.length > 0).length;
                                                                            if (edu.description.trim() && wordCount < 3) {
                                                                                setNotification({ type: 'error', message: 'Please write at least 3 words before enhancing' });
                                                                                return;
                                                                            }

                                                                            // If generating (empty), send rich context including location. If enhancing, send minimal context
                                                                            const context = edu.description.trim() ? {} : {
                                                                                school: edu.school,
                                                                                degree: edu.degree,
                                                                                fieldOfStudy: edu.fieldOfStudy,
                                                                                location: edu.location,
                                                                                city: resumeState.personalInfo.city,
                                                                                country: resumeState.personalInfo.country
                                                                            };

                                                                            handleEnhanceText(
                                                                                'education_description',
                                                                                edu.description,
                                                                                context,
                                                                                (enhancedText) => updateEducation(edu.id, 'description', enhancedText),
                                                                                edu.id
                                                                            );
                                                                        }}
                                                                        disabled={enhancingField === `education_description_${edu.id}` || (edu.description.trim() && edu.description.trim().split(/\s+/).filter(w => w.length > 0).length < 3)}
                                                                        className={`mt-2 px-3 py-1.5 border-2 font-bold uppercase text-xs flex items-center gap-1 ${enhancingField === `education_description_${edu.id}`
                                                                            ? 'border-slate-300 text-slate-400 bg-slate-100 cursor-wait'
                                                                            : (edu.description.trim() && edu.description.trim().split(/\s+/).filter(w => w.length > 0).length < 3)
                                                                                ? 'border-slate-300 text-slate-400 bg-slate-100 cursor-not-allowed'
                                                                                : 'border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors'
                                                                            }`}
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                                        {enhancingField === `education_description_${edu.id}` ? 'Processing...' : (edu.description.trim() ? 'Enhance with AI' : 'Generate with AI')}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Skills */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
                                                    <h3 className="text-base md:text-lg font-bold text-primary uppercase flex items-center gap-2">
                                                        <span className="material-symbols-outlined">star</span>
                                                        Skills
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                                        <button
                                                            onClick={() => {
                                                                // Logic remains the same
                                                                handleEnhanceText(
                                                                    'skills',
                                                                    '',
                                                                    {
                                                                        workExperience: resumeState.workExperience.map(exp => ({
                                                                            title: exp.title,
                                                                            company: exp.company,
                                                                            description: exp.description
                                                                        })),
                                                                        education: resumeState.education.map(edu => ({
                                                                            degree: edu.degree,
                                                                            fieldOfStudy: edu.fieldOfStudy
                                                                        })),
                                                                        existingSkills: resumeState.skills.map(s => s.name)
                                                                    },
                                                                    (enhancedText) => {
                                                                        // Parse the comma-separated skills
                                                                        const skillNames = enhancedText.split(',').map(s => s.trim()).filter(s => s.length > 0);
                                                                        const newSkills = skillNames.map(name => ({
                                                                            id: Date.now().toString() + Math.random(),
                                                                            name: name,
                                                                            level: 'intermediate' as const
                                                                        }));
                                                                        setResumeState(prev => ({
                                                                            ...prev,
                                                                            skills: [...prev.skills, ...newSkills]
                                                                        }));
                                                                    }
                                                                );
                                                            }}
                                                            disabled={enhancingField === 'skills'}
                                                            className={`flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 md:py-1 text-xs font-bold uppercase transition-colors ${enhancingField === 'skills'
                                                                ? 'bg-slate-100 text-slate-400 border-2 border-slate-300 cursor-wait'
                                                                : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
                                                                }`}
                                                        >
                                                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                            {enhancingField === 'skills' ? 'Generating...' : 'Generate AI'}
                                                        </button>
                                                        <button
                                                            onClick={addSkill}
                                                            className="flex-none px-3 py-2 md:py-1 bg-brand-accent text-white text-xs font-bold uppercase hover:bg-primary transition-colors flex items-center justify-center"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">add</span>
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>
                                                {resumeState.skills.length === 0 ? (
                                                    <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200">
                                                        <span className="material-symbols-outlined text-4xl mb-2 block">star</span>
                                                        <p className="text-sm">No skills added yet</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {resumeState.skills.map((skill) => (
                                                            <div key={skill.id} className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 border-2 border-slate-200 p-2 md:p-3 bg-white">
                                                                <input
                                                                    type="text"
                                                                    value={skill.name}
                                                                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                                                    className="flex-1 p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm w-full md:w-auto"
                                                                    placeholder="Skill name"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <select
                                                                        value={skill.level}
                                                                        onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                                                                        className="flex-1 md:flex-none p-2 pr-8 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                    >
                                                                        <option value="beginner">Beginner</option>
                                                                        <option value="intermediate">Intermediate</option>
                                                                        <option value="advanced">Advanced</option>
                                                                        <option value="expert">Expert</option>
                                                                    </select>
                                                                    <button
                                                                        onClick={() => removeSkill(skill.id)}
                                                                        className="text-red-500 hover:text-red-700 px-2"
                                                                    >
                                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Certifications */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-base md:text-lg font-bold text-primary uppercase flex items-center gap-2">
                                                        <span className="material-symbols-outlined">workspace_premium</span>
                                                        Certifications
                                                    </h3>
                                                    <button
                                                        onClick={addCertification}
                                                        className="flex items-center gap-1 px-3 py-1 bg-brand-accent text-white text-xs font-bold uppercase hover:bg-primary transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">add</span>
                                                        Add
                                                    </button>
                                                </div>
                                                {resumeState.certifications.length === 0 ? (
                                                    <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200">
                                                        <span className="material-symbols-outlined text-4xl mb-2 block">workspace_premium</span>
                                                        <p className="text-sm">No certifications added yet</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {resumeState.certifications.map((cert, index) => (
                                                            <div key={cert.id} className="border-2 border-slate-200 p-4 space-y-3 bg-white">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-bold text-slate-500">CERTIFICATION #{index + 1}</span>
                                                                    <button
                                                                        onClick={() => removeCertification(cert.id)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Certification Name</label>
                                                                    <input
                                                                        type="text"
                                                                        value={cert.name}
                                                                        onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Issuing Authority</label>
                                                                    <input
                                                                        type="text"
                                                                        value={cert.authority}
                                                                        onChange={(e) => updateCertification(cert.id, 'authority', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <div>
                                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">License Number</label>
                                                                        <input
                                                                            type="text"
                                                                            value={cert.licenseNumber}
                                                                            onChange={(e) => updateCertification(cert.id, 'licenseNumber', e.target.value)}
                                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Link</label>
                                                                        <input
                                                                            type="url"
                                                                            value={cert.certLink}
                                                                            onChange={(e) => updateCertification(cert.id, 'certLink', e.target.value)}
                                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <div>
                                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Start Date</label>
                                                                        <input
                                                                            type="month"
                                                                            value={cert.startDate}
                                                                            onChange={(e) => updateCertification(cert.id, 'startDate', e.target.value)}
                                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">End Date (Optional)</label>
                                                                        <input
                                                                            type="month"
                                                                            value={cert.endDate}
                                                                            onChange={(e) => updateCertification(cert.id, 'endDate', e.target.value)}
                                                                            className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                                                                    <textarea
                                                                        value={cert.description}
                                                                        onChange={(e) => updateCertification(cert.id, 'description', e.target.value)}
                                                                        className="w-full h-20 p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm resize-none"
                                                                        placeholder="Describe what you learned and how it's relevant..."
                                                                    />
                                                                    <button
                                                                        onClick={() => {
                                                                            const wordCount = cert.description.trim().split(/\s+/).filter(w => w.length > 0).length;
                                                                            if (cert.description.trim() && wordCount < 3) {
                                                                                setNotification({ type: 'error', message: 'Please write at least 3 words before enhancing' });
                                                                                return;
                                                                            }

                                                                            // If generating (empty), send rich context including work experience. If enhancing, send minimal context
                                                                            const context = cert.description.trim() ? {} : {
                                                                                name: cert.name,
                                                                                authority: cert.authority,
                                                                                licenseNumber: cert.licenseNumber,
                                                                                workExperience: resumeState.workExperience.map(exp => ({
                                                                                    title: exp.title,
                                                                                    company: exp.company
                                                                                })),
                                                                                professionalSummary: resumeState.summary
                                                                            };

                                                                            handleEnhanceText(
                                                                                'certification_description',
                                                                                cert.description,
                                                                                context,
                                                                                (enhancedText) => updateCertification(cert.id, 'description', enhancedText),
                                                                                cert.id
                                                                            );
                                                                        }}
                                                                        disabled={enhancingField === `certification_description_${cert.id}` || (cert.description.trim() && cert.description.trim().split(/\s+/).filter(w => w.length > 0).length < 3)}
                                                                        className={`mt-2 px-3 py-1.5 border-2 font-bold uppercase text-xs flex items-center gap-1 ${enhancingField === `certification_description_${cert.id}`
                                                                            ? 'border-slate-300 text-slate-400 bg-slate-100 cursor-wait'
                                                                            : (cert.description.trim() && cert.description.trim().split(/\s+/).filter(w => w.length > 0).length < 3)
                                                                                ? 'border-slate-300 text-slate-400 bg-slate-100 cursor-not-allowed'
                                                                                : 'border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors'
                                                                            }`}
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                                        {enhancingField === `certification_description_${cert.id}` ? 'Processing...' : (cert.description.trim() ? 'Enhance with AI' : 'Generate with AI')}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Links */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-base md:text-lg font-bold text-primary uppercase flex items-center gap-2">
                                                        <span className="material-symbols-outlined">link</span>
                                                        Links
                                                    </h3>
                                                    <button
                                                        onClick={addLink}
                                                        className="flex items-center gap-1 px-3 py-1 bg-brand-accent text-white text-xs font-bold uppercase hover:bg-primary transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">add</span>
                                                        Add
                                                    </button>
                                                </div>
                                                {resumeState.links.length === 0 ? (
                                                    <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200">
                                                        <span className="material-symbols-outlined text-4xl mb-2 block">link</span>
                                                        <p className="text-sm">No links added yet</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {resumeState.links.map((link) => (
                                                            <div key={link.id} className="flex flex-col md:flex-row items-stretch md:items-center gap-3 border-2 border-slate-200 p-3 bg-white">
                                                                <div className="flex-1">
                                                                    <input
                                                                        type="text"
                                                                        value={link.service}
                                                                        onChange={(e) => updateLink(link.id, 'service', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        placeholder="Service (e.g., LinkedIn)"
                                                                    />
                                                                </div>
                                                                <div className="flex-[2]">
                                                                    <input
                                                                        type="url"
                                                                        value={link.linkUrl}
                                                                        onChange={(e) => updateLink(link.id, 'linkUrl', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        placeholder="URL"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => removeLink(link.id)}
                                                                    className="self-end md:self-center text-red-500 hover:text-red-700 transition-colors px-2"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Others */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-base md:text-lg font-bold text-primary uppercase flex items-center gap-2">
                                                        <span className="material-symbols-outlined">more_horiz</span>
                                                        Other Sections
                                                    </h3>
                                                    <button
                                                        onClick={addOther}
                                                        className="flex items-center gap-1 px-3 py-1 bg-brand-accent text-white text-xs font-bold uppercase hover:bg-primary transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">add</span>
                                                        Add
                                                    </button>
                                                </div>
                                                {resumeState.others.length === 0 ? (
                                                    <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200">
                                                        <span className="material-symbols-outlined text-4xl mb-2 block">more_horiz</span>
                                                        <p className="text-sm">No other sections added yet</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {resumeState.others.map((other, index) => (
                                                            <div key={other.id} className="border-2 border-slate-200 p-4 space-y-3 bg-white">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-bold text-slate-500">SECTION #{index + 1}</span>
                                                                    <button
                                                                        onClick={() => removeOther(other.id)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Section Title</label>
                                                                    <input
                                                                        type="text"
                                                                        value={other.title}
                                                                        onChange={(e) => updateOther(other.id, 'title', e.target.value)}
                                                                        className="w-full p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
                                                                        placeholder="e.g., Volunteer Experience, Publications, etc."
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Content</label>
                                                                    <textarea
                                                                        value={other.content}
                                                                        onChange={(e) => updateOther(other.id, 'content', e.target.value)}
                                                                        className="w-full h-24 p-2 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm resize-none"
                                                                        placeholder="Add content for this section..."
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    )}

                                    {/* STYLE TAB */}
                                    {activeTab === 'style' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <h3 className="text-base md:text-lg font-bold text-primary uppercase mb-4">Typography</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Font Family</label>
                                                        <select
                                                            value={resumeState.style.fontFamily}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                style: { ...prev.style, fontFamily: e.target.value }
                                                            }))}
                                                            className="w-full p-2 border-2 border-slate-300 text-sm"
                                                        >
                                                            <option value="font-sans">Inter (Sans-Serif)</option>
                                                            <option value="font-serif">Merriweather (Serif)</option>
                                                            <option value="font-roboto">Roboto</option>
                                                            <option value="font-mono">Courier Prime (Mono)</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                                                            Font Size ({resumeState.style.fontSize}pt)
                                                        </label>
                                                        <input
                                                            type="range"
                                                            min="9"
                                                            max="14"
                                                            step="0.5"
                                                            value={resumeState.style.fontSize}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                style: { ...prev.style, fontSize: parseFloat(e.target.value) }
                                                            }))}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Header Font Color</label>
                                                        <input
                                                            type="color"
                                                            value={resumeState.style.headerFontColor}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                style: { ...prev.style, headerFontColor: e.target.value }
                                                            }))}
                                                            className="w-full h-10 border-2 border-slate-300 cursor-pointer"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Content Font Color</label>
                                                        <input
                                                            type="color"
                                                            value={resumeState.style.contentFontColor}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                style: { ...prev.style, contentFontColor: e.target.value }
                                                            }))}
                                                            className="w-full h-10 border-2 border-slate-300 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>



                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <h3 className="text-base md:text-lg font-bold text-primary uppercase mb-4">Layout</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Header Alignment</label>
                                                        <div className="flex border-2 border-slate-300 overflow-hidden">
                                                            {['left', 'center', 'right'].map(align => (
                                                                <button
                                                                    key={align}
                                                                    onClick={() => setResumeState(prev => ({
                                                                        ...prev,
                                                                        style: { ...prev.style, headerAlignment: align as any }
                                                                    }))}
                                                                    className={`flex-1 py-2 text-xs uppercase font-bold ${resumeState.style.headerAlignment === align
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
                                                            Margins ({resumeState.style.margins}mm)
                                                        </label>
                                                        <input
                                                            type="range"
                                                            min="4"
                                                            max="16"
                                                            step="1"
                                                            value={resumeState.style.margins}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                style: { ...prev.style, margins: parseInt(e.target.value) }
                                                            }))}
                                                            className="w-full"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                                                            Line Spacing ({resumeState.style.lineSpacing})
                                                        </label>
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="2"
                                                            step="0.1"
                                                            value={resumeState.style.lineSpacing}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                style: { ...prev.style, lineSpacing: parseFloat(e.target.value) }
                                                            }))}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <h3 className="text-base md:text-lg font-bold text-primary uppercase mb-4">Paper Size</h3>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            checked={resumeState.style.paperSize === 'a4'}
                                                            onChange={() => setResumeState(prev => ({
                                                                ...prev,
                                                                style: { ...prev.style, paperSize: 'a4' }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm font-bold">A4 (210 × 297mm)</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            checked={resumeState.style.paperSize === 'letter'}
                                                            onChange={() => setResumeState(prev => ({
                                                                ...prev,
                                                                style: { ...prev.style, paperSize: 'letter' }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm font-bold">US Letter (8.5 × 11in)</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* VISIBILITY TAB */}
                                    {activeTab === 'visibility' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-right-2">

                                            {/* Personal Info Visibility */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <h3 className="text-base md:text-lg font-bold text-primary uppercase mb-4 flex items-center gap-2">
                                                    <span className="material-symbols-outlined">person</span>
                                                    Personal Information
                                                </h3>
                                                <div className="space-y-2">
                                                    {Object.entries(resumeState.visibility.personalInfo).map(([key, value]) => (
                                                        <label key={key} className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={value}
                                                                onChange={(e) => setResumeState(prev => ({
                                                                    ...prev,
                                                                    visibility: {
                                                                        ...prev.visibility,
                                                                        personalInfo: {
                                                                            ...prev.visibility.personalInfo,
                                                                            [key]: e.target.checked
                                                                        }
                                                                    }
                                                                }))}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Summary Visibility */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={resumeState.visibility.summary}
                                                        onChange={(e) => setResumeState(prev => ({
                                                            ...prev,
                                                            visibility: { ...prev.visibility, summary: e.target.checked }
                                                        }))}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-base md:text-lg font-bold text-primary uppercase">Show Professional Summary</span>
                                                </label>
                                            </div>

                                            {/* Work Experience Visibility */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <h3 className="text-base md:text-lg font-bold text-primary uppercase mb-4 flex items-center gap-2">
                                                    <span className="material-symbols-outlined">work</span>
                                                    Work Experience
                                                </h3>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-bold">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.workExperience.visible}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    workExperience: { ...prev.visibility.workExperience, visible: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Section</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm ml-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.workExperience.showLocation}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    workExperience: { ...prev.visibility.workExperience, showLocation: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Location</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm ml-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.workExperience.showDates}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    workExperience: { ...prev.visibility.workExperience, showDates: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Dates</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm ml-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.workExperience.showDescription}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    workExperience: { ...prev.visibility.workExperience, showDescription: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Description</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Education Visibility */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <h3 className="text-base md:text-lg font-bold text-primary uppercase mb-4 flex items-center gap-2">
                                                    <span className="material-symbols-outlined">school</span>
                                                    Education
                                                </h3>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-bold">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.education.visible}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    education: { ...prev.visibility.education, visible: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Section</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm ml-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.education.showLocation}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    education: { ...prev.visibility.education, showLocation: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Location</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm ml-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.education.showDates}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    education: { ...prev.visibility.education, showDates: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Dates</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm ml-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.education.showDescription}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    education: { ...prev.visibility.education, showDescription: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Description</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Skills Visibility */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={resumeState.visibility.skills}
                                                        onChange={(e) => setResumeState(prev => ({
                                                            ...prev,
                                                            visibility: { ...prev.visibility, skills: e.target.checked }
                                                        }))}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-base md:text-lg font-bold text-primary uppercase">Show Skills</span>
                                                </label>
                                            </div>

                                            {/* Certifications Visibility */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <h3 className="text-base md:text-lg font-bold text-primary uppercase mb-4 flex items-center gap-2">
                                                    <span className="material-symbols-outlined">workspace_premium</span>
                                                    Certifications
                                                </h3>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-bold">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.certifications.visible}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    certifications: { ...prev.visibility.certifications, visible: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Section</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm ml-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.certifications.showLicenseNumber}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    certifications: { ...prev.visibility.certifications, showLicenseNumber: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show License Number</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm ml-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.certifications.showLink}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    certifications: { ...prev.visibility.certifications, showLink: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Link</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm ml-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.certifications.showDates}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    certifications: { ...prev.visibility.certifications, showDates: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Dates</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 text-sm ml-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={resumeState.visibility.certifications.showDescription}
                                                            onChange={(e) => setResumeState(prev => ({
                                                                ...prev,
                                                                visibility: {
                                                                    ...prev.visibility,
                                                                    certifications: { ...prev.visibility.certifications, showDescription: e.target.checked }
                                                                }
                                                            }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>Show Description</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Links Visibility */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={resumeState.visibility.links}
                                                        onChange={(e) => setResumeState(prev => ({
                                                            ...prev,
                                                            visibility: { ...prev.visibility, links: e.target.checked }
                                                        }))}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-lg font-bold text-primary uppercase">Show Links</span>
                                                </label>
                                            </div>

                                            {/* Others Visibility */}
                                            <div className="bg-white/80 border-2 border-primary p-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={resumeState.visibility.others}
                                                        onChange={(e) => setResumeState(prev => ({
                                                            ...prev,
                                                            visibility: { ...prev.visibility, others: e.target.checked }
                                                        }))}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-lg font-bold text-primary uppercase">Show Other Sections</span>
                                                </label>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Preview (55%) */}
                    <div className="flex-1 lg:flex-none lg:w-[55%] flex flex-col gap-6 print:w-full print:p-0 min-h-0 order-1 lg:order-2">

                        {/* Preview Controls - Floating Panel */}
                        <div className="bg-white/90 backdrop-blur-sm shadow-lg border-2 border-primary p-4 print:hidden">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-slate-500">Live Preview</span>
                                <button
                                    onClick={() => window.print()}
                                    className="px-3 py-1.5 text-xs font-bold uppercase text-white bg-slate-800 hover:bg-black flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                                    Export PDF
                                </button>
                            </div>
                        </div>

                        {/* Preview Frame - Floating Panel */}
                        <div className="flex-1 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-primary overflow-hidden relative print:bg-white print:border-0 print:shadow-none print:overflow-visible min-h-0" style={{ backgroundColor: '#f1f5f9' }}>
                            <div className="absolute inset-0 overflow-auto flex items-start justify-center p-4 lg:p-8">
                                <style>{`
                                    @media screen {
                                        .resume-page {
                                            page-break-after: always;
                                            break-after: page;
                                            margin-bottom: 20px;
                                            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                                            transform-origin: top center;
                                        }
                                        .resume-page:last-child {
                                            page-break-after: auto;
                                            break-after: auto;
                                        }
                                    }
                                    @media print {
                                        /* Hide everything except the resume preview */
                                        body * {
                                            visibility: hidden;
                                        }
                                        
                                        /* Show only the resume preview and its children */
                                        .resume-preview-container,
                                        .resume-preview-container * {
                                            visibility: visible;
                                        }
                                        
                                        /* Position resume at top of page */
                                        .resume-preview-container {
                                            position: absolute;
                                            left: 0;
                                            top: 0;
                                            width: 100%;
                                            height: auto;
                                            overflow: visible;
                                            transform: none !important;
                                        }
                                        
                                        /* Ensure proper page sizing and margins */
                                        @page {
                                            size: ${resumeState.style.paperSize === 'a4' ? 'A4' : 'letter'};
                                            margin: ${resumeState.style.margins * 4}px;
                                        }
                                        
                                        /* Reset container styles for print */
                                        .resume-page {
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
                                        .resume-page * {
                                            orphans: 3;
                                            widows: 3;
                                        }
                                        
                                        /* Ensure all content is visible */
                                        .resume-page h1,
                                        .resume-page h2,
                                        .resume-page h3,
                                        .resume-page p,
                                        .resume-page div,
                                        .resume-page span {
                                            page-break-inside: avoid;
                                            break-inside: avoid;
                                        }
                                    }
                                `}</style>
                                <div className="resume-preview-container bg-white resume-page mx-auto transition-transform duration-200 scale-[0.4] origin-top md:scale-[0.5] lg:scale-[0.65] xl:scale-[0.85] 2xl:scale-100" style={{
                                    width: resumeState.style.paperSize === 'a4' ? '210mm' : '8.5in',
                                    minHeight: resumeState.style.paperSize === 'a4' ? '297mm' : '11in',
                                    padding: `${resumeState.style.margins * 4}px`,
                                    fontFamily: resumeState.style.fontFamily === 'font-sans' ? 'Inter, sans-serif' :
                                        resumeState.style.fontFamily === 'font-serif' ? 'Merriweather, serif' :
                                            resumeState.style.fontFamily === 'font-mono' ? 'Courier Prime, monospace' :
                                                resumeState.style.fontFamily === 'font-roboto' ? 'Roboto, sans-serif' : 'Inter, sans-serif',
                                    fontSize: `${resumeState.style.fontSize}pt`,
                                    lineHeight: resumeState.style.lineSpacing,
                                    color: resumeState.style.contentFontColor,
                                    overflow: 'visible',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}>
                                    {/* Header */}
                                    <div className={`mb-6 text-${resumeState.style.headerAlignment}`}>
                                        <h1 className="font-bold mb-2" style={{ color: resumeState.style.headerFontColor, fontSize: '2em' }}>
                                            {resumeState.personalInfo.firstName} {resumeState.personalInfo.lastName}
                                        </h1>
                                        <div className="space-y-1" style={{ color: resumeState.style.contentFontColor, fontSize: '0.875em' }}>
                                            {resumeState.visibility.personalInfo.email && resumeState.personalInfo.email && <div>{resumeState.personalInfo.email}</div>}
                                            {resumeState.visibility.personalInfo.phone && resumeState.personalInfo.phone && <div>{resumeState.personalInfo.phone}</div>}
                                            {(() => {
                                                const addressParts = [];
                                                if (resumeState.visibility.personalInfo.address && resumeState.personalInfo.address) {
                                                    addressParts.push(resumeState.personalInfo.address);
                                                }
                                                if (resumeState.visibility.personalInfo.city && resumeState.personalInfo.city) {
                                                    addressParts.push(resumeState.personalInfo.city);
                                                }
                                                if (resumeState.visibility.personalInfo.country && resumeState.personalInfo.country) {
                                                    addressParts.push(resumeState.personalInfo.country);
                                                }
                                                return addressParts.length > 0 ? <div>{addressParts.join(', ')}</div> : null;
                                            })()}
                                            {resumeState.visibility.personalInfo.linkedIn && resumeState.personalInfo.linkedIn && <div>{resumeState.personalInfo.linkedIn}</div>}
                                            {resumeState.visibility.personalInfo.website && resumeState.personalInfo.website && <div>{resumeState.personalInfo.website}</div>}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    {resumeState.visibility.summary && resumeState.summary && (
                                        <div className="mb-6">
                                            <h2 className="font-bold mb-2 border-b-2 border-slate-300 pb-1" style={{ color: resumeState.style.headerFontColor, fontSize: '1.5em' }}>Professional Summary</h2>
                                            <p style={{ color: resumeState.style.contentFontColor }}>{resumeState.summary}</p>
                                        </div>
                                    )}

                                    {/* Work Experience */}
                                    {resumeState.visibility.workExperience.visible && resumeState.workExperience.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="font-bold mb-2 border-b-2 border-slate-300 pb-1" style={{ color: resumeState.style.headerFontColor, fontSize: '1.5em' }}>Work Experience</h2>
                                            {resumeState.workExperience.map(exp => (
                                                <div key={exp.id} className="mb-4">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <h3 className="font-bold" style={{ color: resumeState.style.headerFontColor, fontSize: '1.1em' }}>{exp.title}</h3>
                                                            <div style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>
                                                                {exp.company}
                                                                {resumeState.visibility.workExperience.showLocation && exp.location && ` • ${exp.location}`}
                                                            </div>
                                                        </div>
                                                        {resumeState.visibility.workExperience.showDates && (
                                                            <div className="text-right" style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>
                                                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {resumeState.visibility.workExperience.showDescription && exp.description && <p className="mt-2 whitespace-pre-wrap" style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>{exp.description}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Education */}
                                    {resumeState.visibility.education.visible && resumeState.education.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="font-bold mb-2 border-b-2 border-slate-300 pb-1" style={{ color: resumeState.style.headerFontColor, fontSize: '1.5em' }}>Education</h2>
                                            {resumeState.education.map(edu => (
                                                <div key={edu.id} className="mb-4">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <h3 className="font-bold" style={{ color: resumeState.style.headerFontColor, fontSize: '1.1em' }}>{edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</h3>
                                                            <div style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>
                                                                {edu.school}
                                                                {resumeState.visibility.education.showLocation && edu.location && ` • ${edu.location}`}
                                                            </div>
                                                        </div>
                                                        {resumeState.visibility.education.showDates && (
                                                            <div className="text-right" style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>
                                                                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {resumeState.visibility.education.showDescription && edu.description && <p className="mt-2 whitespace-pre-wrap" style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>{edu.description}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {resumeState.visibility.skills && resumeState.skills.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="font-bold mb-2 border-b-2 border-slate-300 pb-1" style={{ color: resumeState.style.headerFontColor, fontSize: '1.5em' }}>Skills</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {resumeState.skills.map(skill => (
                                                    <span key={skill.id} className="px-3 py-1 bg-slate-200" style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>
                                                        {skill.name} ({skill.level})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Certifications */}
                                    {resumeState.visibility.certifications.visible && resumeState.certifications.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="font-bold mb-2 border-b-2 border-slate-300 pb-1" style={{ color: resumeState.style.headerFontColor, fontSize: '1.5em' }}>Certifications</h2>
                                            {resumeState.certifications.map(cert => (
                                                <div key={cert.id} className="mb-3">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <h3 className="font-bold" style={{ color: resumeState.style.headerFontColor, fontSize: '1.1em' }}>{cert.name}</h3>
                                                            <div style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>{cert.authority}</div>
                                                            {resumeState.visibility.certifications.showLicenseNumber && cert.licenseNumber && <div style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>License: {cert.licenseNumber}</div>}
                                                            {resumeState.visibility.certifications.showLink && cert.certLink && <div className="text-sm text-blue-600" style={{ color: resumeState.style.contentFontColor }}>{cert.certLink}</div>}
                                                        </div>
                                                        {resumeState.visibility.certifications.showDates && (
                                                            <div className="text-right" style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>
                                                                {cert.startDate}{cert.endDate && ` - ${cert.endDate}`}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {resumeState.visibility.certifications.showDescription && cert.description && <p className="mt-2 whitespace-pre-wrap" style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>{cert.description}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Links */}
                                    {resumeState.visibility.links && resumeState.links.length > 0 && (
                                        <div className="mb-6">
                                            <h2 className="font-bold mb-2 border-b-2 border-slate-300 pb-1" style={{ color: resumeState.style.headerFontColor, fontSize: '1.5em' }}>Links</h2>
                                            <div className="space-y-1">
                                                {resumeState.links.map(link => (
                                                    <div key={link.id} className="mb-2">
                                                        <span className="font-bold" style={{ color: resumeState.style.headerFontColor, fontSize: '0.9em' }}>{link.service}:</span> <span style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>{link.linkUrl}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Others */}
                                    {resumeState.visibility.others && resumeState.others.length > 0 && (
                                        <div className="mb-6">
                                            {resumeState.others.map(other => (
                                                <div key={other.id} className="mb-4">
                                                    <h2 className="font-bold mb-2 border-b-2 border-slate-300 pb-1" style={{ color: resumeState.style.headerFontColor, fontSize: '1.5em' }}>{other.title}</h2>
                                                    <p className="whitespace-pre-wrap" style={{ color: resumeState.style.contentFontColor, fontSize: '0.9em' }}>{other.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeEditor;
