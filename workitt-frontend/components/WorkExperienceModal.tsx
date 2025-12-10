import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { API_URL } from '../services/api';

interface WorkExperience {
    id: string;
    title: string;
    company: string;
    location: string;
    start_date: string | null;
    end_date: string | null;
    description: string;
}

interface WorkExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    profileId?: string;
}

const WorkExperienceModal: React.FC<WorkExperienceModalProps> = ({ isOpen, onClose, onUpdate, profileId }) => {
    const [experiences, setExperiences] = useState<WorkExperience[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchExperiences();
        }
    }, [isOpen, profileId]);

    const fetchExperiences = async () => {
        try {
            const url = profileId
                ? `${API_URL}/api/profile/work-experience?profile_id=${profileId}`
                : `${API_URL}/api/profile/work-experience`;

            const response = await axios.get(url, {
                withCredentials: true
            });
            setExperiences(response.data.experiences || []);
        } catch (err) {
            console.error('Failed to fetch experiences:', err);
            setError('Failed to load work experiences');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (editingId) {
                // Update existing
                await axios.put(`${API_URL}/api/profile/work-experience/${editingId}`, formData, {
                    withCredentials: true
                });
            } else {
                // Create new
                await axios.post(`${API_URL}/api/profile/work-experience`, {
                    ...formData,
                    profile_id: profileId
                }, {
                    withCredentials: true
                });
            }

            // Reset form
            setFormData({ title: '', company: '', location: '', start_date: '', end_date: '', description: '' });
            setEditingId(null);
            fetchExperiences();
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save work experience');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (exp: WorkExperience) => {
        setFormData({
            title: exp.title || '',
            company: exp.company || '',
            location: exp.location || '',
            start_date: exp.start_date || '',
            end_date: exp.end_date || '',
            description: exp.description || ''
        });
        setEditingId(exp.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        try {
            await axios.delete(`${API_URL}/api/profile/work-experience/${id}`, {
                withCredentials: true
            });
            fetchExperiences();
            onUpdate();
        } catch (err) {
            setError('Failed to delete work experience');
        }
    };

    const handleCancel = () => {
        setFormData({ title: '', company: '', location: '', start_date: '', end_date: '', description: '' });
        setEditingId(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Work Experience">
            {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 border-2 border-primary">
                <h3 className="font-bold text-lg mb-4 uppercase">{editingId ? 'Edit' : 'Add'} Experience</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Job Title*</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Company*</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Location</label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Start Date</label>
                        <input
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">End Date</label>
                        <input
                            type="date"
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-brand-accent text-white font-bold uppercase hover:bg-primary transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-white border-2 border-primary font-bold uppercase hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* List of Experiences */}
            <div>
                <h3 className="font-bold text-lg mb-4 uppercase">Your Experiences ({experiences.length})</h3>

                {experiences.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No work experiences added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="p-4 bg-white border-2 border-primary">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg">{exp.title}</h4>
                                        <p className="text-slate-600">{exp.company} {exp.location && `• ${exp.location}`}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {exp.start_date} - {exp.end_date || 'Present'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(exp)}
                                            className="p-2 bg-primary text-white hover:bg-brand-accent transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp.id)}
                                            className="p-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                                {exp.description && (
                                    <p className="text-sm text-slate-700 mt-2">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default WorkExperienceModal;
