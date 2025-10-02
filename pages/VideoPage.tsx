
import React, { useState } from 'react';
import { Film, Instagram, Music, Type, Scissors, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n';

interface VideoPageProps {
  addLog: (message: string) => void;
}

type Tab = 'Video' | 'Shorts';

const Timeline: React.FC = () => (
    <div className="h-24 bg-[var(--color-bg-panel-secondary)] rounded-lg p-2 flex items-center space-x-2 border border-[var(--color-border)]">
        <div className="text-xs font-mono text-gray-400">00:00:00</div>
        <div className="flex-1 h-full bg-black/30 rounded flex items-center">
            <div className="w-1 h-full bg-[var(--color-accent)] cursor-pointer"></div>
        </div>
         <div className="text-xs font-mono text-gray-400">00:05:00</div>
    </div>
)

const EditorLayout: React.FC<{ titleKey: string; icon: React.ElementType }> = ({ titleKey, icon: Icon }) => {
    const {t} = useTranslation();
    return (
        <div className="flex h-full space-x-4">
            <aside className="w-64 bg-black/20 border border-[var(--color-border)] rounded-lg p-4 space-y-4">
                <h3 className="font-bold text-lg flex items-center"><Icon className="w-5 h-5 mr-2" /> {t(titleKey)}</h3>
                <div className="space-y-2">
                    <button className="w-full flex items-center p-2 rounded hover:bg-white/10 transition"><Music className="w-4 h-4 mr-2"/> Audio</button>
                    <button className="w-full flex items-center p-2 rounded hover:bg-white/10 transition"><Type className="w-4 h-4 mr-2"/> Text</button>
                    <button className="w-full flex items-center p-2 rounded hover:bg-white/10 transition"><Scissors className="w-4 h-4 mr-2"/> Split</button>
                    <button className="w-full flex items-center p-2 rounded hover:bg-white/10 transition"><Sparkles className="w-4 h-4 mr-2"/> Effects</button>
                </div>
            </aside>
            <main className="flex-1 flex flex-col space-y-4">
                <div className="flex-1 bg-black rounded-lg flex items-center justify-center text-gray-600 border border-[var(--color-border)]">
                    Video Preview
                </div>
                <Timeline />
            </main>
        </div>
    )
}

export const VideoPage: React.FC<VideoPageProps> = ({ addLog }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('Video');

  React.useEffect(() => {
    addLog("Video editing page loaded.");
  }, [addLog]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-[var(--color-border)]">
        <button
          onClick={() => setActiveTab('Video')}
          className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2
            ${activeTab === 'Video' 
              ? 'text-white border-[var(--color-accent)]' 
              : 'text-[var(--color-text-secondary)] border-transparent hover:text-white'
            }`}
        >
          {t('video.tabs.video')}
        </button>
        <button
          onClick={() => setActiveTab('Shorts')}
          className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2
            ${activeTab === 'Shorts' 
              ? 'text-white border-[var(--color-accent)]' 
              : 'text-[var(--color-text-secondary)] border-transparent hover:text-white'
            }`}
        >
          {t('video.tabs.shorts')}
        </button>
      </div>
      <div className="flex-1 pt-6">
        {activeTab === 'Video' && <EditorLayout titleKey="video.placeholders.video" icon={Film} />}
        {activeTab === 'Shorts' && <EditorLayout titleKey="video.placeholders.shorts" icon={Instagram} />}
      </div>
    </div>
  );
};
