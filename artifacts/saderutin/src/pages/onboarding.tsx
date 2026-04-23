import { useState } from 'react';
import { useLocation } from 'wouter';
import { ProgressDots } from '@/components/ProgressDots';
import { useProfile } from '@/hooks/useProfile';
import { updateProfile, getAppData, saveAppData } from '@/lib/storage';
import { SEED_HABITS, SEED_ROUTINES } from '@/lib/seed';
import { ArrowRight } from 'lucide-react';

const STEPS = ['goal', 'energy', 'reminders', 'adhd'] as const;

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { profile } = useProfile();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [energy, setEnergy] = useState(3);
  const [reminders, setReminders] = useState({ morning: true, midday: false, evening: true });
  const [adhdMode, setAdhdMode] = useState(true);

  if (!profile) {
    navigate('/auth');
    return null;
  }

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else finish();
  };

  const finish = () => {
    updateProfile({ adhdMode, reminderPrefs: reminders });
    const data = getAppData();
    if (data.habits.length === 0) {
      saveAppData({ ...data, habits: SEED_HABITS, routines: SEED_ROUTINES });
    }
    navigate('/today');
  };

  return (
    <div className="mx-auto w-full max-w-[480px] min-h-[100dvh] bg-background px-5 pb-10 flex flex-col">
      <header className="pt-10 pb-6">
        <ProgressDots total={STEPS.length} current={step} />
      </header>

      <main className="flex-1">
        {step === 0 && (
          <Step title="What brings you here?" subtitle="Pick or write something small. You can change it anytime.">
            <div className="space-y-2">
              {['Build a gentle morning', 'Wind down better at night', 'Add structure on hard days', 'Just try things and see'].map(opt => (
                <button key={opt} onClick={() => setGoal(opt)} className={`w-full text-left rounded-xl border px-4 py-3 min-h-[52px] transition-colors ${goal === opt ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'}`}>
                  {opt}
                </button>
              ))}
              <input value={goal && !['Build a gentle morning','Wind down better at night','Add structure on hard days','Just try things and see'].includes(goal) ? goal : ''} onChange={e => setGoal(e.target.value)} placeholder="Or type your own…" className="mt-2 w-full min-h-[48px] rounded-xl border border-border bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step title="How is your energy lately?" subtitle="No wrong answers. We'll start small either way.">
            <div className="grid grid-cols-5 gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setEnergy(n)} className={`min-h-[64px] rounded-xl border text-base font-medium transition-colors ${energy === n ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border'}`}>{n}</button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">1 = depleted · 5 = thriving</p>
          </Step>
        )}

        {step === 2 && (
          <Step title="When should we softly remind you?" subtitle="You can turn these off later.">
            <div className="space-y-2">
              {(['morning','midday','evening'] as const).map(slot => (
                <label key={slot} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-4 min-h-[60px]">
                  <span className="capitalize font-medium">{slot}</span>
                  <input type="checkbox" checked={reminders[slot]} onChange={e => setReminders({ ...reminders, [slot]: e.target.checked })} className="h-5 w-5 accent-current text-primary" />
                </label>
              ))}
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="ADHD mode?" subtitle="Reduces visual clutter, simplifies the dashboard, and softens nudges. You can toggle it anytime.">
            <div className="space-y-2">
              <button onClick={() => setAdhdMode(true)} className={`w-full text-left rounded-xl border p-4 transition-colors ${adhdMode ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
                <div className="font-medium">Yes, please turn it on</div>
                <div className="text-xs text-muted-foreground mt-0.5">Calmer, simpler interface.</div>
              </button>
              <button onClick={() => setAdhdMode(false)} className={`w-full text-left rounded-xl border p-4 transition-colors ${!adhdMode ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
                <div className="font-medium">Not right now</div>
                <div className="text-xs text-muted-foreground mt-0.5">Show me everything.</div>
              </button>
            </div>
          </Step>
        )}
      </main>

      <footer className="pt-6 flex items-center justify-between gap-3">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate('/today')} className="text-sm text-muted-foreground min-h-[48px] px-4">
          {step === 0 ? 'Skip for now' : 'Back'}
        </button>
        <button onClick={next} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 min-h-[52px] text-base font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          {step === STEPS.length - 1 ? 'Finish' : 'Continue'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </footer>
    </div>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
