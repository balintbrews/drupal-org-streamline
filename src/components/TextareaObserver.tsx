import { render } from 'preact';
import { useEffect } from 'preact/hooks';

import { TextareaFAB } from './TextareaFAB';

const INJECTED_ATTRIBUTE = 'data-markdown-fab-injected';
const FAB_CONTAINER_CLASS = 'markdown-fab-container';

function injectFABIntoWrapper(wrapper: Element) {
  // Skip if already injected
  if (wrapper.hasAttribute(INJECTED_ATTRIBUTE)) {
    return;
  }

  // Find the textarea inside this wrapper
  const textarea = wrapper.querySelector('textarea');
  if (!textarea) {
    return;
  }

  // Make the wrapper position relative so the FAB can be positioned absolutely
  const wrapperElement = wrapper as HTMLElement;
  const currentPosition = window.getComputedStyle(wrapperElement).position;
  if (currentPosition === 'static' || currentPosition === '') {
    wrapperElement.style.position = 'relative';
  }

  // Create a container for the FAB
  const fabContainer = document.createElement('div');
  fabContainer.className = FAB_CONTAINER_CLASS;
  wrapperElement.appendChild(fabContainer);

  // Render the FAB into the container
  render(<TextareaFAB textarea={textarea} />, fabContainer);

  // Mark as injected
  wrapper.setAttribute(INJECTED_ATTRIBUTE, 'true');
}

function processAllTextareaWrappers() {
  const wrappers = document.querySelectorAll('.form-textarea-wrapper');
  wrappers.forEach((wrapper) => {
    injectFABIntoWrapper(wrapper);
  });
}

export function TextareaObserver() {
  useEffect(() => {
    processAllTextareaWrappers();
  }, []);

  return null;
}
