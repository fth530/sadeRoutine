import { useProfile } from '@/hooks/useProfile';
import { updateProfile, exportAll, wipeAll } from '@/lib/storage';
import { AppHeader } from '@/components/layout/AppHeader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Download, Trash2, LogOut, Receipt } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Settings() {
  const { profile } = useProfile();
  const [, navigate] = useLocation();

  if (!profile) return null;

  const onDelete = () => {
    if (confirm('This will erase all SadeRutin data on this device. Continue?')) {
      wipeAll();
      navigate('/');
    }
  };

  return (
    <div>
      <AppHeader title="Settings" subtitle="Quiet, sensible defaults. Tweak anything." />

      <div className="px-5 pb-8 space-y-6">
        <Section title="Profile">
          <Row label="Name">
            <input value={profile.name} onChange={e => updateProfile({ name: e.target.value })} className="w-44 min-h-[40px] rounded-lg border border-border bg-background px-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-ring" />
          </Row>
          <Row label="Email">
            <input value={profile.email} onChange={e => updateProfile({ email: e.target.value })} className="w-44 min-h-[40px] rounded-lg border border-border bg-background px-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-ring" />
          </Row>
          <Row label="Mode">
            <span className="text-sm text-muted-foreground">{profile.isDemo ? 'Demo (local only)' : 'Local account'}</span>
          </Row>
        </Section>

        <Section title="Calm preferences">
          <Toggle label="ADHD mode" hint="Reduces clutter and softens nudges." checked={profile.adhdMode} onChange={v => updateProfile({ adhdMode: v })} />
          <Row label="Theme"><ThemeToggle /></Row>
          <Toggle label="Morning nudge" checked={profile.reminderPrefs.morning} onChange={v => updateProfile({ reminderPrefs: { ...profile.reminderPrefs, morning: v } })} />
          <Toggle label="Midday nudge" checked={profile.reminderPrefs.midday} onChange={v => updateProfile({ reminderPrefs: { ...profile.reminderPrefs, midday: v } })} />
          <Toggle label="Evening nudge" checked={profile.reminderPrefs.evening} onChange={v => updateProfile({ reminderPrefs: { ...profile.reminderPrefs, evening: v } })} />
        </Section>

        <Section title="Your data">
          <p className="text-xs text-muted-foreground mb-2">Your data lives only on this device. We don't have a copy.</p>
          <button onClick={exportAll} className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-xl border border-border bg-card font-medium hover:border-primary/40 transition-colors">
            <Download className="h-4 w-4" /> Export as JSON
          </button>
          <button onClick={onDelete} className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-xl border border-border text-destructive font-medium hover:border-destructive/40 transition-colors">
            <Trash2 className="h-4 w-4" /> Delete all my data
          </button>
        </Section>

        <Section title="Billing">
          <div className="rounded-xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 text-foreground font-medium"><Receipt className="h-4 w-4" /> Billing is not active yet</div>
            <p>When it is, you'll see clear charges and an easy cancel button here. No surprise fees.</p>
          </div>
        </Section>

        <button onClick={() => { wipeAll(); navigate('/'); }} className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] rounded-xl text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="h-4 w-4" /> Sign out
        </button>

        <p className="text-center text-xs text-muted-foreground">SadeRutin · made with care</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
        {Array.isArray(children) ? children.map((c, i) => <div key={i}>{c}</div>) : children}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 min-h-[56px]">
      <div className="text-sm font-medium">{label}</div>
      {children}
    </div>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} aria-pressed={checked} className="w-full flex items-center justify-between gap-3 px-4 py-3 min-h-[56px] text-left">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <div className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}>
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
    </button>
  );
}
