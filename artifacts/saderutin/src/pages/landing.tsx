import { Link, useLocation } from 'wouter';
import { useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { ListChecks, BatteryLow, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Landing() {
  const { profile } = useProfile();
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = 'SadeRutin — calm, ADHD-friendly habit tracker and routine app';
    if (profile) navigate('/today');
  }, [profile, navigate]);

  return (
    <div className="mx-auto w-full max-w-[480px] min-h-[100dvh] bg-background px-5 pb-16">
      <header className="pt-10 pb-6">
        <div className="text-sm font-medium text-primary tracking-wide">SadeRutin</div>
      </header>

      <section className="space-y-5">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight">
          A calm habit tracker and routine app, made for ADHD brains.
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          SadeRutin helps you build gentle daily habits and flexible routines without streak shaming, dark patterns, or noisy nudges. Low-energy days are first-class.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <Link href="/auth" className="inline-flex items-center justify-center gap-2 min-h-[52px] rounded-2xl bg-primary px-6 text-base font-medium text-primary-foreground hover:opacity-90 transition-opacity">
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/auth?demo=1" className="inline-flex items-center justify-center min-h-[52px] rounded-2xl border border-border bg-card px-6 text-base font-medium text-foreground hover:border-primary/50 transition-colors">
            Try the demo
          </Link>
        </div>
      </section>

      <section className="mt-14 space-y-4" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Why SadeRutin</h2>
        <Feature Icon={ListChecks} title="Habits and routines, together" body="Track simple habits, then weave them into flexible morning, focus, or wind-down routines." />
        <Feature Icon={BatteryLow} title="Low-energy mode" body="One tap swaps your routine for its minimum version. Doing the small thing still counts." />
        <Feature Icon={Sparkles} title="No streak shaming" body="Gentle, supportive copy. We celebrate showing up — not punishing missed days." />
        <Feature Icon={ShieldCheck} title="Your data stays yours" body="Works offline as a PWA. Export anytime. No tracking, no upsell traps." />
      </section>

      <section className="mt-14 rounded-2xl border border-border bg-card p-5" aria-labelledby="pricing-teaser">
        <h2 id="pricing-teaser" className="font-semibold">Transparent pricing</h2>
        <p className="text-sm text-muted-foreground mt-1">Everything in the MVP is free, forever. An optional Supporter tier helps fund development — no features are paywalled.</p>
        <Link href="/pricing" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          See pricing <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      <footer className="mt-14 text-xs text-muted-foreground space-y-2">
        <p>SadeRutin — a quiet companion for habits, routines, and ADHD-friendly days.</p>
        <p>Habit tracker · routine app · ADHD friendly habit tracker</p>
      </footer>
    </div>
  );
}

function Feature({ Icon, title, body }: { Icon: typeof ListChecks; title: string; body: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
      </div>
    </div>
  );
}
