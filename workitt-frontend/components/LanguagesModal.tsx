import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { API_URL } from '../services/api';

interface Language {
    id: string;
    lang_name: string;
    lang_proficiency: string;
}

interface LanguagesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    profileId?: string;
}

const LanguagesModal: React.FC<LanguagesModalProps> = ({ isOpen, onClose, onUpdate, profileId }) => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        lang_name: '',
        lang_proficiency: 'Intermediate'
    });

    const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Native/Bilingual'];

    useEffect(() => {
        if (isOpen) {
            fetchLanguages();
        }
    }, [isOpen, profileId]);

    const fetchLanguages = async () => {
        try {
            const url = profileId
                ? `${API_URL}/api/profile/languages?profile_id=${profileId}`
                : `${API_URL}/api/profile/languages`;

            const response = await axios.get(url, {
                withCredentials: true
            });
            setLanguages(response.data.languages || []);
        } catch (err) {
            console.error('Failed to fetch languages:', err);
            setError('Failed to load languages');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const dataToSend = { ...formData, ...(profileId && { profile_id: profileId }) };

            if (editingId) {
                await axios.put(`${API_URL}/api/profile/languages/${editingId}`, dataToSend, {
                    withCredentials: true
                });
            } else {
                await axios.post(`${API_URL}/api/profile/languages`, dataToSend, {
                    withCredentials: true
                });
            }

            setFormData({ lang_name: '', lang_proficiency: 'Intermediate' });
            setEditingId(null);
            fetchLanguages();
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save language');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (lang: Language) => {
        setFormData({
            lang_name: lang.lang_name || '',
            lang_proficiency: lang.lang_proficiency || 'Intermediate'
        });
        setEditingId(lang.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this language?')) return;

        try {
            await axios.delete(`${API_URL}/api/profile/languages/${id}`, {
                withCredentials: true
            });
            fetchLanguages();
            onUpdate();
        } catch (err) {
            setError('Failed to delete language');
        }
    };

    const handleCancel = () => {
        setFormData({ lang_name: '', lang_proficiency: 'Intermediate' });
        setEditingId(null);
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Intermediate': return 'bg-green-100 text-green-800 border-green-300';
            case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Native/Bilingual': return 'bg-purple-100 text-purple-800 border-purple-300';
            default: return 'bg-slate-100 text-slate-800 border-slate-300';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Languages">
            {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 border-2 border-primary">
                <h3 className="font-bold text-lg mb-4 uppercase">{editingId ? 'Edit' : 'Add'} Language</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Language*</label>
                        <input
                            type="text"
                            value={formData.lang_name}
                            onChange={(e) => setFormData({ ...formData, lang_name: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                            placeholder="e.g., English, Spanish, Mandarin"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Proficiency*</label>
                        <select
                            value={formData.lang_proficiency}
                            onChange={(e) => setFormData({ ...formData, lang_proficiency: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                            required
                        >
                            {proficiencyLevels.map(level => (
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

            {/* List of Languages */}
            <div>
                <h3 className="font-bold text-lg mb-4 uppercase">Your Languages ({languages.length})</h3>

                {languages.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No languages added yet.</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {languages.map((lang) => (
                            <div key={lang.id} className="group relative">
                                <div className={`px-4 py-2 border-2 ${getLevelColor(lang.lang_proficiency)} font-bold flex items-center gap-2`}>
                                    <span>{lang.lang_name}</span>
                                    <span className="text-xs opacity-75">({lang.lang_proficiency})</span>
                                    <div className="flex gap-1 ml-2">
                                        <button
                                            onClick={() => handleEdit(lang)}
                                            className="p-1 hover:bg-white/50 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-xs">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lang.id)}
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

export default LanguagesModal;
