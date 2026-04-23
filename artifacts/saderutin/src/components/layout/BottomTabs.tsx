import { Link } from 'wouter';
import { Home, ListChecks, Calendar, BarChart2, Settings } from 'lucide-react';
import { useLocation } from 'wouter';

export function BottomTabs() {
  const [location] = useLocation();

  const tabs = [
    { href: '/today', icon: Home, label: 'Today' },
    { href: '/habits', icon: ListChecks, label: 'Habits' },
    { href: '/routines', icon: Calendar, label: 'Routines' },
    { href: '/stats', icon: BarChart2, label: 'Stats' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border pb-safe">
      <div className="mx-auto flex h-16 max-w-[480px] items-center justify-around px-4">
        {tabs.map((tab) => {
          const isActive = location.startsWith(tab.href);
          return (
            <Link key={tab.href} href={tab.href} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
