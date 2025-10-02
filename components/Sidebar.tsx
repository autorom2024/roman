import React from 'react';
import { Music, Camera, Clapperboard, CalendarDays, Wand2, Lock, Settings } from 'lucide-react';
import type { Page, MenuItem } from '../types';
import { Logo } from './Logo';
import { useTranslation } from '../i18n';

const menuItems: MenuItem[] = [
  { id: 'audio', labelKey: 'sidebar.audio', icon: Music },
  { id: 'photo', labelKey: 'sidebar.photo', icon: Camera },
  { id: 'video', labelKey: 'sidebar.video', icon: Clapperboard },
  { id: 'planner', labelKey: 'sidebar.planner', icon: CalendarDays },
  { id: 'autofill', labelKey: 'sidebar.autofill', icon: Wand2 },
];

const settingsItem: MenuItem = { id: 'keys', labelKey: 'sidebar.keys', icon: Settings };

const lockedFeatures: Page[] = [];

interface NavItemProps {
  item: MenuItem;
  isActive: boolean;
  isLocked: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, isLocked, onClick }) => {
  const { t } = useTranslation();
  const IconComponent = item.icon;

  return (
    <button
      key={item.id}
      onClick={onClick}
      disabled={isLocked}
      className={`
        group relative flex items-center w-full h-[60px] px-6 text-left rounded-xl transition-all duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-panel-secondary)]
        ${isLocked 
          ? 'cursor-not-allowed text-gray-600' 
          : 'text-[var(--color-text-secondary)] hover:text-white'
        }
        ${isActive
          ? 'bg-white/5 text-white'
          : 'hover:bg-white/5'
        }
      `}
      style={isActive ? {
        textShadow: '0 0 8px var(--color-accent-glow)',
        boxShadow: 'inset 0 0 15px rgba(255,255,255,0.03), 0 0 10px rgba(0,0,0,0.2)'
      } : {}}
    >
      <div className={`
        absolute left-0 top-0 h-full w-1 rounded-r-full transition-all duration-300
        ${isActive ? 'bg-[var(--color-accent)]' : 'bg-transparent group-hover:bg-[var(--color-accent)]/50'}
      `}
      style={isActive ? {
          boxShadow: '0 0 8px 1px var(--color-accent-glow)'
      } : {}}
      ></div>
      
      <IconComponent className={`w-6 h-6 mr-4 transition-colors ${isLocked ? 'text-gray-600' : ''} ${isActive ? 'text-[var(--color-accent-hover)]' : ''}`} />
      <span className="text-lg font-semibold tracking-wide">{t(item.labelKey)}</span>
      {isLocked && (
        <Lock className="w-4 h-4 ml-auto text-gray-500" />
      )}
    </button>
  );
};

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <aside className="w-64 bg-[var(--color-bg-panel-secondary)] border-r border-[var(--color-border)] flex-shrink-0 flex flex-col p-4 space-y-4">
      <Logo />
      <nav className="flex flex-col space-y-2 flex-grow">
        {menuItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activePage === item.id}
            isLocked={lockedFeatures.includes(item.id)}
            onClick={() => !lockedFeatures.includes(item.id) && setActivePage(item.id)}
          />
        ))}
      </nav>
      <div className="w-full h-[1px] bg-[var(--color-border)] my-2"></div>
      <nav>
        <NavItem
          item={settingsItem}
          isActive={activePage === settingsItem.id}
          isLocked={false}
          onClick={() => setActivePage(settingsItem.id)}
        />
      </nav>
    </aside>
  );
};