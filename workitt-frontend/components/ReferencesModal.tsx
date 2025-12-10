import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { API_URL } from '../services/api';

interface Reference {
    id: string;
    name: string;
    relationship: string;
    contact: string;
}

interface ReferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    profileId?: string;
}

const ReferencesModal: React.FC<ReferencesModalProps> = ({ isOpen, onClose, onUpdate, profileId }) => {
    const [references, setReferences] = useState<Reference[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({ name: '', relationship: '', company: '', contact: '' });

    useEffect(() => {
        if (isOpen) {
            fetchReferences();
        }
    }, [isOpen, profileId]);

    const fetchReferences = async () => {
        try {
            const url = profileId
                ? `${API_URL}/api/profile/references?profile_id=${profileId}`
                : `${API_URL}/api/profile/references`;

            const response = await axios.get(url, {
                withCredentials: true
            });
            setReferences(response.data.references || []);
        } catch (err) {
            console.error('Failed to fetch references:', err);
            setError('Failed to load references');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (editingId) {
                await axios.put(`${API_URL}/api/profile/references/${editingId}`, formData, { withCredentials: true });
            } else {
                await axios.post(`${API_URL}/api/profile/references`, {
                    ...formData,
                    profile_id: profileId
                }, { withCredentials: true });
            }

            setFormData({ name: '', relationship: '', company: '', contact: '' });
            setEditingId(null);
            fetchReferences();
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save reference');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (ref: Reference) => {
        setFormData({ name: ref.name || '', relationship: ref.relationship || '', contact: ref.contact || '' });
        setEditingId(ref.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this reference?')) return;
        try {
            await axios.delete(`${API_URL}/api/profile/references/${id}`, { withCredentials: true });
            fetchReferences();
            onUpdate();
        } catch (err) {
            setError('Failed to delete reference');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="References">
            {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-600 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 border-2 border-primary">
                <h3 className="font-bold text-lg mb-4 uppercase">{editingId ? 'Edit' : 'Add'} Reference</h3>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Name*</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent" required />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Relationship*</label>
                    <input type="text" value={formData.relationship} onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                        placeholder="e.g., Former Manager, Colleague, Professor" required />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Contact Information*</label>
                    <textarea value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        rows={3} className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                        placeholder="Email, phone, or other contact details" required />
                </div>

                <div className="flex gap-2">
                    <button type="submit" disabled={isLoading}
                        className="px-4 py-2 bg-brand-accent text-white font-bold uppercase hover:bg-primary transition-colors disabled:opacity-50">
                        {isLoading ? 'Saving...' : editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && <button type="button" onClick={() => { setFormData({ name: '', relationship: '', contact: '' }); setEditingId(null); }}
                        className="px-4 py-2 bg-white border-2 border-primary font-bold uppercase hover:bg-slate-50">Cancel</button>}
                </div>
            </form>

            <div>
                <h3 className="font-bold text-lg mb-4 uppercase">Your References ({references.length})</h3>
                {references.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No references added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {references.map((ref) => (
                            <div key={ref.id} className="p-4 bg-white border-2 border-primary">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{ref.name}</h4>
                                        <p className="text-slate-600 text-sm">{ref.relationship}</p>
                                        <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{ref.contact}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(ref)} className="p-2 bg-primary text-white hover:bg-brand-accent transition-colors" title="Edit">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(ref.id)} className="p-2 bg-red-500 text-white hover:bg-red-600 transition-colors" title="Delete">
                                            <span className="material-symbols-outlined text-sm">delete</span>
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

export default ReferencesModal;
