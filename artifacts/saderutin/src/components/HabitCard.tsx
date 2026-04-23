import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type HabitCardProps = {
  name: string;
  description?: string;
  color: string;
  completed: boolean;
  onToggle: () => void;
  minimumVersion?: string;
  isLowEnergyMode?: boolean;
};

export function HabitCard({ name, description, color, completed, onToggle, minimumVersion, isLowEnergyMode }: HabitCardProps) {
  const displayTitle = isLowEnergyMode && minimumVersion ? minimumVersion : name;
  const isMinimum = isLowEnergyMode && minimumVersion;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${completed ? 'bg-secondary border-secondary' : 'bg-card border-border hover:border-primary/50'}`}
      style={{
        boxShadow: completed ? 'none' : 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-center gap-4">
        <div 
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 text-transparent'}`}
          style={!completed ? { borderColor: color } : undefined}
        >
          <Check className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-lg leading-tight truncate transition-colors ${completed ? 'text-muted-foreground line-through decoration-muted-foreground/50' : 'text-foreground'}`}>
            {displayTitle}
          </h3>
          {description && !isMinimum && (
            <p className={`text-sm mt-1 truncate transition-colors ${completed ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
              {description}
            </p>
          )}
          {isMinimum && (
            <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded-full">
              Minimum version
            </span>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {completed && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 text-sm text-primary font-medium text-center"
          >
            Nice. That counts.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
