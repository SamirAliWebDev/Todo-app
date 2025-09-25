import React, { useState } from 'react';
import { UserIcon, PaletteIcon, StarIcon, ChevronRightIcon, ChevronLeftIcon } from '../components/Icons';

type SettingsSection = 'main' | 'profile' | 'appearance' | 'plan';

const settingsItems = [
  {
    id: 'profile',
    icon: <UserIcon />,
    label: 'Profile',
    description: 'Manage your personal information',
  },
  {
    id: 'appearance',
    icon: <PaletteIcon />,
    label: 'Appearance',
    description: 'Customize the look and feel',
  },
  {
    id: 'plan',
    icon: <StarIcon />,
    label: 'Plan',
    description: 'View your current subscription',
  },
];

const ProfileSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle the save logic here.
    console.log('Saving profile:', { email, password });
    onBack();
  };

  return (
    <div className="content-fade-in-active">
      <header className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 mr-2 text-slate-400 hover:text-white transition-colors" aria-label="Go back to settings">
            <ChevronLeftIcon />
        </button>
        <h2 className="text-3xl font-extrabold text-white">Profile Settings</h2>
      </header>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 bg-slate-800/40 text-white backdrop-blur-sm border border-slate-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition placeholder:text-slate-400"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a new password"
            className="w-full px-4 py-3 bg-slate-800/40 text-white backdrop-blur-sm border border-slate-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition placeholder:text-slate-400"
          />
        </div>
        <div className="pt-2">
            <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-cyan-500/30"
            >
                Save Changes
            </button>
        </div>
      </form>
    </div>
  )
};

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('main');

  const renderContent = () => {
    switch (activeSection) {
        case 'profile':
            return <ProfileSettings onBack={() => setActiveSection('main')} />;
        // Add cases for 'appearance' and 'plan' here in the future
        default:
            return (
                <div className="content-fade-in-active">
                    <header className="text-center w-full mb-12">
                        <h1 className="text-5xl font-extrabold text-white">Settings</h1>
                        <p className="text-slate-400 mt-2">Manage your account and preferences.</p>
                    </header>
                    <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl shadow-black/25 overflow-hidden">
                        <ul className="divide-y divide-slate-700/50">
                            {settingsItems.map((item) => (
                            <li key={item.label}>
                                <button
                                    onClick={() => setActiveSection(item.id as SettingsSection)}
                                    className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-slate-700/50 focus:outline-none focus:bg-slate-700/60"
                                    aria-label={`Open ${item.label} settings`}
                                >
                                <div className="flex items-center">
                                    <div className="text-cyan-400">{item.icon}</div>
                                    <div className="ml-4">
                                    <p className="font-bold text-white text-lg">{item.label}</p>
                                    <p className="text-sm text-slate-400">{item.description}</p>
                                    </div>
                                </div>
                                <ChevronRightIcon />
                                </button>
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 p-6">
      <div className="w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsPage;