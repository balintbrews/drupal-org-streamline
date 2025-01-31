import preact from 'preact';

import { cn } from './lib/utils';

const Link = ({
  href,
  children,
  className = '',
}: {
  href: string;
  children: preact.ComponentChildren;
  className?: string;
}) => {
  return (
    <a className={cn('!m-0 !p-2', className)} href={href}>
      {children}
    </a>
  );
};

export function App() {
  return (
    <>
      <ul className="flex gap-2">
        {/* <li>
          <Link className="bg-[url('https://www.drupal.org/sites/all/themes/bluecheese/images/icon-w-drupal.svg')] bg-no-repeat bg-center bg-contain bg-transparent -indent-96"  href="/">Home</Link>
        </li> */}
        <li>
          <Link href="/dashboard">My dashboard</Link>
        </li>
        <li>
          <Link href="/user">My account</Link>
        </li>
      </ul>
    </>
  );
}
