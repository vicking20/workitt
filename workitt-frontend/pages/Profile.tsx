/**
 * Profile Page
 * Protected route - manage user profile information
 */

import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import Modal from "../components/Modal";
import WorkExperienceModal from "../components/WorkExperienceModal";
import EducationModal from "../components/EducationModal";
import SkillsModal from "../components/SkillsModal";
import LanguagesModal from "../components/LanguagesModal";
import CertificationsModal from "../components/CertificationsModal";
import ReferencesModal from "../components/ReferencesModal";
import LinksModal from "../components/LinksModal";
import PersonaSwitcher from "../components/PersonaSwitcher";
import CustomContentModal from "../components/CustomContentModal";
import PreviewModal from "../components/PreviewModal";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  job_sector: string;
  profile_email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  summary: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const profileId = searchParams.get("profileId");

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<ProfileData>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [personaRefreshTrigger, setPersonaRefreshTrigger] = useState(0);

  // Modals state
  const [showWorkExpModal, setShowWorkExpModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);
  const [showCertificationsModal, setShowCertificationsModal] = useState(false);
  const [showReferencesModal, setShowReferencesModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showCustomContentModal, setShowCustomContentModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // Fetch user data
      const userRes = await api.getCurrentUser();
      if (userRes.success && userRes.user) {
        setUser(userRes.user);

        // Fetch profile data (which now contains user's first_name, last_name, phone)
        const response = await api.get("/api/profile");

        if (response.data && response.data.profile) {
          // Merge user data with profile data
          const mergedProfile = {
            ...response.data.profile,
            first_name:
              userRes.user.first_name || response.data.profile.first_name,
            last_name:
              userRes.user.last_name || response.data.profile.last_name,
            phone: userRes.user.phone || response.data.profile.phone,
          };
          setProfile(mergedProfile);
          setEditedProfile(mergedProfile);
        }
      } else {
        navigate("/login");
        return;
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      // Use centralized endpoint with profile ID
      const url = profileId ? `/api/profile/${profileId}` : "/api/profile";
      const response = await api.put(url, editedProfile);

      if (response.data && (response.data.profile || response.data.success)) {
        // Refetch to get updated data
        await fetchProfile();
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        setPersonaRefreshTrigger((prev) => prev + 1);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      setError(err.response?.data?.error || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const response = await api.post("/api/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      if (response.data && response.data.success) {
        setPasswordSuccess("Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
        setTimeout(() => setPasswordSuccess(""), 5000);
      }
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.error || "Failed to change password",
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      return;
    }

    try {
      await api.delete("/api/auth/delete-account");
      api.logout();
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete account");
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate("/");
  };

  const handleProfileChange = (newProfileId: string) => {
    // Update URL to switch profile without reloading
    setSearchParams({ profileId: newProfileId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lavender-tint flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-brand-accent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-tint text-primary font-sans">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-2 border-primary">
        <div className="flex h-16 items-center justify-between px-4 lg:px-12 max-w-[1600px] mx-auto w-full">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/dashboard")}
          >
            <div className="h-8 w-8 bg-primary rotate-45 transition-transform duration-500 group-hover:rotate-[225deg]"></div>
            <h2 className="font-display text-xl lg:text-2xl tracking-tight uppercase text-primary select-none group-hover:text-brand-accent transition-colors">
              Workitt
            </h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            {/* Dashboard Link - Icon on mobile, text on desktop */}
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-slate-600 hover:text-brand-accent transition-colors"
              title="Dashboard"
            >
              <span className="material-symbols-outlined text-2xl lg:text-lg">
                dashboard
              </span>
              <span className="hidden md:inline text-sm font-bold uppercase tracking-widest">
                Dashboard
              </span>
            </Link>

            {/* Logout Button - Icon on mobile, text on desktop */}
            <button
              onClick={handleLogout}
              className="bg-primary text-white p-2 lg:px-6 lg:py-2 text-sm font-bold uppercase hover:bg-brand-accent transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              title="Logout"
            >
              <span className="material-symbols-outlined lg:hidden">
                logout
              </span>
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-8 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-12 pb-20">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[2px] w-12 bg-brand-accent"></div>
              <span className="font-sans font-bold uppercase tracking-widest text-sm text-brand-accent">
                Account Settings
              </span>
            </div>
            <h1 className="font-motif text-4xl lg:text-5xl text-primary uppercase">
              Your Profile
            </h1>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-600">
              <p className="text-sm text-red-600 font-sans font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-600">
              <p className="text-sm text-green-600 font-sans font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  check_circle
                </span>
                {successMessage}
              </p>
            </div>
          )}

          {/* Personal Information Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-12 bg-brand-accent"></div>
                <h2 className="font-motif text-2xl uppercase">
                  Personal Information
                </h2>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-white border-2 border-primary text-sm font-bold uppercase hover:bg-primary hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="bg-white border-2 border-primary p-8 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Username
                  </label>
                  <p className="text-lg font-sans">{user?.username}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Email
                  </label>
                  <p className="text-lg font-sans">{user?.email}</p>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.first_name || ""}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-primary bg-white text-primary font-sans focus:outline-none focus:border-brand-accent"
                    />
                  ) : (
                    <p className="text-lg font-sans">
                      {user?.first_name || "Not set"}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.last_name || ""}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-primary bg-white text-primary font-sans focus:outline-none focus:border-brand-accent"
                    />
                  ) : (
                    <p className="text-lg font-sans">
                      {user?.last_name || "Not set"}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-primary bg-white text-primary font-sans focus:outline-none focus:border-brand-accent"
                    />
                  ) : (
                    <p className="text-lg font-sans">
                      {user?.phone || "Not set"}
                    </p>
                  )}
                </div>

                {/* Subscription Type */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Subscription
                  </label>
                  <p className="text-lg font-sans">Free Plan</p>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-brand-accent text-white font-bold uppercase hover:bg-primary transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-8 py-3 bg-white border-2 border-primary font-bold uppercase hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Subscription Section */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-brand-accent"></div>
              <h2 className="font-motif text-2xl uppercase">Subscription</h2>
            </div>

            <div className="bg-white border-2 border-primary p-8 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Current Plan
                  </p>
                  <p className="text-2xl font-bold text-primary mb-1">Free</p>
                  <p className="text-sm text-slate-600">
                    Basic features included
                  </p>
                </div>
                <button className="px-8 py-3 bg-brand-accent text-white font-bold uppercase hover:bg-primary transition-colors shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  Get Premium (Coming Soon)
                </button>
              </div>
            </div>
          </section>

          {/* Account Settings Section */}
          <section className="mt-12 pt-12 border-t-4 border-primary">
            <div className="flex items-center gap-3 lg:gap-4 mb-6">
              <div className="h-[2px] w-8 lg:w-12 bg-red-500"></div>
              <h2 className="font-motif text-lg lg:text-2xl uppercase">
                Account Settings
              </h2>
            </div>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-600 text-green-700 text-sm">
                {passwordSuccess}
              </div>
            )}

            {/* Change Password */}
            <div className="mb-6 p-6 bg-white border-2 border-primary">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">Change Password</h3>
                  <p className="text-sm text-slate-600">
                    Update your account password
                  </p>
                </div>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="px-4 py-2 bg-primary text-white font-bold uppercase hover:bg-brand-accent transition-colors text-sm"
                >
                  {showPasswordForm ? "Cancel" : "Change"}
                </button>
              </div>

              {showPasswordForm && (
                <form
                  onSubmit={handlePasswordChange}
                  className="mt-4 p-4 bg-slate-50 border-2 border-slate-200"
                >
                  {passwordError && (
                    <div className="mb-3 p-2 bg-red-50 border-l-4 border-red-600 text-red-600 text-sm">
                      {passwordError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="block text-xs font-bold uppercase mb-2">
                      Current Password*
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs font-bold uppercase mb-2">
                      New Password* (min 8 characters)
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase mb-2">
                      Confirm New Password*
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-brand-accent"
                      required
                      minLength={8}
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-brand-accent text-white font-bold uppercase hover:bg-primary transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              )}
            </div>

            {/* Delete Account */}
            <div className="p-6 bg-red-50 border-2 border-red-500">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-red-600 text-3xl">
                  warning
                </span>
                <div>
                  <h3 className="font-bold text-lg text-red-700">
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-600">
                    Permanently delete your account and all data
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="mt-3 px-4 py-2 bg-red-600 text-white font-bold uppercase hover:bg-red-700 transition-colors text-sm"
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Work Experience Modal */}
      <WorkExperienceModal
        isOpen={showWorkExpModal}
        onClose={() => setShowWorkExpModal(false)}
        onUpdate={fetchProfile}
        profileId={profile?.id}
      />

      {/* Education Modal */}
      <EducationModal
        isOpen={showEducationModal}
        onClose={() => setShowEducationModal(false)}
        onUpdate={fetchProfile}
        profileId={profile?.id}
      />

      {/* Skills Modal */}
      <SkillsModal
        isOpen={showSkillsModal}
        onClose={() => setShowSkillsModal(false)}
        onUpdate={fetchProfile}
        profileId={profile?.id}
      />

      {/* Languages Modal */}
      <LanguagesModal
        isOpen={showLanguagesModal}
        onClose={() => setShowLanguagesModal(false)}
        onUpdate={fetchProfile}
        profileId={profile?.id}
      />

      {/* Certifications Modal */}
      <CertificationsModal
        isOpen={showCertificationsModal}
        onClose={() => setShowCertificationsModal(false)}
        onUpdate={fetchProfile}
        profileId={profile?.id}
      />

      {/* References Modal */}
      <ReferencesModal
        isOpen={showReferencesModal}
        onClose={() => setShowReferencesModal(false)}
        onUpdate={fetchProfile}
        profileId={profile?.id}
      />

      {/* Links Modal */}
      <LinksModal
        isOpen={showLinksModal}
        onClose={() => setShowLinksModal(false)}
        onUpdate={fetchProfile}
        profileId={profile?.id}
      />

      {/* Custom Content Modal */}
      {profile && (
        <CustomContentModal
          isOpen={showCustomContentModal}
          onClose={() => setShowCustomContentModal(false)}
          profileId={profile?.id}
          onUpdate={fetchProfile}
        />
      )}

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="text-center">
          <span className="material-symbols-outlined text-red-600 text-6xl mb-4 inline-block">
            error
          </span>
          <h3 className="text-xl font-bold mb-3">Are you absolutely sure?</h3>
          <p className="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </p>

          <div className="bg-slate-50 border-2 border-slate-300 p-4 mb-6 text-left">
            <p className="text-sm mb-2 font-bold">
              Please type <span className="text-red-600">DELETE</span> to
              confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full px-3 py-2 border-2 border-primary focus:outline-none focus:border-red-600"
              placeholder="Type DELETE here"
            />
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmation("");
              }}
              className="px-6 py-2 bg-white border-2 border-primary font-bold uppercase hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== "DELETE"}
              className="px-6 py-2 bg-red-600 text-white font-bold uppercase hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Forever
            </button>
          </div>
        </div>
      </Modal>
      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        profileId={profile?.id}
      />
    </div>
  );
};

export default Profile;
