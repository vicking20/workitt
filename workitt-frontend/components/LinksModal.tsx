import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { API_URL } from '../services/api';

interface Link {
    id: string;
    service: string;
    link_url: string;
}

interface LinksModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    profileId?: string;
}

const LinksModal: React.FC<LinksModalProps> = ({ isOpen, onClose, onUpdate, profileId }) => {
    const [links, setLinks] = useState<Link[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({ service: '', link_url: '' });

    const commonServices = ['LinkedIn', 'GitHub', 'Portfolio', 'Twitter', 'Personal Website', 'Blog', 'Other'];

    useEffect(() => {
        if (isOpen) {
            fetchLinks();
        }
    }, [isOpen, profileId]);

    const fetchLinks = async () => {
        try {
            const url = profileId
                ? `${API_URL}/api/profile/links?profile_id=${profileId}`
                : `${API_URL}/api/profile/links`;

            const response = await axios.get(url, {
                withCredentials: true
            });
            setLinks(response.data.links || []);
        } catch (err) {
            console.error('Failed to fetch links:', err);
            setError('Failed to load links');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const payload = { ...formData, profile_id: profileId };
            if (editingId) {
                await axios.put(`${API_URL}/api/profile/links/${editingId}`, payload, { withCredentials: true });
            } else {
                await axios.post(`${API_URL}/api/profile/links`, payload, { withCredentials: true });
            }

            setFormData({ service: '', link_url: '' });
            setEditingId(null);
            fetchLinks();
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save link');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (link: Link) => {
        setFormData({ service: link.service || '', link_url: link.link_url || '' });
        setEditingId(link.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this link?')) return;
        try {
            await axios.delete(`${API_URL}/api/profile/links/${id}`, { withCredentials: true });
            fetchLinks();
            onUpdate();
        } catch (err) {
            setError('Failed to delete link');
        }
    };

    const getServiceIcon = (service: string) => {
        const icons: { [key: string]: string } = {
            'LinkedIn': 'work',
            'GitHub': 'code',
            'Portfolio': 'web',
            'Twitter': 'chat',
            'Personal Website': 'home',
            'Blog': 'article',
            'Other': 'link'
        };
        return icons[service] || 'link';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Links & Social">
            {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-600 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 border-2 border-primary">
                <h3 className="font-bold text-lg mb-4 uppercase">{editingId ? 'Edit' : 'Add'} Link</h3>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Service/Platform*</label>
                    <select value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent" required>
                        <option value="">Select a service...</option>
                        {commonServices.map(service => (
                            <option key={service} value={service}>{service}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">URL*</label>
                    <input type="url" value={formData.link_url} onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                        placeholder="https://example.com/yourprofile" required />
                </div>

                <div className="flex gap-2">
                    <button type="submit" disabled={isLoading}
                        className="px-4 py-2 bg-brand-accent text-white font-bold uppercase hover:bg-primary transition-colors disabled:opacity-50">
                        {isLoading ? 'Saving...' : editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && <button type="button" onClick={() => { setFormData({ service: '', link_url: '' }); setEditingId(null); }}
                        className="px-4 py-2 bg-white border-2 border-primary font-bold uppercase hover:bg-slate-50">Cancel</button>}
                </div>
            </form>

            <div>
                <h3 className="font-bold text-lg mb-4 uppercase">Your Links ({links.length})</h3>
                {links.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No links added yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {links.map((link) => (
                            <div key={link.id} className="p-4 bg-white border-2 border-primary flex justify-between items-center">
                                <a href={link.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 flex-1 hover:text-brand-accent transition-colors">
                                    <span className="material-symbols-outlined text-brand-accent">{getServiceIcon(link.service)}</span>
                                    <div>
                                        <p className="font-bold text-sm">{link.service}</p>
                                        <p className="text-xs text-slate-500 truncate">{link.link_url}</p>
                                    </div>
                                </a>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(link)} className="p-1 hover:bg-slate-100 rounded transition-colors" title="Edit">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(link.id)} className="p-1 hover:bg-red-100 rounded transition-colors text-red-600" title="Delete">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default LinksModal;
