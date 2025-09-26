import React, { useState } from 'react';
import { UserIcon, PaletteIcon, StarIcon, ChevronRightIcon, ChevronLeftIcon, SunIcon, MoonIcon, SmallCheckIcon } from '../components/Icons';
import type { Theme } from '../types';

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
      <header className="p-6 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 mr-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="Go back">
            <ChevronLeftIcon />
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Profile</h1>
      </header>
      <div className="p-6 pt-0">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a new password"
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/40 text-slate-900 dark:text-white backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition placeholder:text-slate-500 dark:placeholder:text-slate-400"
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
    </div>
  )
};

const AppearanceSettings: React.FC<{ onBack: () => void; theme: Theme; setTheme: (theme: Theme) => void; }> = ({ onBack, theme, setTheme }) => {
  return (
    <div className="content-fade-in-active">
      <header className="p-6 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 mr-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="Go back">
            <ChevronLeftIcon />
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Appearance</h1>
      </header>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Theme</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${theme === 'light' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-300 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-700/50 hover:border-cyan-400'}`}
            >
              <SunIcon />
              <span className="mt-2 font-medium text-slate-800 dark:text-slate-200">Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${theme === 'dark' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-300 dark:border-slate-700 bg-slate-200/50 dark:bg-slate-700/50 hover:border-cyan-400'}`}
            >
              <MoonIcon />
              <span className="mt-2 font-medium text-slate-800 dark:text-slate-200">Dark</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const plans = [
    {
      id: 'free',
      name: 'Zenith Free',
      price: '$0',
      description: 'For individuals starting out.',
      features: ['Unlimited tasks', 'Unlimited Analytics'],
    },
    {
      id: 'plus',
      name: 'Zenith Plus',
      price: '$4.99/mo',
      description: 'For power users and small teams.',
      features: ['Unlimited tasks', 'Advanced analytics', 'Graph customization', 'Priority email support'],
    },
    {
      id: 'pro',
      name: 'Zenith Pro',
      price: '$9.99/mo',
      description: 'For professionals who need it all.',
      features: ['All Plus features', 'AI task suggestions', 'Cloud sync & backup', 'Premium themes'],
    },
];

const PlanCard: React.FC<{
    plan: typeof plans[0];
    isCurrent: boolean;
}> = ({ plan, isCurrent }) => {
    const isPro = plan.id === 'pro';
    const cardClasses = isCurrent
        ? `bg-gradient-to-br from-cyan-500 to-cyan-700 text-white shadow-xl shadow-cyan-500/30`
        : `bg-white/50 dark:bg-slate-800/40 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-lg shadow-black/20`;

    const buttonClasses = isCurrent
        ? `w-full mt-8 bg-white text-cyan-600 font-bold py-3 px-4 rounded-lg transition-colors cursor-default`
        : `w-full mt-8 bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed`;
    
    return (
        <div className={`p-6 rounded-2xl flex flex-col ${cardClasses}`}>
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <p className={isCurrent ? 'mt-1 text-cyan-100' : 'mt-1 text-slate-500 dark:text-slate-400'}>{plan.description}</p>
            <div className="my-6 text-4xl font-extrabold">
                {plan.price}
            </div>
            <ul className={`space-y-3 border-t pt-6 flex-grow ${isCurrent ? 'border-white/20' : 'border-slate-200 dark:border-slate-700'}`}>
                {plan.features.map(feature => (
                    <li key={feature} className="flex items-center">
                        <span className="w-5 h-5 mr-3"><SmallCheckIcon /></span>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button disabled={!isCurrent} className={buttonClasses}>
                {isCurrent ? 'Your Current Plan' : 'Select Plan'}
            </button>
        </div>
    )
}

const PlanSettings: React.FC<{ onBack: () => void; hasPlan: boolean }> = ({ onBack, hasPlan }) => {
    const [view, setView] = useState<'current' | 'explore'>('current');
    const currentPlanId = hasPlan ? 'pro' : 'free';
    
    if (view === 'explore') {
        return (
            <div className="content-fade-in-active">
                <header className="p-6 flex items-center">
                    <button onClick={() => setView('current')} className="p-2 -ml-2 mr-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="Go back">
                        <ChevronLeftIcon />
                    </button>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Explore Plans</h1>
                </header>
                <div className="p-6 pt-0 space-y-6">
                    {plans.map(plan => (
                        <PlanCard key={plan.id} plan={plan} isCurrent={plan.id === currentPlanId} />
                    ))}
                </div>
            </div>
        )
    }

    return (
      <div className="content-fade-in-active">
        <header className="p-6 flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 mr-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="Go back">
                <ChevronLeftIcon />
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your Plan</h1>
        </header>
        <div className="p-6 pt-0">
            {hasPlan ? (
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl p-6 text-white shadow-xl shadow-cyan-500/30">
                    <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold">Zenith Pro</h3>
                    <span className="bg-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full">Active</span>
                    </div>
                    <p className="mt-2 text-cyan-100">You have access to all premium features.</p>
                    
                    <ul className="mt-6 space-y-3 text-cyan-50 border-t border-white/20 pt-6">
                    <li className="flex items-center">
                        <span className="w-5 h-5 mr-3"><SmallCheckIcon /></span>
                        <span>Unlimited Task Creation</span>
                    </li>
                    <li className="flex items-center">
                        <span className="w-5 h-5 mr-3"><SmallCheckIcon /></span>
                        <span>Advanced Analytics & Tracking</span>
                    </li>
                    <li className="flex items-center">
                        <span className="w-5 h-5 mr-3"><SmallCheckIcon /></span>
                        <span>Priority Support</span>
                    </li>
                    </ul>
            
                    <button 
                        onClick={() => setView('explore')}
                        className="w-full mt-8 bg-white text-cyan-600 font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Manage Subscription
                    </button>
                </div>
            ) : (
                <div className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 text-center border border-slate-200 dark:border-white/10 shadow-lg shadow-black/20">
                    <StarIcon className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4">No Active Plan</h3>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      You are currently on the free plan. Upgrade to unlock premium features.
                    </p>
                    <button 
                      onClick={() => setView('explore')}
                      className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      Explore Plans
                    </button>
                  </div>
            )}
        </div>
      </div>
    );
};

interface SettingsPageProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, setTheme }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('main');
  const [hasPlan, setHasPlan] = useState<boolean>(false); // Simulate user having no plan

  const renderContent = () => {
    switch (activeSection) {
        case 'profile':
            return <ProfileSettings onBack={() => setActiveSection('main')} />;
        case 'appearance':
            return <AppearanceSettings onBack={() => setActiveSection('main')} theme={theme} setTheme={setTheme} />;
        case 'plan':
            return <PlanSettings onBack={() => setActiveSection('main')} hasPlan={hasPlan} />;
        default:
            return (
                <div className="content-fade-in-active">
                    <header className="p-6 text-center">
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and preferences.</p>
                    </header>
                    <div className="p-6 pt-0">
                        <div className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl shadow-black/25 overflow-hidden">
                            <ul className="divide-y divide-slate-200 dark:divide-slate-700/50">
                                {settingsItems.map((item) => (
                                <li key={item.label}>
                                    <button
                                        onClick={() => setActiveSection(item.id as SettingsSection)}
                                        className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-slate-200/60 dark:hover:bg-slate-700/50 focus:outline-none focus:bg-slate-200/70 dark:focus:bg-slate-700/60"
                                        aria-label={`Open ${item.label} settings`}
                                    >
                                    <div className="flex items-center">
                                        <div className="text-cyan-500 dark:text-cyan-400">{item.icon}</div>
                                        <div className="ml-4">
                                        <p className="font-bold text-slate-900 dark:text-white text-lg">{item.label}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRightIcon />
                                    </button>
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            );
    }
  };

  return (
    <div>
      <div className="w-full max-w-md mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsPage;