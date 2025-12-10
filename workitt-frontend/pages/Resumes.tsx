/**
 * Resumes Page
 * Manage and create resumes
 */

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../services/api";
import ConfirmModal from "../components/ConfirmModal";
import AuthNavbar from "../components/AuthNavbar";

interface Resume {
  resume_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const Resumes: React.FC = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/resumes`, {
        withCredentials: true,
      });
      setResumes(response.data.resumes || []);
    } catch (err: any) {
      console.error("Failed to fetch resumes:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
        return;
      }
      setError("Failed to load resumes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (resumeId: string) => {
    setResumeToDelete(resumeId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!resumeToDelete) return;

    try {
      await axios.delete(`${API_URL}/api/profile/${resumeToDelete}`, {
        withCredentials: true,
      });
      fetchResumes();
    } catch (err) {
      alert("Failed to delete resume");
    } finally {
      setResumeToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lavender-tint flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-brand-accent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-tint">
      {/* Shared Navbar */}
      <AuthNavbar />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 lg:px-12 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[2px] w-12 bg-brand-accent"></div>
              <span className="font-sans font-bold uppercase tracking-widest text-sm text-brand-accent">
                Your Documents
              </span>
            </div>
            <h2 className="font-motif text-4xl lg:text-5xl text-primary uppercase">
              Resumes
            </h2>
            <p className="mt-3 text-slate-600 font-sans text-lg">
              Manage and organize your resumes here
            </p>
          </div>

          <Link
            to="/resumes/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-accent text-white font-bold uppercase hover:bg-primary transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            Add Resume
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-600 text-red-600">
            <p className="font-bold">{error}</p>
          </div>
        )}

        {/* Resumes Grid */}
        {resumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-32 h-32 bg-white border-4 border-primary rounded-full flex items-center justify-center mb-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <span className="material-symbols-outlined text-6xl text-slate-400">
                description
              </span>
            </div>
            <h3 className="font-motif text-2xl text-primary uppercase mb-4">
              No Resumes Yet
            </h3>
            <p className="text-slate-600 font-sans mb-8 max-w-md mx-auto">
              You don't have any resumes yet. Create your first resume to get
              started.
            </p>
            <Link
              to="/resumes/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-accent text-white font-bold uppercase hover:bg-primary transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
            >
              <span className="material-symbols-outlined">add</span>
              Create Your First Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.resume_id}
                className="group bg-white border-2 border-primary p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-brand-accent/10 border-2 border-primary group-hover:bg-brand-accent/20 transition-colors">
                    <span className="material-symbols-outlined text-3xl text-brand-accent">
                      description
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase border border-green-800">
                    {new Date(resume.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-primary mb-2 uppercase">
                  {resume.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 font-sans">
                  Last updated{" "}
                  {new Date(resume.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>

                <div className="flex gap-2">
                  <Link
                    to={`/resumes/${resume.resume_id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2 bg-primary text-white font-bold uppercase text-sm hover:bg-brand-accent transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      edit
                    </span>
                    Manage
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(resume.resume_id)}
                    className="px-4 py-2 bg-red-500 text-white font-bold uppercase text-sm hover:bg-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setResumeToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default Resumes;
