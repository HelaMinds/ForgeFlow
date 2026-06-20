'use client';

import { useState } from 'react';

const SECTION_ICONS = {
  overview:
    'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z',
  pipeline:
    'M8.25 3.75H4.875c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h3.375c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125Zm0 9.75H4.875c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h3.375c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125ZM19.125 3.75H15.75c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h3.375c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125Zm0 9.75H15.75c-.621 0-1.125.504-1.125 1.125v4.5c0 .621.504 1.125 1.125 1.125h3.375c.621 0 1.125-.504 1.125-1.125v-4.5c0-.621-.504-1.125-1.125-1.125Z',
  timeline:
    'M6.75 2.994A2.25 2.25 0 0 0 4.5 5.25v13.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V5.25a2.25 2.25 0 0 0-2.25-2.25h-8.25ZM7.5 9h9M7.5 12.75h9M7.5 16.5h5.25',
  decisions: 'M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5',
  risks:
    'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
  next: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z',
};

function NavIcon({ id }) {
  const path = SECTION_ICONS[id] || SECTION_ICONS.overview;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="h-[18px] w-[18px] shrink-0"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

function SectionButton({ section, isActive, onChange, collapsed }) {
  return (
    <button
      type="button"
      onClick={() => onChange(section.id)}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? section.label : undefined}
      className={`flex items-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        collapsed ? 'w-full justify-center px-0 py-2.5' : 'w-full px-3 py-2.5 text-left'
      } ${
        isActive
          ? 'bg-riso-coral text-white shadow-riso-active'
          : 'text-riso-muted hover:bg-riso-border/50 hover:text-riso-ink'
      }`}
    >
      <NavIcon id={section.id} />
      {!collapsed && <span className="truncate">{section.label}</span>}
    </button>
  );
}

function CompactButton({ section, isActive, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(section.id)}
      aria-current={isActive ? 'page' : undefined}
      className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
        isActive
          ? 'bg-riso-coral text-white shadow-riso-active'
          : 'text-riso-muted hover:bg-riso-border/60 hover:text-riso-ink'
      }`}
    >
      <NavIcon id={section.id} />
      <span>{section.label}</span>
    </button>
  );
}

export default function ResultSidebar({ sections, activeId, onChange, orientation = 'vertical' }) {
  const [collapsed, setCollapsed] = useState(false);

  if (orientation === 'horizontal') {
    return (
      <nav
        aria-label="Plan sections"
        className="overflow-x-auto border-b border-riso-border bg-riso-sidebar pb-2"
      >
        <ul className="flex gap-1 px-2 pt-2">
          {sections.map((section) => (
            <li key={section.id}>
              <CompactButton
                section={section}
                isActive={section.id === activeId}
                onChange={onChange}
              />
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Plan sections"
      className={`sidebar-transition flex h-full flex-col border-r border-riso-border bg-riso-sidebar ${
        collapsed ? 'w-14' : 'w-52'
      }`}
    >
      {/* Toggle button */}
      <div className={`flex items-center border-b border-riso-border px-2 py-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <p className="pl-1 text-[10px] font-semibold uppercase tracking-widest text-riso-faint">
            Sections
          </p>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-7 w-7 items-center justify-center rounded-md text-riso-muted transition hover:bg-riso-border hover:text-riso-ink"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            )}
          </svg>
        </button>
      </div>

      <ul className={`flex flex-1 flex-col gap-0.5 overflow-y-auto py-3 ${collapsed ? 'px-1.5' : 'px-2'}`}>
        {sections.map((section) => (
          <li key={section.id}>
            <SectionButton
              section={section}
              isActive={section.id === activeId}
              onChange={onChange}
              collapsed={collapsed}
            />
          </li>
        ))}
      </ul>

      {/* ForgeFlow wordmark at bottom */}
      {!collapsed && (
        <div className="border-t border-riso-border px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-riso-coral/70">
            ForgeFlow
          </p>
        </div>
      )}
    </nav>
  );
}
