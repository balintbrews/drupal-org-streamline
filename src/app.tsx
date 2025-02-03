import preact from 'preact';
import { render } from 'preact-render-to-string';
import { useEffect, useState } from 'preact/hooks';

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
  const [issueId, setIssueId] = useState<string | null>(null);
  const [issueTitle, setIssueTitle] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    if (!issueId) {
      const pageTitle = document.getElementById('page-title');
      if (pageTitle) {
        setIssueTitle(pageTitle.textContent);
      }
    }
  }, [issueId, setIssueTitle]);

  // Set issue ID and project ID from the URL.
  useEffect(() => {
    const matches =
      /https:\/\/www\.drupal\.org\/project\/(\w+)\/issues\/(\d+)/.exec(
        window.location.href,
      );
    if (matches) {
      setIssueId(matches[2]);
      setProjectId(matches[1]);
    }
  }, [setIssueId, setProjectId]);

  // Set the project name from the breadcrumb.
  useEffect(() => {
    if (projectId) {
      const breadcrumb = document.querySelector('nav.breadcrumb');
      const projectLink = breadcrumb?.querySelector(
        `a[href="/project/${projectId}"]`,
      );
      if (projectLink) {
        setProjectName(projectLink.textContent);
      }
    }
  }, [projectId, setProjectName]);

  // Add the issue ID to the page title.
  useEffect(() => {
    if (issueId) {
      const pageTitle = document.getElementById('page-title');
      if (pageTitle && projectId && projectName) {
        const issueSpan = render(
          <div className="!mb-2 flex items-center gap-3">
            <span className="!text-2xl !font-normal text-slate-500">
              [#{issueId}]
            </span>
            <a
              className="!text-xl"
              href={`/project/issues/search/${projectId}`}
            >
              {projectName}
            </a>
          </div>,
        );
        pageTitle.innerHTML = `${issueSpan}${pageTitle.innerHTML}`;
      }
    }
  }, [issueId, projectId, projectName]);

  return (
    <div className="flex justify-between gap-4">
      {projectId && issueId && (
        <div>
          <a
            href={`/project/${projectId}/issues/${issueId}`}
            className="!m-0 !p-[.625em] !font-mono !text-sm"
          >
            #{issueId}: {issueTitle}
          </a>
        </div>
      )}
      <div className="flex shrink-0 items-center gap-2">
        <ul className="flex gap-2">
          <li>
            <Link href="/dashboard">My dashboard</Link>
          </li>
          <li>
            <Link href="/user">My account</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
