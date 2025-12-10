import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { API_URL } from '../services/api';

interface CustomSection {
    id: string;
    title: string;
    content: string;
}

interface CustomContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    profileId: string;
    onUpdate: () => void;
}

const CustomContentModal: React.FC<CustomContentModalProps> = ({ isOpen, onClose, profileId, onUpdate }) => {
    const [sections, setSections] = useState<CustomSection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({ title: '', content: '' });

    useEffect(() => {
        if (isOpen && profileId) {
            fetchCustomContent();
        }
    }, [isOpen, profileId]);

    const fetchCustomContent = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/profile/${profileId}/custom-content`, {
                withCredentials: true
            });
            setSections(response.data.custom_sections || []);
        } catch (err) {
            console.error('Failed to fetch custom content:', err);
            // Don't show error if it's just empty or first time
        }
    };

    const saveSections = async (updatedSections: CustomSection[]) => {
        try {
            await axios.post(`${API_URL}/api/profile/${profileId}/custom-content`, {
                custom_sections: updatedSections
            }, {
                withCredentials: true
            });
            setSections(updatedSections);
            onUpdate();
        } catch (err) {
            setError('Failed to save changes');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const newSection: CustomSection = {
            id: editingId || Date.now().toString(),
            title: formData.title,
            content: formData.content
        };

        let updatedSections;
        if (editingId) {
            updatedSections = sections.map(s => s.id === editingId ? newSection : s);
        } else {
            updatedSections = [...sections, newSection];
        }

        await saveSections(updatedSections);
        setFormData({ title: '', content: '' });
        setEditingId(null);
        setIsLoading(false);
    };

    const handleEdit = (section: CustomSection) => {
        setFormData({ title: section.title, content: section.content });
        setEditingId(section.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this section?')) return;
        const updatedSections = sections.filter(s => s.id !== id);
        await saveSections(updatedSections);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Custom Sections">
            {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-600 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 border-2 border-primary">
                <h3 className="font-bold text-lg mb-4 uppercase">{editingId ? 'Edit' : 'Add'} Custom Section</h3>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Section Title*</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                        placeholder="e.g. Volunteering, Publications, Awards"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Content*</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                        placeholder="Describe your achievements..."
                        required
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
                            onClick={() => { setFormData({ title: '', content: '' }); setEditingId(null); }}
                            className="px-4 py-2 bg-white border-2 border-primary font-bold uppercase hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div>
                <h3 className="font-bold text-lg mb-4 uppercase">Your Custom Sections ({sections.length})</h3>
                {sections.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No custom sections added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {sections.map((section) => (
                            <div key={section.id} className="p-4 bg-white border-2 border-primary">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg">{section.title}</h4>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(section)} className="p-2 bg-primary text-white hover:bg-brand-accent transition-colors" title="Edit">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(section.id)} className="p-2 bg-red-500 text-white hover:bg-red-600 transition-colors" title="Delete">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{section.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CustomContentModal;
