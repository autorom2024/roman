import React from 'react';
import { Crop, RotateCcw, Wand, Sliders, Sun, Contrast } from 'lucide-react';
import { useTranslation } from '../i18n';

const ToolButton: React.FC<{ icon: React.ElementType, label: string }> = ({ icon: Icon, label }) => (
  <button className="flex flex-col items-center space-y-2 text-gray-400 hover:text-white transition-colors duration-200">
    <div className="p-3 bg-slate-700/50 rounded-lg">
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-xs font-semibold">{label}</span>
  </button>
);

export const PhotoPage: React.FC<{ addLog: (message: string) => void; }> = ({ addLog }) => {
  const { t } = useTranslation();
  React.useEffect(() => { addLog("Photo editing page loaded."); }, [addLog]);

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl overflow-hidden">
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-24 bg-black/20 p-4 flex flex-col items-center space-y-6">
          <ToolButton icon={Crop} label="Crop" />
          <ToolButton icon={RotateCcw} label="Rotate" />
          <ToolButton icon={Wand} label="Magic" />
          <ToolButton icon={Sliders} label="Adjust" />
           <ToolButton icon={Sun} label="Exposure" />
           <ToolButton icon={Contrast} label="Contrast" />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-8 bg-black/30">
          <div className="w-full h-full border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-500">
            <span>{t('pagePlaceholder.underConstruction')}</span>
          </div>
        </main>
      </div>

      {/* Bottom Filmstrip */}
      <footer className="h-28 bg-black/20 p-2 border-t border-slate-700/50">
        <div className="flex space-x-2 h-full overflow-x-auto">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-full aspect-square bg-slate-700 rounded flex-shrink-0 border-2 border-transparent hover:border-purple-500 transition-all"></div>
          ))}
        </div>
      </footer>
    </div>
  );
};