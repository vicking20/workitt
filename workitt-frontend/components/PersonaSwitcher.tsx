import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';
import CreatePersonaModal from './CreatePersonaModal';

interface Persona {
    id: string;
    name: string;
    job_sector: string;
    first_name: string;
    last_name: string;
}

interface PersonaSwitcherProps {
    currentProfileId: string;
    onProfileChange: (profileId: string) => void;
    refreshTrigger?: number;
}

const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ currentProfileId, onProfileChange, refreshTrigger = 0 }) => {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchPersonas();
    }, [refreshTrigger]);

    const fetchPersonas = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/profiles`, {
                withCredentials: true
            });
            setPersonas(response.data.profiles || []);
        } catch (err) {
            console.error('Failed to fetch personas:', err);
        }
    };

    const handleSwitch = (id: string) => {
        onProfileChange(id);
        setIsOpen(false);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this persona? This action cannot be undone.')) return;

        try {
            await axios.delete(`${API_URL}/api/profiles/${id}`, {
                withCredentials: true
            });
            fetchPersonas();
            // If deleted current profile, switch to first available
            if (id === currentProfileId) {
                const remaining = personas.filter(p => p.id !== id);
                if (remaining.length > 0) {
                    onProfileChange(remaining[0].id);
                }
            }
        } catch (err) {
            alert('Failed to delete persona. You must have at least one profile.');
        }
    };

    const currentPersona = personas.find(p => p.id === currentProfileId);

    return (
        <div className="relative mb-8">
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase text-slate-500">Your Personas</label>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-xs font-bold text-brand-accent hover:underline uppercase flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Persona
                </button>
            </div>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-4 bg-white border-2 border-primary shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-between hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-accent text-white flex items-center justify-center font-bold text-xl border-2 border-primary">
                            {currentPersona?.first_name?.[0] || 'P'}
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg leading-tight">{currentPersona?.name || 'Loading...'}</h3>
                            <p className="text-xs text-slate-600 uppercase">{currentPersona?.job_sector || 'General Profile'}</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        expand_more
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-primary shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] z-50 max-h-64 overflow-y-auto">
                        {personas.map((persona) => (
                            <div
                                key={persona.id}
                                onClick={() => handleSwitch(persona.id)}
                                className={`p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer border-b-2 border-slate-100 last:border-0 ${persona.id === currentProfileId ? 'bg-blue-50' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-slate-400">
                                        {persona.id === currentProfileId ? 'radio_button_checked' : 'radio_button_unchecked'}
                                    </span>
                                    <div>
                                        <p className="font-bold text-sm">{persona.name}</p>
                                        <p className="text-xs text-slate-500">{persona.job_sector}</p>
                                    </div>
                                </div>

                                {personas.length > 1 && (
                                    <button
                                        onClick={(e) => handleDelete(e, persona.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        title="Delete Persona"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            onClick={() => { setShowCreateModal(true); setIsOpen(false); }}
                            className="w-full p-3 text-left text-sm font-bold text-brand-accent hover:bg-slate-50 flex items-center gap-2 border-t-2 border-slate-100"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Create New Persona
                        </button>
                    </div>
                )}
            </div>

            <CreatePersonaModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={(newProfileId) => {
                    fetchPersonas();
                    if (newProfileId) {
                        onProfileChange(newProfileId);
                    }
                }}
            />
        </div>
    );
};

export default PersonaSwitcher;
