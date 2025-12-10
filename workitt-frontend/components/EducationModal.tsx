import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { API_URL } from '../services/api';

interface Education {
    id: string;
    school: string;
    degree: string;
    field_of_study: string;
    start_date: string | null;
    end_date: string | null;
    description: string;
}

interface EducationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    profileId?: string;
}

const EducationModal: React.FC<EducationModalProps> = ({ isOpen, onClose, onUpdate, profileId }) => {
    const [educationList, setEducationList] = useState<Education[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchEducation();
        }
    }, [isOpen, profileId]);

    const fetchEducation = async () => {
        try {
            const url = profileId
                ? `${API_URL}/api/profile/education?profile_id=${profileId}`
                : `${API_URL}/api/profile/education`;

            const response = await axios.get(url, {
                withCredentials: true
            });
            setEducationList(response.data.education || []);
        } catch (err) {
            console.error('Failed to fetch education:', err);
            setError('Failed to load education history');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (editingId) {
                // Update existing
                await axios.put(`${API_URL}/api/profile/education/${editingId}`, formData, {
                    withCredentials: true
                });
            } else {
                // Create new
                await axios.post(`${API_URL}/api/profile/education`, {
                    ...formData,
                    profile_id: profileId
                }, {
                    withCredentials: true
                });
            }

            setFormData({ school: '', degree: '', field_of_study: '', start_date: '', end_date: '', description: '' });
            setEditingId(null);
            fetchEducation();
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save education');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (edu: Education) => {
        setFormData({
            school: edu.school || '',
            degree: edu.degree || '',
            field_of_study: edu.field_of_study || '',
            start_date: edu.start_date || '',
            end_date: edu.end_date || '',
            description: edu.description || ''
        });
        setEditingId(edu.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this education entry?')) return;

        try {
            await axios.delete(`${API_URL}/api/profile/education/${id}`, {
                withCredentials: true
            });
            fetchEducation();
            onUpdate();
        } catch (err) {
            setError('Failed to delete education');
        }
    };

    const handleCancel = () => {
        setFormData({ school: '', degree: '', field_of_study: '', start_date: '', end_date: '', description: '' });
        setEditingId(null);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Education">
            {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 border-2 border-primary">
                <h3 className="font-bold text-lg mb-4 uppercase">{editingId ? 'Edit' : 'Add'} Education</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">School/Institution*</label>
                        <input
                            type="text"
                            value={formData.school}
                            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Degree*</label>
                        <input
                            type="text"
                            value={formData.degree}
                            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                            placeholder="e.g., Bachelor's, Master's"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Field of Study</label>
                    <input
                        type="text"
                        value={formData.field_of_study}
                        onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                        placeholder="e.g., Computer Science"
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
                        <label className="block text-xs font-bold uppercase mb-2">End Date (or Expected)</label>
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
                        placeholder="Activities, achievements, relevant coursework..."
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

            {/* List of Education */}
            <div>
                <h3 className="font-bold text-lg mb-4 uppercase">Your Education ({educationList.length})</h3>

                {educationList.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No education entries added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {educationList.map((edu) => (
                            <div key={edu.id} className="p-4 bg-white border-2 border-primary">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg">{edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}</h4>
                                        <p className="text-slate-600">{edu.school}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {edu.start_date} - {edu.end_date || 'Present'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(edu)}
                                            className="p-2 bg-primary text-white hover:bg-brand-accent transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(edu.id)}
                                            className="p-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                                {edu.description && (
                                    <p className="text-sm text-slate-700 mt-2">{edu.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default EducationModal;
