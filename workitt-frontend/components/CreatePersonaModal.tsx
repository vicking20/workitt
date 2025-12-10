import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { API_URL } from '../services/api';

interface CreatePersonaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (newProfileId: string) => void;
}

const CreatePersonaModal: React.FC<CreatePersonaModalProps> = ({ isOpen, onClose, onCreated }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        job_sector: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/api/profiles`, formData, {
                withCredentials: true
            });
            setFormData({ first_name: '', last_name: '', job_sector: '' });

            // Pass the new profile ID to the parent
            if (response.data?.profile?.id) {
                onCreated(response.data.profile.id);
            } else {
                onCreated('');
            }
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create persona');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Persona">
            {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-600 text-red-600 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="p-4">
                <p className="mb-4 text-slate-600 text-sm">
                    Create a separate profile for a different job role or industry. Each persona has its own work history, skills, and resume data.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">First Name</label>
                        <input
                            type="text"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2">Last Name</label>
                        <input
                            type="text"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                            required
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-bold uppercase mb-2">Job Sector / Role Title</label>
                    <input
                        type="text"
                        value={formData.job_sector}
                        onChange={(e) => setFormData({ ...formData, job_sector: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                        placeholder="e.g. Software Engineer, Data Scientist, Product Manager"
                        required
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white border-2 border-primary font-bold uppercase hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-brand-accent text-white font-bold uppercase hover:bg-primary transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Creating...' : 'Create Persona'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreatePersonaModal;
