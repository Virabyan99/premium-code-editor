'use client';

import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useEditorStore } from '@/stores/editorStore';
import {
  lineNumbers,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLineGutter,
  keymap,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import {
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
  syntaxHighlighting,
  defaultHighlightStyle,
} from '@codemirror/language';
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from '@codemirror/autocomplete';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { lintKeymap } from '@codemirror/lint';

export function Editor() {
  const code = useEditorStore((state) => state.code);
  const setCode = useEditorStore((state) => state.setCode);
  const theme = useEditorStore((state) => state.theme);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true only after the component mounts on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const MAX_CODE_LENGTH = 10000;

  const handleChange = (value: string) => {
    if (value.length > MAX_CODE_LENGTH) {
      alert('Code exceeds maximum length of 10,000 characters.');
      return;
    }
    setCode(value);
  };

  const extensions = [
    lineNumbers(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    highlightSelectionMatches(),
    foldGutter(),
    javascript(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ]),
  ];

  // Render nothing (or a placeholder) until the component mounts
  if (!isMounted) {
    return <div>Loading editor...</div>; // Optional: Replace with a loading spinner or null
  }

  return (
    <div className="h-full overflow-auto">
      <CodeMirror
        value={code}
        height="100%"
        extensions={extensions}
        theme={theme}
        onChange={handleChange}
      />
    </div>
  );
}