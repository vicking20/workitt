import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import api from '../services/api';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    profileId?: string | number;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, profileId }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, profileId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Helper to construct URL with profile_id
            const getUrl = (endpoint: string) => {
                return profileId
                    ? `${endpoint}?profile_id=${profileId}`
                    : endpoint;
            };

            // Fetch all data in parallel
            const [
                profileRes,
                workRes,
                eduRes,
                skillsRes,
                langRes,
                certRes,
                refRes,
                linkRes,
                customRes
            ] = await Promise.all([
                api.get(profileId ? `/api/profile/switch/${profileId}` : '/api/profile'),
                api.get(getUrl('/api/profile/work-experience')),
                api.get(getUrl('/api/profile/education')),
                api.get(getUrl('/api/profile/skills')),
                api.get(getUrl('/api/profile/languages')),
                api.get(getUrl('/api/profile/certifications')),
                api.get(getUrl('/api/profile/references')),
                api.get(getUrl('/api/profile/links')),
                api.get(profileId ? `/api/profile/${profileId}/custom-content` : '/api/profile/custom-content').catch(() => ({ data: [] }))
            ]);

            setData({
                profile: profileRes.data.profile,
                workExperience: workRes.data.experiences || [],
                education: eduRes.data.education || [],
                skills: skillsRes.data.skills || [],
                languages: langRes.data.languages || [],
                certifications: certRes.data.certifications || [],
                references: refRes.data.references || [],
                links: linkRes.data.links || [],
                customContent: customRes.data.custom_sections || []
            });
        } catch (err) {
            console.error('Error fetching preview data:', err);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Persona Preview" maxWidth="4xl">
            {loading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-brand-accent rounded-full"></div>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 border-l-4 border-red-600">
                    {error}
                </div>
            ) : data ? (
                <div className="space-y-8 font-sans text-slate-800 print:space-y-6">
                    {/* Header / Personal Info */}
                    <div className="border-b-4 border-primary pb-6">
                        <h1 className="text-4xl font-black uppercase mb-2">{data.profile.first_name} {data.profile.last_name}</h1>
                        <p className="text-xl font-bold text-brand-accent uppercase tracking-widest mb-4">{data.profile.job_sector}</p>

                        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                            {data.profile.email && (
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">mail</span>
                                    {data.profile.email}
                                </div>
                            )}
                            {data.profile.phone && (
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">call</span>
                                    {data.profile.phone}
                                </div>
                            )}
                            {data.profile.city && (
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">location_on</span>
                                    {data.profile.city}, {data.profile.country}
                                </div>
                            )}
                        </div>

                        {data.profile.summary && (
                            <div className="mt-6">
                                <p className="leading-relaxed whitespace-pre-wrap">{data.profile.summary}</p>
                            </div>
                        )}
                    </div>

                    {/* Work Experience */}
                    {data.workExperience?.length > 0 && (
                        <section>
                            <h3 className="text-xl font-black uppercase border-b-2 border-slate-200 mb-4 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-brand-accent">work</span>
                                Experience
                            </h3>
                            <div className="space-y-6">
                                {data.workExperience.map((exp: any) => (
                                    <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-200"></div>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-lg">{exp.position}</h4>
                                            <span className="text-sm font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                                            </span>
                                        </div>
                                        <p className="font-bold text-slate-700 mb-2">{exp.company} • {exp.location}</p>
                                        <p className="text-slate-600 whitespace-pre-wrap text-sm">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {data.education?.length > 0 && (
                        <section>
                            <h3 className="text-xl font-black uppercase border-b-2 border-slate-200 mb-4 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">school</span>
                                Education
                            </h3>
                            <div className="grid gap-4">
                                {data.education.map((edu: any) => (
                                    <div key={edu.id} className="bg-slate-50 p-4 border-l-4 border-green-500">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold">{edu.school}</h4>
                                                <p className="text-sm text-slate-700">{edu.degree} in {edu.field_of_study}</p>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">
                                                {edu.start_date} - {edu.current ? 'Present' : edu.end_date}
                                            </span>
                                        </div>
                                        {edu.description && <p className="mt-2 text-sm text-slate-600">{edu.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills & Languages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {data.skills?.length > 0 && (
                            <section>
                                <h3 className="text-xl font-black uppercase border-b-2 border-slate-200 mb-4 pb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-600">psychology</span>
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map((skill: any) => (
                                        <span key={skill.id} className="px-3 py-1 bg-white border border-slate-300 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.1)] text-sm font-bold">
                                            {skill.name}
                                            {skill.level && <span className="ml-1 text-xs font-normal text-slate-500">({skill.level})</span>}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.languages?.length > 0 && (
                            <section>
                                <h3 className="text-xl font-black uppercase border-b-2 border-slate-200 mb-4 pb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-600">language</span>
                                    Languages
                                </h3>
                                <div className="space-y-2">
                                    {data.languages.map((lang: any) => (
                                        <div key={lang.id} className="flex justify-between items-center border-b border-slate-100 pb-1">
                                            <span className="font-bold">{lang.language}</span>
                                            <span className="text-sm text-slate-500">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Certifications */}
                    {data.certifications?.length > 0 && (
                        <section>
                            <h3 className="text-xl font-black uppercase border-b-2 border-slate-200 mb-4 pb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-pink-600">verified</span>
                                Certifications
                            </h3>
                            <div className="space-y-3">
                                {data.certifications.map((cert: any) => (
                                    <div key={cert.id} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-pink-500 text-sm mt-1">workspace_premium</span>
                                        <div>
                                            <h4 className="font-bold text-sm">{cert.name}</h4>
                                            <p className="text-xs text-slate-600">{cert.issuer} • {cert.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Custom Sections */}
                    {data.customContent?.length > 0 && (
                        <section>
                            {data.customContent.map((section: any, index: number) => (
                                <div key={index} className="mb-6 last:mb-0">
                                    <h3 className="text-xl font-black uppercase border-b-2 border-slate-200 mb-4 pb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-slate-600">article</span>
                                        {section.title}
                                    </h3>
                                    <div className="whitespace-pre-wrap text-slate-700">
                                        {section.content}
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            ) : null}
        </Modal>
    );
};
export default PreviewModal;
