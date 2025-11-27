import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { html as beautifyHtml } from 'js-beautify';
import { marked } from 'marked';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import TurndownService from 'turndown';

import { cn } from '../lib/utils';

// Custom theme for adding padding and styling to the editor
const theme = EditorView.theme({
  '.cm-scroller': {
    display: 'flex',
    justifyContent: 'center',
  },
  '.cm-content': {
    maxWidth: '100ch',
    padding: '0.5rem 1rem',
    fontFamily: '"JetBrains Mono", monospace',
    lineHeight: '1.8',
  },
  '.cm-gutters': {
    paddingRight: '0.5rem',
    fontFamily: '"JetBrains Mono", monospace',
  },
  '.cm-line': {
    lineHeight: '1.8',
  },
  '&.cm-focused': {
    outline: 'none !important',
  },
});

interface MarkdownEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  textarea: HTMLTextAreaElement;
}

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Custom rule to ensure proper list formatting
turndownService.addRule('listItem', {
  filter: 'li',
  replacement: function (content, node, options) {
    content = content
      .replace(/^\n+/, '')
      .replace(/\n+$/, '\n')
      .replace(/\n/gm, '\n    ');

    let prefix = (options.bulletListMarker ?? '-') + ' ';
    const parent = node.parentNode as HTMLElement | null;
    if (parent && parent.nodeName === 'OL') {
      const start = parent.getAttribute('start');
      const index = Array.prototype.indexOf.call(parent.children, node);
      prefix = String(start ? Number(start) + index : index + 1) + '. ';
    }

    return (
      prefix +
      content +
      (node.nextSibling && !content.endsWith('\n') ? '\n' : '')
    );
  },
});

export function MarkdownEditorModal({
  isOpen,
  onClose,
  textarea,
}: MarkdownEditorModalProps) {
  const [initialMarkdown, setInitialMarkdown] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef(textarea);
  const isInitialized = useRef(false);
  const editorKey = useRef(Math.random().toString(36));

  // Always keep textarea ref up to date
  textareaRef.current = textarea;

  // Convert HTML to Markdown ONLY when modal first opens (not on re-renders)
  useEffect(() => {
    if (isOpen && !isInitialized.current) {
      let htmlContent = textareaRef.current.value || '';
      try {
        // Convert plain text newlines to <br> tags so they're preserved
        // First, handle double newlines (empty lines) to preserve paragraph breaks
        htmlContent = htmlContent.replace(/\n\n+/g, (match) => {
          return '<br>'.repeat(match.length);
        });
        // Then handle single newlines between content
        htmlContent = htmlContent.replace(/([^>])\n([^<])/g, '$1<br>\n$2');

        let markdown = turndownService.turndown(htmlContent);

        // Clean up trailing whitespaces at the end of lines
        markdown = markdown.replace(/ +$/gm, '');

        setInitialMarkdown(markdown);
      } catch (error) {
        console.error('Error converting HTML to Markdown:', error);
        setInitialMarkdown(htmlContent);
      }
      isInitialized.current = true;
    }

    // Reset when modal closes completely
    if (!isOpen && isInitialized.current) {
      isInitialized.current = false;
      // Generate new key for next open to force fresh editor instance
      editorKey.current = Math.random().toString(36);
    }
  }, [isOpen]);

  // Sync markdown changes back to textarea as HTML (but don't update state to avoid cursor reset)
  const handleMarkdownChange = useCallback((value: string) => {
    // DON'T call setMarkdownContent here - it would cause CodeMirror to reset
    try {
      let html = marked.parse(value, {
        async: false,
        gfm: true,
        breaks: true,
      });

      // Decode HTML entities (e.g., &amp; -> &, &lt; -> <)
      const textarea = document.createElement('textarea');
      textarea.innerHTML = html;
      html = textarea.value;

      // Fix inline nested lists by adding newlines before nested ul/ol tags
      html = html.replace(/([^\n])(<[uo]l>)/g, '$1\n$2');
      html = html.replace(/(<\/[uo]l>)([^\n])/g, '$1\n$2');

      // Pretty-print the HTML with nice indentation
      const prettyHtml = beautifyHtml(html, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 1,
        preserve_newlines: true,
        end_with_newline: false,
        wrap_line_length: 0,
        indent_inner_html: true,
      });

      textareaRef.current.value = prettyHtml;
      // Trigger change event so any listeners on the textarea are notified
      textareaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      textareaRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (error) {
      console.error('Error converting Markdown to HTML:', error);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && (e.metaKey || e.ctrlKey)) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-[#282c34] duration-200">
      {/* Close Button FAB */}
      <button
        type="button"
        onClick={onClose}
        className={cn(
          'absolute top-2 right-6 z-10',
          'flex h-10 w-10 items-center justify-center',
          'rounded-full !border-none !bg-[##4e4e4e] !text-white shadow-lg',
          'transition-all hover:!bg-[#367d02]',
          'focus:!bg-[#367d02] focus:ring-2 focus:ring-offset-2 focus:outline-none',
        )}
        title="Close Editor"
        aria-label="Close Editor"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Editor */}
      <div
        className="flex flex-1 flex-col justify-center overflow-auto p-6"
        ref={editorRef}
      >
        <div className="w-full">
          <CodeMirror
            key={editorKey.current}
            value={initialMarkdown}
            height="auto"
            extensions={[markdown(), EditorView.lineWrapping, theme]}
            onChange={handleMarkdownChange}
            theme="dark"
            basicSetup={{
              lineNumbers: false,
              highlightActiveLineGutter: false,
              highlightSpecialChars: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              searchKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
            style={{
              fontSize: '16px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
