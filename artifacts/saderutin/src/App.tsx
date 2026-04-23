import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { useProfile } from "@/hooks/useProfile";

import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import Onboarding from "@/pages/onboarding";
import Today from "@/pages/today";
import Habits from "@/pages/habits";
import HabitForm from "@/pages/habit-form";
import Routines from "@/pages/routines";
import RoutineForm from "@/pages/routine-form";
import Stats from "@/pages/stats";
import Pricing from "@/pages/pricing";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const APP_PATHS = ["/today", "/habits", "/routines", "/stats", "/settings"];

function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const showTabs = APP_PATHS.some(p => location === p || location.startsWith(p + "/"));
  return (
    <div className={`mx-auto w-full max-w-[480px] min-h-[100dvh] bg-background ${showTabs ? 'pb-24' : ''}`}>
      {children}
      {showTabs && <BottomTabs />}
    </div>
  );
}

function RootRedirect() {
  const { profile } = useProfile();
  const [, navigate] = useLocation();
  useEffect(() => {
    if (profile) navigate('/today');
  }, [profile, navigate]);
  return <Landing />;
}

function Routes() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      <Route path="/auth" component={Auth} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/today" component={Today} />
      <Route path="/habits" component={Habits} />
      <Route path="/habits/new" component={HabitForm} />
      <Route path="/habits/:id" component={HabitForm} />
      <Route path="/routines" component={Routines} />
      <Route path="/routines/new" component={RoutineForm} />
      <Route path="/routines/:id" component={RoutineForm} />
      <Route path="/stats" component={Stats} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Shell>
              <Routes />
            </Shell>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
