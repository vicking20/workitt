import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms: React.FC = () => {
    React.useEffect(() => {
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
                        Terms of Service
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
                            <span className="material-symbols-outlined text-brand-accent">description</span>
                            Agreement to Terms
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Welcome to Workitt! These Terms of Service ("Terms") govern your access to and use of our AI-powered resume and cover letter creation platform. By accessing or using Workitt, you agree to be bound by these Terms.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            If you do not agree to these Terms, please do not use our services. We reserve the right to update these Terms at any time, and your continued use of Workitt constitutes acceptance of any changes.
                        </p>
                    </section>

                    {/* Service Description */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">work</span>
                            Our Services
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Workitt provides AI-powered tools to help you create, edit, and optimize professional resumes and cover letters. Our services include:
                        </p>
                        <ul className="list-none space-y-2 ml-6">
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span>AI-powered resume creation and enhancement</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span>AI-powered cover letter generation and customization</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span>Document storage and management</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span>Application tracking and organization</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">check_circle</span>
                                <span>PDF export and download capabilities</span>
                            </li>
                        </ul>
                    </section>

                    {/* Account Registration */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">person_add</span>
                            Account Registration
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-primary mb-2">Account Creation</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    To use Workitt, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Eligibility</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    You must be at least 16 years old to use Workitt. By creating an account, you represent that you meet this age requirement and have the legal capacity to enter into these Terms.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Account Security</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    You must immediately notify us of any unauthorized use of your account or any other security breach. We are not liable for any loss or damage arising from your failure to protect your account credentials.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Acceptable Use */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">rule</span>
                            Acceptable Use Policy
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            When using Workitt, you agree NOT to:
                        </p>
                        <ul className="list-none space-y-2 ml-6">
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-red-500 text-sm mt-1">cancel</span>
                                <span>Provide false, misleading, or fraudulent information in your resumes or cover letters</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-red-500 text-sm mt-1">cancel</span>
                                <span>Use the service for any illegal or unauthorized purpose</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-red-500 text-sm mt-1">cancel</span>
                                <span>Attempt to gain unauthorized access to our systems or other users' accounts</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-red-500 text-sm mt-1">cancel</span>
                                <span>Reverse engineer, decompile, or attempt to extract source code from our platform</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-red-500 text-sm mt-1">cancel</span>
                                <span>Use automated systems (bots, scrapers) to access the service without permission</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-red-500 text-sm mt-1">cancel</span>
                                <span>Resell, redistribute, or commercialize our services without authorization</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-red-500 text-sm mt-1">cancel</span>
                                <span>Upload malicious code, viruses, or any harmful content</span>
                            </li>
                        </ul>
                    </section>

                    {/* Content Ownership */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">copyright</span>
                            Intellectual Property & Content Ownership
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-primary mb-2">Your Content</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    You retain all rights to the content you create using Workitt, including your resumes, cover letters, and personal information. We do not claim ownership of your content.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Our Platform</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Workitt and all its features, including our AI technology, design, code, and branding, are owned by Workitt Inc. and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our platform without permission.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">License to Use</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    By uploading content to Workitt, you grant us a limited license to process, store, and display your content solely for the purpose of providing our services to you. This license terminates when you delete your content or account.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* AI Services */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">psychology</span>
                            AI-Generated Content
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Our AI-powered features provide suggestions and generate content to help you create professional documents. Please note:
                        </p>
                        <ul className="list-none space-y-2 ml-6">
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">info</span>
                                <span><strong>Review AI content:</strong> You are responsible for reviewing and verifying all AI-generated content before use</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">info</span>
                                <span><strong>Accuracy:</strong> While our AI strives for accuracy, we cannot guarantee that all suggestions are error-free or suitable for your specific situation</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">info</span>
                                <span><strong>Your responsibility:</strong> You are solely responsible for the content you submit to employers, and we are not liable for any outcomes resulting from your use of AI-generated content</span>
                            </li>
                            <li className="flex items-start gap-3 text-slate-700">
                                <span className="material-symbols-outlined text-brand-accent text-sm mt-1">info</span>
                                <span><strong>No guarantees:</strong> We do not guarantee job placement, interview invitations, or any specific career outcomes</span>
                            </li>
                        </ul>
                    </section>

                    {/* Subscription & Payment */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">payments</span>
                            Subscription & Payment Terms
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-primary mb-2">Free & Premium Plans</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Workitt offers both free and premium subscription plans. Premium features require a paid subscription, which will be billed according to the plan you select.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Billing</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Premium subscriptions are billed monthly or annually in advance. You authorize us to charge your payment method for all fees associated with your subscription.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Cancellation</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    You may cancel your premium subscription at any time from your account settings. Cancellations take effect at the end of the current billing period. We do not provide refunds for partial months or unused time.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Price Changes</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    We reserve the right to change our pricing. We will notify you at least 30 days before any price increase takes effect. Your continued use after the price change constitutes acceptance.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">power_settings_new</span>
                            Account Termination
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-primary mb-2">Your Right to Terminate</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    You may delete your account at any time from your account settings. Upon deletion, your data will be permanently removed as described in our Privacy Policy.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Our Right to Terminate</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    We reserve the right to suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or for any other reason at our discretion. We will provide notice when reasonably possible.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Disclaimers */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">warning</span>
                            Disclaimers & Limitations
                        </h2>
                        <div className="bg-yellow-50 border-2 border-yellow-400 p-6 mb-4">
                            <p className="text-slate-700 leading-relaxed font-medium">
                                <strong>SERVICE PROVIDED "AS IS":</strong> Workitt is provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the service's reliability, accuracy, or fitness for a particular purpose.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-primary mb-2">No Employment Guarantees</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    While Workitt helps you create professional documents, we do not guarantee job offers, interviews, or any specific career outcomes. Your success depends on many factors beyond our control.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Limitation of Liability</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    To the maximum extent permitted by law, Workitt Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Maximum Liability</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Our total liability to you for any claims arising from your use of Workitt shall not exceed the amount you paid us in the 12 months preceding the claim, or €100, whichever is greater.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Indemnification */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">shield_person</span>
                            Indemnification
                        </h2>
                        <p className="text-slate-700 leading-relaxed">
                            You agree to indemnify and hold harmless Workitt Inc., its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of our services, your violation of these Terms, or your violation of any rights of another party.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">gavel</span>
                            Governing Law & Disputes
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-primary mb-2">Governing Law</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    These Terms are governed by the laws of the European Union and Finland, without regard to conflict of law principles.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-bold text-primary mb-2">Dispute Resolution</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Any disputes arising from these Terms or your use of Workitt shall be resolved through good faith negotiations. If negotiations fail, disputes shall be resolved through binding arbitration or in the courts of Finland.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Changes to Terms */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">update</span>
                            Changes to These Terms
                        </h2>
                        <p className="text-slate-700 leading-relaxed">
                            We may update these Terms from time to time. We will notify you of material changes via email or through a prominent notice on our platform at least 30 days before the changes take effect. Your continued use of Workitt after the changes become effective constitutes your acceptance of the updated Terms.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="bg-lavender-tint border-2 border-primary p-6">
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">contact_support</span>
                            Questions About These Terms?
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <div className="space-y-2">
                            <p className="text-slate-700">
                                <strong>Email:</strong> <a href="mailto:vfatunse@gmail.com" className="text-brand-accent hover:underline">vfatunse@gmail.com</a>
                            </p>
                            <p className="text-slate-700">
                                <strong>Legal:</strong> legal@workitt.com
                            </p>
                        </div>
                    </section>

                    {/* Severability */}
                    <section>
                        <h2 className="font-display text-2xl font-bold text-primary uppercase mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-accent">fact_check</span>
                            Severability & Entire Agreement
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            These Terms, together with our Privacy Policy, constitute the entire agreement between you and Workitt Inc. regarding your use of our services and supersede any prior agreements.
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

export default Terms;
