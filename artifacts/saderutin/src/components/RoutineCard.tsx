import { Routine } from '@/lib/types';
import { Clock } from 'lucide-react';
import { Link } from 'wouter';

export function RoutineCard({ routine }: { routine: Routine }) {
  const totalMinutes = routine.steps.reduce((acc, step) => acc + step.minutes, 0);

  return (
    <Link href={`/routines/${routine.id}`} className="block w-full p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-foreground">{routine.name}</h3>
        {routine.timeOfDay && (
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full capitalize">
            {routine.timeOfDay}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Clock className="w-4 h-4" />
        <span>~{totalMinutes} min</span>
        <span className="mx-1">•</span>
        <span>{routine.steps.length} steps</span>
      </div>

      <div className="space-y-2">
        {routine.steps.slice(0, 3).map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
            <span className="truncate text-foreground/80">{step.name}</span>
          </div>
        ))}
        {routine.steps.length > 3 && (
          <div className="text-xs text-muted-foreground pl-3.5">
            + {routine.steps.length - 3} more steps
          </div>
        )}
      </div>
    </Link>
  );
}
