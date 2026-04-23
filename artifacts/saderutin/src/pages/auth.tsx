import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { setProfile, initDemo, getAppData } from '@/lib/storage';
import { Profile } from '@/lib/types';
import { getTodayStr } from '@/lib/dates';

export default function Auth() {
  const [, navigate] = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  useEffect(() => {
    document.title = 'Sign in — SadeRutin';
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1') {
      initDemo();
      navigate('/today');
    }
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const existing = getAppData().profile;
    const profile: Profile = {
      id: existing?.id ?? `local-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: existing?.createdAt ?? getTodayStr(),
      isDemo: false,
      adhdMode: existing?.adhdMode ?? false,
      reminderPrefs: existing?.reminderPrefs ?? { morning: true, midday: false, evening: true },
      theme: existing?.theme ?? 'system',
    };
    setProfile(profile);
    navigate(existing ? '/today' : '/onboarding');
  };

  const startDemo = () => {
    initDemo();
    navigate('/today');
  };

  return (
    <div className="mx-auto w-full max-w-[480px] min-h-[100dvh] bg-background px-5 pb-10 flex flex-col">
      <header className="pt-10 pb-8">
        <div className="text-sm font-medium text-primary tracking-wide">SadeRutin</div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{mode === 'signup' ? 'Create your space' : 'Welcome back'}</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Your account lives only on this device. No password required for the demo.</p>
      </header>

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium">Your name</label>
          <input id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full min-h-[48px] rounded-xl border border-border bg-card px-4 text-base focus:outline-none focus:ring-2 focus:ring-ring" placeholder="What should we call you?" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full min-h-[48px] rounded-xl border border-border bg-card px-4 text-base focus:outline-none focus:ring-2 focus:ring-ring" placeholder="you@example.com" />
        </div>
        <button type="submit" className="w-full min-h-[52px] rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
          {mode === 'signup' ? 'Create account' : 'Continue'}
        </button>
      </form>

      <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline">
        {mode === 'signup' ? 'I already have an account' : 'New here? Create one'}
      </button>

      <div className="my-8 flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-border" />
        <div className="text-xs text-muted-foreground">or</div>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button onClick={startDemo} className="w-full min-h-[52px] rounded-2xl border border-border bg-card font-medium hover:border-primary/50 transition-colors">
        Continue in demo mode
      </button>
      <p className="mt-3 text-xs text-muted-foreground text-center">Demo mode loads sample habits and routines so you can explore.</p>
    </div>
  );
}
