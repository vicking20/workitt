/**
 * Dashboard Page
 * Protected route - only accessible to authenticated users
 * Fetches data from /api/dashboard
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../services/api';

interface DashboardData {
  user: {
    username: string;
    email: string;
    verified: boolean;
  };
  stats: {
    total_6_months: number;
    growth: number;
    status_counts: {
      applied: number;
      interview: number;
      offer: number;
      rejected: number;
    };
    monthly_data: Record<string, number>;
  };
  recent_applications: Array<{
    id: string;
    job_title: string;
    company: string;
    status: string;
    date: string;
  }>;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/dashboard`, {
          withCredentials: true
        });
        setData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);

        // If unauthorized, redirect to login
        if (err.response?.status === 401 || err.response?.status === 403) {
          await logout();
          navigate('/login');
          return;
        }

        setError('Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lavender-tint flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-brand-accent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-lavender-tint flex items-center justify-center">
        <div className="bg-white p-8 border-4 border-red-600 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] text-center">
          <span className="material-symbols-outlined text-4xl text-red-600 mb-4">error</span>
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white font-bold uppercase hover:bg-brand-accent transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tools = [
    {
      name: 'Resume Builder',
      description: 'Create professional resumes with AI assistance',
      icon: 'description',
      color: 'bg-blue-500',
      link: '/resumes',
      available: true
    },
    {
      name: 'Cover Letter Generator',
      description: 'Generate tailored cover letters instantly',
      icon: 'mail',
      color: 'bg-green-500',
      link: '/cover-letters',
      available: true
    },
    {
      name: 'Application Tracker',
      description: 'Track all your job applications in one place',
      icon: 'work',
      color: 'bg-purple-500',
      link: '/applications',
      available: true
    },
    {
      name: 'AI Job Agent',
      description: 'Let AI apply to jobs for you automatically',
      icon: 'smart_toy',
      color: 'bg-brand-accent',
      link: '/ai-agent',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-lavender-tint text-primary font-sans">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-2 border-primary">
        <div className="flex h-16 items-center justify-between px-4 lg:px-12 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="h-8 w-8 bg-primary rotate-45 transition-transform duration-500 group-hover:rotate-[225deg]"></div>
            <h2 className="font-display text-xl lg:text-2xl tracking-tight uppercase text-primary select-none group-hover:text-brand-accent transition-colors">
              Workitt
            </h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            {/* Profile Link - Icon on mobile, text on desktop */}
            <Link
              to="/profile"
              className="flex items-center gap-2 text-slate-600 hover:text-brand-accent transition-colors"
              title="Profile"
            >
              <span className="material-symbols-outlined text-2xl lg:text-lg">person</span>
              <span className="hidden md:inline text-sm font-bold uppercase tracking-widest">Profile</span>
            </Link>

            {/* Logout Button - Icon on mobile, text on desktop */}
            <button
              onClick={handleLogout}
              className="bg-primary text-white p-2 lg:px-6 lg:py-2 text-sm font-bold uppercase hover:bg-brand-accent transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              title="Logout"
            >
              <span className="material-symbols-outlined lg:hidden">logout</span>
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 lg:px-12 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="mb-8 lg:mb-12">
          <h1 className="font-motif text-3xl md:text-4xl lg:text-6xl mb-2">DASHBOARD</h1>
          <p className="text-slate-600 text-base lg:text-lg">Welcome back, <span className="font-bold text-primary">{data?.user.username}</span></p>
        </div>

        {/* Stats Grid - MOVED TO TOP */}
        <section className="mb-8 lg:mb-12">
          <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
            <div className="h-[2px] w-8 lg:w-12 bg-brand-accent"></div>
            <h2 className="font-motif text-xl lg:text-2xl uppercase">Quick Stats</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {/* Total Applications */}
            <div className="bg-white border-2 border-primary p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] lg:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <h3 className="font-bold uppercase tracking-widest text-xs lg:text-sm text-slate-500">Total (6m)</h3>
                <span className="material-symbols-outlined text-brand-accent text-lg lg:text-2xl">analytics</span>
              </div>
              <p className="font-motif text-2xl lg:text-4xl">{data?.stats.total_6_months}</p>
              <p className={`text-xs lg:text-sm font-bold mt-2 ${data?.stats.growth && data.stats.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data?.stats.growth && data.stats.growth > 0 ? '+' : ''}{data?.stats.growth}% <span className="text-slate-400 font-normal hidden lg:inline">vs last 3m</span>
              </p>
            </div>

            {/* Interviews */}
            <div className="bg-white border-2 border-primary p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] lg:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <h3 className="font-bold uppercase tracking-widest text-xs lg:text-sm text-slate-500">Interviews</h3>
                <span className="material-symbols-outlined text-blue-600 text-lg lg:text-2xl">group</span>
              </div>
              <p className="font-motif text-2xl lg:text-4xl">{data?.stats.status_counts.interview}</p>
              <p className="text-xs lg:text-sm text-slate-400 mt-2 hidden lg:block">Active processes</p>
            </div>

            {/* Offers */}
            <div className="bg-white border-2 border-primary p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] lg:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <h3 className="font-bold uppercase tracking-widest text-xs lg:text-sm text-slate-500">Offers</h3>
                <span className="material-symbols-outlined text-green-600 text-lg lg:text-2xl">verified</span>
              </div>
              <p className="font-motif text-2xl lg:text-4xl">{data?.stats.status_counts.offer}</p>
              <p className="text-xs lg:text-sm text-slate-400 mt-2 hidden lg:block">Congratulations!</p>
            </div>

            {/* Rejections */}
            <div className="bg-white border-2 border-primary p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] lg:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <h3 className="font-bold uppercase tracking-widest text-xs lg:text-sm text-slate-500">Rejected</h3>
                <span className="material-symbols-outlined text-red-500 text-lg lg:text-2xl">block</span>
              </div>
              <p className="font-motif text-2xl lg:text-4xl">{data?.stats.status_counts.rejected}</p>
              <p className="text-xs lg:text-sm text-slate-400 mt-2 hidden lg:block">Keep going!</p>
            </div>
          </div>
        </section>

        {/* Tools Section - MOVED BELOW STATS */}
        <section className="mb-8 lg:mb-12">
          <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
            <div className="h-[2px] w-8 lg:w-12 bg-brand-accent"></div>
            <h2 className="font-motif text-xl lg:text-2xl uppercase">Your Tools</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {tools.map((tool, index) => (
              <div
                key={index}
                onClick={() => tool.available && navigate(tool.link)}
                className={`bg-white border-2 border-primary p-4 lg:p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] lg:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-all ${tool.available
                  ? 'hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] lg:hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
                  }`}
              >
                <div className={`w-10 h-10 lg:w-12 lg:h-12 ${tool.color} flex items-center justify-center mb-3 lg:mb-4`}>
                  <span className="material-symbols-outlined text-white text-xl lg:text-2xl">{tool.icon}</span>
                </div>
                <h3 className="font-bold text-sm lg:text-lg mb-1 lg:mb-2">{tool.name}</h3>
                <p className="text-xs lg:text-sm text-slate-600 mb-2 lg:mb-4 hidden lg:block">{tool.description}</p>
                {!tool.available && (
                  <span className="inline-block px-2 lg:px-3 py-1 bg-slate-200 text-slate-600 text-[10px] lg:text-xs font-bold uppercase">
                    Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-brand-accent"></div>
            <h2 className="font-motif text-2xl uppercase flex items-center gap-2">
              <span className="material-symbols-outlined">history</span>
              Recent Applications
            </h2>
          </div>

          <div className="bg-white border-2 border-primary p-8 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
            {data?.recent_applications && data.recent_applications.length > 0 ? (
              <div className="space-y-4">
                {data.recent_applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border-2 border-slate-100 hover:border-primary/20 transition-colors bg-slate-50">
                    <div>
                      <h4 className="font-bold text-lg">{app.job_title}</h4>
                      <p className="text-slate-600">{app.company}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider mb-1 ${app.status === 'offer' ? 'bg-green-100 text-green-700' :
                        app.status === 'interview' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-slate-200 text-slate-700'
                        }`}>
                        {app.status}
                      </span>
                      <p className="text-xs text-slate-400">{app.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">inbox</span>
                <p className="text-slate-500 mb-4">No applications yet.</p>
                <button
                  onClick={() => navigate('/applications')}
                  className="text-brand-accent font-bold uppercase hover:underline"
                >
                  Start Applying
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
