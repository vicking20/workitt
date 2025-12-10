import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="relative w-full flex-col min-h-screen bg-lavender-tint">
            <Navbar />

            <main className="container mx-auto px-6 lg:px-12 py-24 max-w-4xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-brand-accent hover:text-primary transition-colors mb-6 font-bold uppercase text-sm"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Home
                    </Link>
                    <h1 className="font-display text-5xl lg:text-6xl font-black text-primary uppercase mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-600 font-medium">
                        Last Updated: December 6, 2025
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white border-2 border-primary p-8 lg:p-12 space-y-8">

                    {/* Introduction */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">shield</span>
                            Your Privacy Matters
                        </h2>
                        <p className="text-slate-700 leading-relaxed">
                            At Workitt, we take your privacy seriously. This Privacy Policy explains how we collect, use, protect, and handle your personal information when you use our AI-powered resume and cover letter creation platform. We are committed to transparency and giving you control over your data.
                        </p>
                    </section>

                    {/* GDPR Compliance */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">verified_user</span>
                            GDPR Compliance
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Workitt is fully compliant with the General Data Protection Regulation (GDPR) and other international privacy laws. We respect your rights to:
                        </p>
                        <ul className="list-none space-y-2 ml-6">
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Access your data:</strong> Request a copy of all personal information we hold about you</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Rectify your data:</strong> Correct any inaccurate or incomplete information</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Delete your data:</strong> Request complete removal of your account and all associated data at any time</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Data portability:</strong> Export your data in a machine-readable format</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Withdraw consent:</strong> Opt-out of data processing activities at any time</span>
                            </li>
                        </ul>
                    </section>

                    {/* Data Collection */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">database</span>
                            Information We Collect
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-primary mb-2">Account Information</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    When you create an account, we collect your name, email address, and password (encrypted). This information is necessary to provide you with access to our services.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Resume & Cover Letter Content</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    We store the content you create, including your professional experience, education, skills, and other career-related information. This data is used solely to provide our AI-powered enhancement services and is never shared with third parties.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Usage Data</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    We collect anonymized usage statistics to improve our service, including feature usage, error logs, and performance metrics. This data cannot be used to identify individual users.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">lock</span>
                            Data Security & Encryption
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Your data security is our top priority. We implement industry-standard security measures:
                        </p>
                        <ul className="list-none space-y-2 ml-6">
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>End-to-end encryption:</strong> All data is encrypted in transit using TLS/SSL protocols</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Encrypted storage:</strong> Your data is encrypted at rest using AES-256 encryption</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Secure hosting:</strong> Our servers are hosted in secure, certified data centers with 24/7 monitoring</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Regular security audits:</strong> We conduct regular security assessments and penetration testing</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Access controls:</strong> Strict internal access policies ensure only authorized personnel can access systems</span>
                            </li>
                        </ul>
                    </section>

                    {/* Third Parties */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">block</span>
                            We Never Sell Your Data
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            <strong>Your data is yours, period.</strong> We do not sell, rent, or trade your personal information to third parties for marketing or any other purposes. Your resume content, career information, and personal details remain completely private.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            We only share data with trusted service providers who help us operate our platform (such as cloud hosting providers and AI service providers), and only to the extent necessary to provide our services. These partners are contractually obligated to protect your data and cannot use it for their own purposes.
                        </p>
                    </section>

                    {/* AI Processing */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">psychology</span>
                            AI Processing & Data Usage
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Our AI-powered features use your resume and cover letter content to provide enhancement suggestions and generate professional content. Here's how we handle AI processing:
                        </p>
                        <ul className="list-none space-y-2 ml-6">
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Temporary processing:</strong> Your content is sent to our AI providers only during active enhancement requests</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>No AI training:</strong> Your data is never used to train AI models or improve third-party AI systems</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Immediate deletion:</strong> AI providers delete your data immediately after processing</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Secure transmission:</strong> All AI API calls are encrypted and authenticated</span>
                            </li>
                        </ul>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">schedule</span>
                            Data Retention & Deletion
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            You have complete control over your data:
                        </p>
                        <ul className="list-none space-y-2 ml-6">
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Active accounts:</strong> We retain your data as long as your account is active</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Account deletion:</strong> You can delete your account at any time from your account settings</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Complete removal:</strong> Upon account deletion, all your personal data is permanently removed within 30 days</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span><strong>Backup deletion:</strong> Data is also removed from all backup systems within 90 days</span>
                            </li>
                        </ul>
                    </section>

                    {/* Cookies */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">cookie</span>
                            Cookies & Tracking
                        </h2>
                        <p className="text-slate-700 leading-relaxed">
                            We use essential cookies to maintain your session and provide core functionality. We do not use third-party advertising cookies or tracking pixels. You can manage cookie preferences in your browser settings.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">gavel</span>
                            Your Rights & Choices
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-none space-y-2 ml-6">
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">arrow_right</span>
                                <span>Access, update, or delete your personal information at any time</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">arrow_right</span>
                                <span>Export your data in a portable format</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">arrow_right</span>
                                <span>Opt-out of marketing communications (we send very few!)</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">arrow_right</span>
                                <span>Lodge a complaint with your local data protection authority</span>
                            </li>
                        </ul>
                    </section>

                    {/* Contact */}
                    <section className="bg-lavender-tint border-2 border-primary p-6">
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">contact_support</span>
                            Questions About Privacy?
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy or how we handle your data, please contact us:
                        </p>
                        <div className="space-y-2">
                            <p className="text-slate-700">
                                <strong>Email:</strong> <a href="mailto:vfatunse@gmail.com" className="text-brand-accent hover:underline">vfatunse@gmail.com</a>
                            </p>
                            <p className="text-slate-700">
                                <strong>Data Protection Officer:</strong> privacy@workitt.com
                            </p>
                        </div>
                    </section>

                    {/* Updates */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">update</span>
                            Policy Updates
                        </h2>
                        <p className="text-slate-700 leading-relaxed">
                            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes via email or through a prominent notice on our platform. Your continued use of Workitt after such changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                </div>

                {/* Back to Top */}
                <div className="mt-12 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-white font-bold uppercase text-sm hover:bg-primary transition-colors border-2 border-primary shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                    >
                        <span className="material-symbols-outlined text-lg">home</span>
                        Return to Home
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Privacy;
