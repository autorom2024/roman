

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { ControlPanel } from './components/ControlPanel';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import type { Page } from './types';
import type { ApiStatus } from './pages/audio/types';
import { useTranslation } from './i18n';
import { fetchModels, kieFetchCredits } from './services/kieApi';
// FIX: The API key is now handled by the checkGeminiKey function directly.
import { checkGeminiKey } from './services/geminiApi';


const App: React.FC = () => {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState<Page>('audio');
  const [logs, setLogs] = useState<string[]>([`[System] ${t('logs.welcome')}`]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  // API State lifted here
  const [kieKey, setKieKey] = useState('');
  const [kieCredits, setKieCredits] = useState<number | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  // FIX: Removed gptKey state management to adhere to API guidelines.
  const [gptStatus, setGptStatus] = useState<ApiStatus>('unknown');

  const processToRun = useRef<(() => Promise<void>) | null>(null);
  const setProcessToRun = (proc: (() => Promise<void>) | null) => {
    processToRun.current = proc;
  };

  // FIX: The `addLog` function has been simplified to only take one argument (the message)
  // and implicitly use the `activePage` for context. This resolves the errors where
  // the function was called with two arguments but only one was expected.
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-GB');
    const pageTag = activePage;
    const tagMap: Record<Page, string> = {
      'audio': 'Audio',
      'photo': 'Photo',
      'video': 'Video',
      'planner': 'Planner',
      'autofill': 'AutoFill',
      'keys': 'API'
    };
    const tag = tagMap[pageTag] || 'System';
    setLogs(prevLogs => [...prevLogs, `[${timestamp} | ${tag}] ${message}`]);
  }, [activePage]);
  
  const handleSetProgress = useCallback((value: number, label?: string) => {
    setProgress(value);
    if (label !== undefined) {
      setProgressLabel(label);
    }
  }, []);

  // API Authorization logic now lives here
  const authorizeKie = useCallback(async () => {
      if (!kieKey) { addLog(t('audio.errors.noKieKey')); return; }
      addLog(t('audio.logs.checkingKie'));
      setProgress(25, t('progress.authorizing'));
      setKieCredits(null);
      try {
          const [fetchedModels, credits] = await Promise.all([
              fetchModels(kieKey),
              kieFetchCredits(kieKey)
          ]);
          setKieCredits(credits);
          if(credits !== null) addLog(t('audio.logs.kieBalance', { count: credits.toFixed(2) }));
          else addLog(t('audio.logs.kieBalanceFail'));

          if (fetchedModels.length > 0) {
              setModels(fetchedModels);
              setSelectedModel(fetchedModels[0]);
              addLog(t('audio.logs.modelsFound', { count: fetchedModels.length, model: fetchedModels[0] }));
          } else {
              addLog(t('audio.logs.modelsNotFound'));
              setModels([]);
          }
      } catch (error: any) {
          addLog(`${t('audio.logs.authErrorKie')}: ${error.message}`);
          setModels([]);
      } finally {
          setProgress(0, "");
      }
  }, [kieKey, addLog, setProgress, t]);

  // FIX: The `authorizeGpt` function no longer accepts a key from the UI.
  // It relies on the environment variable as per the guidelines.
  const authorizeGpt = useCallback(async () => {
      addLog(t('audio.logs.checkingGpt'));
      setProgress(50, t('progress.checking'));
      setGptStatus('unknown');
      try {
          const isValid = await checkGeminiKey();
          if (isValid) {
              setGptStatus('ok');
              addLog(t('audio.logs.gptSuccess'));
          } else {
              throw new Error("Key is invalid or failed validation.");
          }
      } catch (error: any) {
          setGptStatus('bad');
          addLog(`${t('audio.logs.authErrorGpt')}: ${error.message}`);
      } finally {
          setProgress(0, "");
      }
  }, [addLog, setProgress, t]);


  const startProcess = async () => {
    if (isRunning) return;
    if (!processToRun.current) {
      addLog(t('logs.noProcess'));
      return;
    }

    setIsRunning(true);
    handleSetProgress(0, t('progress.starting'));
    addLog(t('logs.processStarted'));

    try {
      await processToRun.current();
       if (isRunningRef.current) {
        handleSetProgress(100, t('progress.completed'));
        addLog(t('logs.processCompleted'));
      }
    } catch (error: any) {
      if (error.message !== 'cancelled') {
        const errorMessage = error.message || t('errors.unknown');
        addLog(`${t('logs.error')}: ${errorMessage}`);
        handleSetProgress(progress, `${t('progress.error')}: ${errorMessage}`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const isRunningRef = useRef(isRunning);
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);

  const stopProcess = () => {
    if (!isRunning) return;
    addLog(t('logs.processStopped'));
    setIsRunning(false);
    handleSetProgress(progress, t('progress.stopped'));
  };

  const mainContentProps = {
    activePage,
    addLog,
    setProgress: handleSetProgress,
    isRunning,
    setProcessToRun,
    // API Props
    kieKey, setKieKey,
    kieCredits,
    models, selectedModel, setSelectedModel,
    // FIX: Removed gptKey and setGptKey from props.
    gptStatus,
    authorizeKie,
    authorizeGpt,
    setActivePage,
  };

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)] h-screen w-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="flex-1 flex flex-col bg-[var(--color-bg-panel)] overflow-y-auto">
          <MainContent {...mainContentProps} />
        </main>
        <ControlPanel
          logs={logs}
          setLogs={setLogs}
          isRunning={isRunning}
          progress={progress}
          progressLabel={progressLabel}
          startProcess={startProcess}
          stopProcess={stopProcess}
        />
      </div>
      <Footer />
    </div>
  );
};

export default App;
