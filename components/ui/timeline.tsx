import React from 'react';
import { cn } from '@/lib/utils';

interface TimelineProps {
  children: React.ReactNode;
  className?: string;
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {children}
    </div>
  );
}

const TimelineItemContext = React.createContext<{ variant: 'default' | 'event' }>({
  variant: 'default',
});

export function TimelineItem({ children, className, variant = 'default' }: { children: React.ReactNode; className?: string; variant?: 'default' | 'event' }) {
  return (
    <TimelineItemContext.Provider value={{ variant }}>
      <div className={cn("flex items-start", className)}>
        {children}
      </div>
    </TimelineItemContext.Provider>
  );
}

export function TimelineConnector({ children, className }: { children?: React.ReactNode; className?: string }) {
  const { variant } = React.useContext(TimelineItemContext);
  return (
    <div className={cn("flex flex-col items-center self-stretch", className)}>
      <div className={cn("flex-grow border-l-2 border-dashed", {
        "border-primary": variant === 'event',
        "border-border": variant === 'default',
      })} />
      {children}
      <div className={cn("flex-grow border-l-2 border-dashed", {
        "border-primary": variant === 'event',
        "border-border": variant === 'default',
      })} />
    </div>
  );
}

export function TimelineHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {children}
    </div>
  );
}

export function TimelineIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  const { variant } = React.useContext(TimelineItemContext);
  return (
    <div className={cn("flex items-center justify-center w-10 h-10 rounded-full", {
      "bg-primary text-primary-foreground": variant === 'event',
      "bg-muted": variant === 'default',
    }, className)}>
      {children}
    </div>
  );
}

export function TimelineTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("font-semibold", className)}>{children}</h3>;
}

export function TimelineDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function TimelineContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex-1 pt-1", className)}>{children}</div>;
}

export function TimelineTime({ children, className }: { children: React.ReactNode; className?: string }) {
  return <time className={cn("text-xs text-muted-foreground", className)}>{children}</time>;
}