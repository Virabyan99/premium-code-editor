'use client';

import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/stores/editorStore';
import { executeCode } from '@/lib/workerClient';
import { useState } from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const code = useEditorStore((state) => state.code);
  const setOutput = useEditorStore((state) => state.setOutput);
  const toggleTheme = useEditorStore((state) => state.toggleTheme);
  const [isRunning, setIsRunning] = useState(false);

  const run = async () => {
    setIsRunning(true);
    try {
      await executeCode(code, (msg) => {
        setOutput(msg.data);
        console.log('AppShell: Set output to', msg.data); // Add this
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <header className="flex justify-between items-center px-4 py-2 border-b bg-background">
        <div className="space-x-2">
          <Button onClick={run} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
        <Button variant="link" onClick={toggleTheme}>
          Toggle Theme
        </Button>
      </header>
      <main className="grid grid-cols-2 divide-x overflow-hidden">{children}</main>
    </div>
  );
}