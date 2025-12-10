import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';

interface ProfileData {
    id: string;
    first_name: string;
    last_name: string;
    job_sector: string;
    profile_email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    summary: string;
}

const ProfilePreview: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [workExp, setWorkExp] = useState<any[]>([]);
    const [education, setEducation] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [languages, setLanguages] = useState<any[]>([]);
    const [certifications, setCertifications] = useState<any[]>([]);
    const [references, setReferences] = useState<any[]>([]);
    const [links, setLinks] = useState<any[]>([]);
    const [customSections, setCustomSections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFullProfile();
    }, []);

    const fetchFullProfile = async () => {
        try {
            // Fetch base profile
            const profRes = await axios.get(`${API_URL}/api/profile`, { withCredentials: true });
            setProfile(profRes.data);

            // Fetch all related data in parallel
            const [workRes, eduRes, skillRes, langRes, certRes, refRes, linkRes, customRes] = await Promise.all([
                axios.get(`${API_URL}/api/profile/work-experience`, { withCredentials: true }),
                axios.get(`${API_URL}/api/profile/education`, { withCredentials: true }),
                axios.get(`${API_URL}/api/profile/skills`, { withCredentials: true }),
                axios.get(`${API_URL}/api/profile/languages`, { withCredentials: true }),
                axios.get(`${API_URL}/api/profile/certifications`, { withCredentials: true }),
                axios.get(`${API_URL}/api/profile/references`, { withCredentials: true }),
                axios.get(`${API_URL}/api/profile/links`, { withCredentials: true }),
                axios.get(`${API_URL}/api/profile/${profRes.data.id}/custom-content`, { withCredentials: true })
            ]);

            setWorkExp(workRes.data.work_experiences || []);
            setEducation(eduRes.data.education || []);
            setSkills(skillRes.data.skills || []);
            setLanguages(langRes.data.languages || []);
            setCertifications(certRes.data.certifications || []);
            setReferences(refRes.data.references || []);
            setLinks(linkRes.data.links || []);
            setCustomSections(customRes.data.custom_sections || []);

        } catch (err) {
            console.error('Failed to load profile preview:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading preview...</div>;
    }

    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50">Profile not found</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 print:hidden">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2 text-slate-600 hover:text-primary font-bold uppercase"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back to Editor
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-2 bg-primary text-white font-bold uppercase shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
                    >
                        Print / PDF
                    </button>
                </div>

                <div className="bg-white border-2 border-primary shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-8 md:p-12 print:shadow-none print:border-0">
                    {/* Header */}
                    <header className="border-b-4 border-primary pb-8 mb-8">
                        <h1 className="text-4xl md:text-5xl font-black uppercase mb-2">{profile.first_name} {profile.last_name}</h1>
                        <p className="text-xl md:text-2xl font-bold text-brand-accent uppercase mb-6">{profile.job_sector}</p>

                        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600">
                            {profile.profile_email && (
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">mail</span>
                                    {profile.profile_email}
                                </div>
                            )}
                            {profile.phone && (
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">call</span>
                                    {profile.phone}
                                </div>
                            )}
                            {(profile.city || profile.country) && (
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">location_on</span>
                                    {[profile.city, profile.country].filter(Boolean).join(', ')}
                                </div>
                            )}
                            {links.map(link => (
                                <a key={link.id} href={link.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand-accent">
                                    <span className="material-symbols-outlined text-lg">link</span>
                                    {link.service}
                                </a>
                            ))}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Column */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Summary */}
                            {profile.summary && (
                                <section>
                                    <h2 className="text-xl font-black uppercase border-b-2 border-primary mb-4 pb-1">Professional Summary</h2>
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{profile.summary}</p>
                                </section>
                            )}

                            {/* Experience */}
                            {workExp.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-black uppercase border-b-2 border-primary mb-4 pb-1">Work Experience</h2>
                                    <div className="space-y-6">
                                        {workExp.map(exp => (
                                            <div key={exp.id}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-bold text-lg">{exp.job_title}</h3>
                                                    <span className="text-sm font-bold text-slate-500 whitespace-nowrap">
                                                        {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                                                    </span>
                                                </div>
                                                <p className="text-brand-accent font-bold mb-2">{exp.company} {exp.location && `• ${exp.location}`}</p>
                                                <p className="text-slate-700 text-sm whitespace-pre-wrap">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Custom Sections */}
                            {customSections.map(section => (
                                <section key={section.id}>
                                    <h2 className="text-xl font-black uppercase border-b-2 border-primary mb-4 pb-1">{section.title}</h2>
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                                </section>
                            ))}
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">
                            {/* Skills */}
                            {skills.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-black uppercase border-b-2 border-primary mb-4 pb-1">Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(skill => (
                                            <span key={skill.id} className="px-2 py-1 bg-slate-100 border border-slate-300 text-sm font-bold">
                                                {skill.skill_name}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Education */}
                            {education.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-black uppercase border-b-2 border-primary mb-4 pb-1">Education</h2>
                                    <div className="space-y-4">
                                        {education.map(edu => (
                                            <div key={edu.id}>
                                                <h3 className="font-bold">{edu.degree}</h3>
                                                <p className="text-sm text-brand-accent font-bold">{edu.school}</p>
                                                <p className="text-xs text-slate-500 mb-1">{edu.start_date} - {edu.end_date}</p>
                                                {edu.description && <p className="text-xs text-slate-600">{edu.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Languages */}
                            {languages.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-black uppercase border-b-2 border-primary mb-4 pb-1">Languages</h2>
                                    <ul className="space-y-2">
                                        {languages.map(lang => (
                                            <li key={lang.id} className="flex justify-between text-sm">
                                                <span className="font-bold">{lang.lang_name}</span>
                                                <span className="text-slate-500">{lang.lang_proficiency}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Certifications */}
                            {certifications.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-black uppercase border-b-2 border-primary mb-4 pb-1">Certifications</h2>
                                    <div className="space-y-3">
                                        {certifications.map(cert => (
                                            <div key={cert.id}>
                                                <h3 className="font-bold text-sm">{cert.name}</h3>
                                                <p className="text-xs text-slate-500">{cert.authority}</p>
                                                <p className="text-xs text-slate-400">{cert.start_date && cert.start_date.split('-')[0]}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* References */}
                            {references.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-black uppercase border-b-2 border-primary mb-4 pb-1">References</h2>
                                    <div className="space-y-3">
                                        {references.map(ref => (
                                            <div key={ref.id}>
                                                <h3 className="font-bold text-sm">{ref.name}</h3>
                                                <p className="text-xs text-slate-500">{ref.relationship}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePreview;
