import { render } from 'preact';

import './index.css';

import { App } from './app.tsx';
import { TextareaObserver } from './components/TextareaObserver.tsx';

const container = document.getElementById('navigation-inner');
if (!container) {
  throw new Error(
    'Failed to find root element for Drupal.org Flow (id=navigation-inner)',
  );
}

render(<App />, container);

// Create a separate container for the textarea observer
const observerContainer = document.createElement('div');
observerContainer.id = 'drupal-org-streamline-observer';
document.body.appendChild(observerContainer);
render(<TextareaObserver />, observerContainer);
