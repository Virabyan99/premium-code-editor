// components/AppShell.tsx
import { Button } from '@/components/ui/button';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <header className="flex justify-between items-center px-4 py-2 border-b bg-background">
        <div className="space-x-2">
          <Button disabled>Run</Button>
        </div>
        <Button variant="link" disabled>
          Toggle Theme
        </Button>
      </header>
      <main className="grid grid-cols-2 divide-x overflow-hidden">{children}</main>
    </div>
  );
}