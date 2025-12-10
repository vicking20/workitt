import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { API_URL } from '../services/api';

interface Certification {
    id: string;
    name: string;
    authority: string;
    license_number: string;
    cert_link: string;
    start_date: string | null;
    end_date: string | null;
    description: string;
}

interface CertificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    profileId?: string;
}

const CertificationsModal: React.FC<CertificationsModalProps> = ({ isOpen, onClose, onUpdate, profileId }) => {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        authority: '',
        license_number: '',
        cert_link: '',
        start_date: '',
        end_date: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchCertifications();
        }
    }, [isOpen, profileId]);

    const fetchCertifications = async () => {
        try {
            const url = profileId
                ? `${API_URL}/api/profile/certifications?profile_id=${profileId}`
                : `${API_URL}/api/profile/certifications`;

            const response = await axios.get(url, {
                withCredentials: true
            });
            setCertifications(response.data.certifications || []);
        } catch (err) {
            console.error('Failed to fetch certifications:', err);
            setError('Failed to load certifications');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (editingId) {
                await axios.put(`${API_URL}/api/profile/certifications/${editingId}`, formData, {
                    withCredentials: true
                });
            } else {
                await axios.post(`${API_URL}/api/profile/certifications`, {
                    ...formData,
                    profile_id: profileId
                }, {
                    withCredentials: true
                });
            }

            setFormData({ name: '', authority: '', license_number: '', cert_link: '', start_date: '', end_date: '', description: '' });
            setEditingId(null);
            fetchCertifications();
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save certification');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (cert: Certification) => {
        setFormData({
            name: cert.name || '',
            authority: cert.authority || '',
            license_number: cert.license_number || '',
            cert_link: cert.cert_link || '',
            start_date: cert.start_date || '',
            end_date: cert.end_date || '',
            description: cert.description || ''
        });
        setEditingId(cert.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this certification?')) return;
        try {
            await axios.delete(`${API_URL}/api/profile/certifications/${id}`, {
                withCredentials: true
            });
            fetchCertifications();
            onUpdate();
        } catch (err) {
            setError('Failed to delete certification');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Certifications">
            {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-600 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 border-2 border-primary">
                <h3 className="font-bold text-lg mb-4 uppercase">{editingId ? 'Edit' : 'Add'} Certification</h3>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Certification Name*</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Issuing Authority</label>
                        <input type="text" value={formData.authority} onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">License/Credential ID</label>
                        <input type="text" value={formData.license_number} onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Credential URL</label>
                    <input type="url" value={formData.cert_link} onChange={(e) => setFormData({ ...formData, cert_link: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent" placeholder="https://" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Issue Date</label>
                        <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Expiration Date</label>
                        <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2} className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent" />
                </div>

                <div className="flex gap-2">
                    <button type="submit" disabled={isLoading}
                        className="px-4 py-2 bg-brand-accent text-white font-bold uppercase hover:bg-primary transition-colors disabled:opacity-50">
                        {isLoading ? 'Saving...' : editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && <button type="button" onClick={() => { setFormData({ name: '', authority: '', license_number: '', cert_link: '', start_date: '', end_date: '', description: '' }); setEditingId(null); }}
                        className="px-4 py-2 bg-white border-2 border-primary font-bold uppercase hover:bg-slate-50">Cancel</button>}
                </div>
            </form>

            <div>
                <h3 className="font-bold text-lg mb-4 uppercase">Your Certifications ({certifications.length})</h3>
                {certifications.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No certifications added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {certifications.map((cert) => (
                            <div key={cert.id} className="p-4 bg-white border-2 border-primary">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{cert.name}</h4>
                                        {cert.authority && <p className="text-slate-600">{cert.authority}</p>}
                                        {cert.license_number && <p className="text-xs text-slate-500">License: {cert.license_number}</p>}
                                        {cert.start_date && <p className="text-xs text-slate-500 mt-1">{cert.start_date} - {cert.end_date || 'No Expiration'}</p>}
                                        {cert.cert_link && <a href={cert.cert_link} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-accent hover:underline inline-flex items-center gap-1 mt-1">
                                            View Credential <span className="material-symbols-outlined text-xs">open_in_new</span>
                                        </a>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(cert)} className="p-2 bg-primary text-white hover:bg-brand-accent transition-colors" title="Edit">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(cert.id)} className="p-2 bg-red-500 text-white hover:bg-red-600 transition-colors" title="Delete">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                                {cert.description && <p className="text-sm text-slate-700 mt-2">{cert.description}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CertificationsModal;
