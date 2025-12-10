import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { API_URL } from '../services/api';

interface Skill {
    id: string;
    name: string;
    level: string;
}

interface SkillsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    profileId?: string;
}

const SkillsModal: React.FC<SkillsModalProps> = ({ isOpen, onClose, onUpdate, profileId }) => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        level: 'Intermediate'
    });

    const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

    useEffect(() => {
        if (isOpen) {
            fetchSkills();
        }
    }, [isOpen, profileId]);

    const fetchSkills = async () => {
        try {
            const url = profileId
                ? `${API_URL}/api/profile/skills?profile_id=${profileId}`
                : `${API_URL}/api/profile/skills`;

            const response = await axios.get(url, {
                withCredentials: true
            });
            setSkills(response.data.skills || []);
        } catch (err) {
            console.error('Failed to fetch skills:', err);
            setError('Failed to load skills');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (editingId) {
                await axios.put(`${API_URL}/api/profile/skills/${editingId}`, { ...formData, profile_id: profileId }, {
                    withCredentials: true
                });
            } else {
                await axios.post(`${API_URL}/api/profile/skills`, { ...formData, profile_id: profileId }, {
                    withCredentials: true
                });
            }

            setFormData({ name: '', level: 'Intermediate' });
            setEditingId(null);
            fetchSkills();
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save skill');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (skill: Skill) => {
        setFormData({
            name: skill.name || '',
            level: skill.level || 'Intermediate'
        });
        setEditingId(skill.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        try {
            await axios.delete(`${API_URL}/api/profile/skills/${id}`, {
                withCredentials: true
            });
            fetchSkills();
            onUpdate();
        } catch (err) {
            setError('Failed to delete skill');
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', level: 'Intermediate' });
        setEditingId(null);
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Intermediate': return 'bg-green-100 text-green-800 border-green-300';
            case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Expert': return 'bg-purple-100 text-purple-800 border-purple-300';
            default: return 'bg-slate-100 text-slate-800 border-slate-300';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Skills">
            {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 border-2 border-primary">
                <h3 className="font-bold text-lg mb-4 uppercase">{editingId ? 'Edit' : 'Add'} Skill</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Skill Name*</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                            placeholder="e.g., Python, Project Management"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Proficiency Level*</label>
                        <select
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                            required
                        >
                            {skillLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
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

            {/* List of Skills */}
            <div>
                <h3 className="font-bold text-lg mb-4 uppercase">Your Skills ({skills.length})</h3>

                {skills.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No skills added yet.</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {skills.map((skill) => (
                            <div key={skill.id} className="group relative">
                                <div className={`px-4 py-2 border-2 ${getLevelColor(skill.level)} font-bold flex items-center gap-2`}>
                                    <span>{skill.name}</span>
                                    <span className="text-xs opacity-75">({skill.level})</span>
                                    <div className="flex gap-1 ml-2">
                                        <button
                                            onClick={() => handleEdit(skill)}
                                            className="p-1 hover:bg-white/50 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-xs">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(skill.id)}
                                            className="p-1 hover:bg-red-200 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-xs">close</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default SkillsModal;
