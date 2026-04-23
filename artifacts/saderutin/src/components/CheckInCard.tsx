import { useState, useEffect } from 'react';
import { useCheckIns } from '@/hooks/useCheckIns';
import { getTodayStr } from '@/lib/dates';
import { MoodPicker } from './MoodPicker';
import { EnergyPicker } from './EnergyPicker';
import { Check } from 'lucide-react';

export function CheckInCard() {
  const today = getTodayStr();
  const { getForDate, saveCheckIn } = useCheckIns();
  const existing = getForDate(today);
  const [mood, setMood] = useState<number | undefined>(existing?.mood);
  const [energy, setEnergy] = useState<number | undefined>(existing?.energy);
  const [note, setNote] = useState(existing?.note ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMood(existing?.mood);
    setEnergy(existing?.energy);
    setNote(existing?.note ?? '');
  }, [existing?.date]);

  const canSave = mood != null && energy != null;

  const onSave = () => {
    if (!canSave) return;
    saveCheckIn({ date: today, mood: mood!, energy: energy!, note: note.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 space-y-4" aria-labelledby="checkin-heading">
      <div>
        <h2 id="checkin-heading" className="font-semibold text-base">Daily check-in</h2>
        <p className="text-xs text-muted-foreground mt-0.5">A small note to yourself. Optional, always.</p>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">How are you feeling?</div>
        <MoodPicker value={mood} onChange={setMood} />
      </div>
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Energy</div>
        <EnergyPicker value={energy} onChange={setEnergy} />
      </div>
      <div className="space-y-2">
        <label htmlFor="checkin-note" className="text-xs font-medium text-muted-foreground">A line about today (optional)</label>
        <textarea
          id="checkin-note"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          maxLength={240}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Anything on your mind?"
        />
      </div>
      <button
        onClick={onSave}
        disabled={!canSave}
        className="w-full min-h-[48px] rounded-xl bg-primary text-primary-foreground font-medium transition-opacity disabled:opacity-50 hover:opacity-90 flex items-center justify-center gap-2"
      >
        {saved ? (<><Check className="h-4 w-4" /> Saved</>) : (existing ? 'Update check-in' : 'Save check-in')}
      </button>
    </section>
  );
}
