"use client";
import { useEditorStore } from '@/stores/editorStore';
import { useEffect } from 'react';
import { Button } from './ui/button';

export function ConsoleOutput() {
  const output = useEditorStore((state) => state.output);
  const setOutput = useEditorStore((state) => state.setOutput);

  useEffect(() => {
    console.log('ConsoleOutput: output updated to', output);
  }, [output]);

  const lines = output
    .trim()
    .split('\n')
    .map((line) => {
      const match = line.match(/\[(\w+)]\s?(.*)/);
      console.log('Parsing line:', line, 'match:', match);
      return {
        type: match ? match[1] : 'log',
        content: match ? match[2] : line,
      };
    });

  return (
    <div className="p-4 bg-gray-100 text-sm font-mono h-full overflow-auto whitespace-pre-wrap space-y-1">
      <div className="flex justify-end mb-2">
        <Button variant="outline" size="sm" onClick={() => setOutput('')}>
          Clear Console
        </Button>
      </div>
      {lines.map((line, index) => (
        <div
          key={index}
          className={line.type === 'error' ? 'text-red-500' : 'text-black'}
        >
          {line.content}
        </div>
      ))}
    </div>
  );
}