
import React from 'react';
import { getAllTemplates } from '../../registries/TemplateRegistry';

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  visibility: {
    name: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
  };
}

interface BaselineControlsProps {
  title: string;
  templateId: string;
  jobTitle: string;
  company: string;
  date: string;
  hiringManagerName: string;
  contact: ContactInfo;
  visibility: {
    company: boolean;
    jobTitle: boolean;
    date: boolean;
    hiringManager: boolean;
  };
  onUpdate: (field: string, value: any) => void;
  onContactUpdate: (field: keyof ContactInfo, value: any) => void;
  onVisibilityUpdate: (field: keyof ContactInfo['visibility']) => void;
  onFieldVisibilityUpdate: (field: 'company' | 'jobTitle' | 'date' | 'hiringManager') => void;
}

const BaselineControls: React.FC<BaselineControlsProps> = ({
  title,
  templateId,
  jobTitle,
  company,
  date,
  hiringManagerName,
  contact,
  visibility,
  onUpdate,
  onContactUpdate,
  onVisibilityUpdate,
  onFieldVisibilityUpdate
}) => {
  const templates = getAllTemplates();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-2">

      {/* Cover Letter Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Cover Letter Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onUpdate('title', e.target.value)}
          className="w-full p-3 border-2 border-slate-300 focus:border-brand-accent outline-none text-sm"
          placeholder="e.g., Software Engineer Cover Letter"
        />
      </div>


      {/* Row 2: Job Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Target Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => onUpdate('jobTitle', e.target.value)}
            className="w-full p-2 border-2 border-slate-200 focus:border-brand-accent outline-none font-sans text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => onUpdate('company', e.target.value)}
            className="w-full p-2 border-2 border-slate-200 focus:border-brand-accent outline-none font-sans text-sm"
          />
        </div>
      </div>

      {/* Row 3: Date & Hiring Manager */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => onUpdate('date', e.target.value)}
            className="w-full p-2 border-2 border-slate-200 focus:border-brand-accent outline-none font-sans text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Hiring Manager</label>
          <input
            type="text"
            value={hiringManagerName}
            onChange={(e) => onUpdate('hiringManagerName', e.target.value)}
            placeholder="Hiring Manager"
            className="w-full p-2 border-2 border-slate-200 focus:border-brand-accent outline-none font-sans text-sm"
          />
        </div>
      </div>

      {/* Row 3: Contact Block */}
      <div className="bg-slate-50 p-4 rounded border border-slate-200">
        <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">contact_mail</span>
          Contact Information
        </h3>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={contact.name}
              onChange={(e) => onContactUpdate('name', e.target.value)}
              placeholder="Your Name"
              className="flex-1 p-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="email"
              value={contact.email}
              onChange={(e) => onContactUpdate('email', e.target.value)}
              placeholder="Email"
              className="flex-1 p-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => onContactUpdate('phone', e.target.value)}
              placeholder="Phone"
              className="flex-1 p-2 border border-slate-300 rounded text-sm"
            />
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={contact.address}
              onChange={(e) => onContactUpdate('address', e.target.value)}
              placeholder="Address"
              className="flex-1 p-2 border border-slate-300 rounded text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaselineControls;
