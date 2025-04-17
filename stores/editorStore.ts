import { create } from 'zustand';

interface EditorState {
  code: string;
  theme: 'light' | 'dark';
  output: string; // New: holds console output
  setCode: (code: string) => void;
  toggleTheme: () => void;
  setOutput: (output: string) => void; // New: updates output
}

export const useEditorStore = create<EditorState>((set) => {
  const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') as 'light' | 'dark' : 'dark';

  return {
    code: '// Write your JS here\nconsole.log("Hello, world!");',
    theme: savedTheme || 'dark',
    output: '', // Initialize empty
    setCode: (code) => set({ code }),
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', newTheme);
        }
        return { theme: newTheme };
      }),
    setOutput: (output) => set({ output }), // New function
  };
});