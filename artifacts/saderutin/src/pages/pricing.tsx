import { Link } from 'wouter';
import { ArrowLeft, Check } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Pricing() {
  const [, navigate] = useLocation();
  return (
    <div>
      <header className="px-5 pt-8 pb-4 flex items-center gap-3">
        <button onClick={() => history.length > 1 ? history.back() : navigate('/')} className="h-10 w-10 inline-flex items-center justify-center rounded-full hover-elevate" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold">Pricing</h1>
      </header>

      <div className="px-5 pb-10 space-y-5">
        <p className="text-sm text-muted-foreground">No features are paywalled. The Supporter tier is optional and exists only to fund development. You can switch tiers, cancel, or export your data at any time.</p>

        <Tier name="Free" price="$0" tagline="Forever. Really." features={[
          'Unlimited habits and routines',
          'Daily check-ins, low-energy mode, ADHD mode',
          'Stats and exports',
          'Offline-first PWA',
        ]} primary />

        <Tier name="Supporter" price="$4 / month" tagline="Pay-what-helps. No locked features." features={[
          'Everything in Free',
          'Supports development and hosting',
          'Optional supporter badge in your settings',
          'Cancel anytime, no questions',
        ]} />

        <section className="rounded-2xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground space-y-2">
          <h2 className="font-medium text-foreground">Our promise</h2>
          <ul className="space-y-1.5">
            <li>· No upsell modals, no countdown timers, no "limited offer" pressure.</li>
            <li>· No selling your data. Ever.</li>
            <li>· Clear, plain-language billing. No surprise charges.</li>
          </ul>
        </section>

        <Link href="/auth" className="block w-full text-center min-h-[52px] rounded-2xl bg-primary text-primary-foreground font-medium leading-[52px] hover:opacity-90">Get started free</Link>
      </div>
    </div>
  );
}

function Tier({ name, price, tagline, features, primary }: { name: string; price: string; tagline: string; features: string[]; primary?: boolean }) {
  return (
    <section className={`rounded-2xl border p-5 ${primary ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="text-base font-semibold">{price}</div>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{tagline}</p>
      <ul className="mt-4 space-y-2">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
