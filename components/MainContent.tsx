
import React from 'react';
import type { Page } from '../types';
import type { ApiStatus } from '../pages/audio/types';
import { AudioPage } from '../pages/AudioPage';
import { PhotoPage } from '../pages/PhotoPage';
import { VideoPage } from '../pages/VideoPage';
import { PlannerPage } from '../pages/PlannerPage';
import { AutoFillPage } from '../pages/AutoFillPage';
import { KeysPage } from '../pages/KeysPage';

interface MainContentProps {
  activePage: Page;
  addLog: (message: string) => void;
  setProgress: (value: number, label?: string) => void;
  isRunning: boolean;
  setProcessToRun: (proc: (() => Promise<void>) | null) => void;
  // API Props
  kieKey: string; setKieKey: (k: string) => void;
  kieCredits: number | null;
  models: string[]; selectedModel: string; setSelectedModel: (m: string) => void;
  // FIX: Removed gptKey and setGptKey from props as they are no longer managed in the UI.
  gptStatus: ApiStatus;
  authorizeKie: () => Promise<void>;
  authorizeGpt: () => Promise<void>;
  setActivePage: (page: Page) => void;
}

export const MainContent: React.FC<MainContentProps> = (props) => {
  const { activePage, addLog } = props;
  
  const pageProps = {
    ...props,
    addLog: addLog,
  }

  const renderPage = () => {
    switch (activePage) {
      case 'audio':
        return <AudioPage {...pageProps} />;
      case 'photo':
        return <PhotoPage addLog={addLog} />;
      case 'video':
        return <VideoPage addLog={addLog} />;
      case 'planner':
        return <PlannerPage addLog={addLog} />;
      case 'autofill':
        return <AutoFillPage addLog={addLog} />;
      case 'keys':
        return <KeysPage {...pageProps} />;
      default:
        return <div>Select a page</div>;
    }
  };

  return <div className="p-6">{renderPage()}</div>;
};
