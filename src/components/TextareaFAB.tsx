import { useState } from 'preact/hooks';

import { cn } from '../lib/utils';
import { MarkdownEditorModal } from './MarkdownEditorModal';

interface TextareaFABProps {
  textarea: HTMLTextAreaElement;
}

export function TextareaFAB({ textarea }: TextareaFABProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'absolute right-6 bottom-6 z-10',
          'flex h-10 w-10 items-center justify-center',
          'rounded-full !border-none !bg-[#7cbc48] !text-white shadow-lg',
          'transition-all hover:!bg-[#367d02]',
          'focus:!bg-[#367d02] focus:ring-2 focus:ring-offset-2 focus:outline-none',
        )}
        title="Open Markdown Editor"
        aria-label="Open Markdown Editor"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      <MarkdownEditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        textarea={textarea}
      />
    </>
  );
}
