import { render } from 'preact';

import './index.css';

import { App } from './app.tsx';

const container = document.getElementById('navigation-inner');
if (!container) {
  throw new Error(
    'Failed to find root element for Drupal.org Flow (id=navigation-inner)',
  );
}

render(<App />, container);
