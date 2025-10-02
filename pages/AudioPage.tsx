
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { createKieTask, pollKieTask, downloadKieAudio, sleep } from '../services/kieApi';
import { generateTitlesWithGemini } from '../services/geminiApi';
import { sanitizeFilename, downloadBlob } from '../utils/files';
import { GroupBox } from '../components/ui/GroupBox';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { TracksPanel } from './audio/TracksPanel';
import { AlbumsPanel } from './audio/AlbumsPanel';
import type { ApiStatus } from './audio/types';
import type { Page } from '../types';
import { AlertTriangle, CheckCircle, Settings } from 'lucide-react';

const bar = (pct: number, width: number = 16, filled: string = "█", empty: string = "░"): string => {
    const p = Math.max(0.0, Math.min(100.0, pct));
    const k = Math.round(width * p / 100.0);
    return filled.repeat(k) + empty.repeat(width - k);
}

interface AudioPageProps {
    addLog: (message: string) => void;
    setProgress: (value: number, label?: string) => void;
    isRunning: boolean;
    setProcessToRun: (proc: (() => Promise<void>) | null) => void;
    // API Props
    kieKey: string;
    selectedModel: string;
    // FIX: Removed gptKey from props as it is no longer needed.
    gptStatus: ApiStatus;
    setActivePage: (page: Page) => void;
}

const ApiStatusDisplay: React.FC<{
    kieKey: string;
    selectedModel: string;
    gptStatus: ApiStatus;
    setActivePage: (page: Page) => void;
}> = ({ kieKey, selectedModel, gptStatus, setActivePage }) => {
    const { t } = useTranslation();
    const isKieReady = kieKey && selectedModel;
    const isGptReady = gptStatus === 'ok';

    return (
        <GroupBox title="API Status">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`flex items-start p-3 rounded-lg ${isKieReady ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {isKieReady ? <CheckCircle className="w-5 h-5 mr-3 text-green-400 mt-0.5" /> : <AlertTriangle className="w-5 h-5 mr-3 text-red-400 mt-0.5" />}
                    <div>
                        <h4 className="font-bold">{isKieReady ? t('audio.status.kieReady', { model: selectedModel }) : t('audio.status.kieNotReady')}</h4>
                        {!isKieReady && <button onClick={() => setActivePage('keys')} className="text-sm text-[var(--color-accent)] hover:underline">{t('audio.status.goToSettings')}</button>}
                    </div>
                </div>
                <div className={`flex items-start p-3 rounded-lg ${isGptReady ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                     {isGptReady ? <CheckCircle className="w-5 h-5 mr-3 text-green-400 mt-0.5" /> : <AlertTriangle className="w-5 h-5 mr-3 text-yellow-400 mt-0.5" />}
                    <div>
                         <h4 className="font-bold">{isGptReady ? t('audio.status.geminiReady') : t('audio.status.geminiNotReady')}</h4>
                         {!isGptReady && <button onClick={() => setActivePage('keys')} className="text-sm text-[var(--color-accent)] hover:underline">{t('audio.status.goToSettings')}</button>}
                    </div>
                </div>
            </div>
        </GroupBox>
    )
}


export const AudioPage: React.FC<AudioPageProps> = ({ addLog, setProgress, isRunning, setProcessToRun, kieKey, selectedModel, gptStatus, setActivePage }) => {
    const { t } = useTranslation();
    const [pageMode, setPageMode] = useState<'tracks' | 'albums'>('tracks');

    const [trackFormState, setTrackFormState] = useState({
        genMode: 'auto' as 'auto' | 'lyrics',
        styleText: 'Tropical melodic house, female vocal, sunny, beach party',
        lyricsText: '',
        instrumental: false,
        useGptTitles: true,
        batches: 1,
        lengthMinutes: 3,
        userTitles: '',
    });

    const [albumFormState, setAlbumFormState] = useState({
        sourcePath: '',
        destinationPath: '~/Music/Albums',
        albums: 1,
        tracksPerAlbum: 13,
    });
    const [albumSourceFiles, setAlbumSourceFiles] = useState<FileList | null>(null);

    const isRunningRef = useRef(isRunning);
    useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);

    const isKieReady = !!(kieKey && selectedModel);

    const runGeneration = useCallback(async () => {
        const { styleText, genMode, lyricsText, instrumental, batches, lengthMinutes, userTitles, useGptTitles } = trackFormState;
        
        if (!kieKey) throw new Error(t('audio.errors.noKieKey'));
        if (!selectedModel) throw new Error(t('audio.errors.noModel'));
        
        const totalTracks = Math.max(1, batches * 2);
        
        let titles = userTitles.split(';').map(t => sanitizeFilename(t.trim())).filter(Boolean);
        
        if (titles.length === 0 && useGptTitles) {
            // FIX: Removed gptKey check.
            if (gptStatus !== 'ok') {
                 addLog(t('audio.logs.gptWarning'));
            } else {
                try {
                    addLog(t('audio.logs.generatingTitles'));
                    setProgress(5, t('progress.generatingTitles'));
                    // FIX: generateTitlesWithGemini no longer requires an API key argument.
                    titles = await generateTitlesWithGemini(styleText, 'track', totalTracks);
                    addLog(t('audio.logs.titlesGenerated', { count: titles.length }));
                } catch (e: any) {
                     addLog(`${t('audio.logs.titleGenError')}: ${e.message}.`);
                }
            }
        }

        if(titles.length === 0) {
           titles = Array.from({length: totalTracks}, (_, i) => sanitizeFilename(`${styleText.split(' ').slice(0,3).join(' ')} ${i+1}`.trim()));
        }

        let made = 0;
        
        for (let ri = 0; ri < batches; ri++) {
            if (!isRunningRef.current) { addLog(t('logs.stopped')); throw new Error("cancelled"); }

            const payload: any = {
                model: selectedModel,
                style: styleText.trim(),
                instrumental: !!instrumental,
                duration: Math.max(1, lengthMinutes),
                customMode: true,
                title: titles[made] || `${t('audio.tracks.defaultTitle')} ${made + 1}`,
                callBackUrl: 'https://postman-echo.com/post',
                callbackUrl: 'https://postman-echo.com/post',
            };

            if (genMode === 'lyrics' && lyricsText && !instrumental) {
                payload.prompt = lyricsText.trim();
            } else {
                payload.prompt = instrumental ? "" : "Pop vocal";
            }

            addLog(t('audio.logs.creatingTask', { current: ri + 1, total: batches }));
            
            const taskId = await createKieTask(kieKey, payload);
            
            addLog(t('audio.logs.taskCreated', { taskId }));

            const WAIT_MAX_SEC = 500;
            const POLL_STEP_SEC = 5;
            const t0 = Date.now();
            let infoJson: any = null;

            while ((Date.now() - t0) / 1000 < WAIT_MAX_SEC) {
                if (!isRunningRef.current) { addLog(t('logs.stopped')); throw new Error("cancelled"); }
                
                const elapsed = Math.round((Date.now() - t0) / 1000);
                const startF = (made / totalTracks) * 100.0;
                const endF = ((made + 2) / totalTracks) * 100.0;
                const waitCapF = startF + (endF - startF) * 0.80;
                const currentProgress = startF + (waitCapF - startF) * (elapsed / WAIT_MAX_SEC);
                setProgress(currentProgress, t('progress.waiting', { bar: bar(elapsed*100/WAIT_MAX_SEC), elapsed: elapsed, total: WAIT_MAX_SEC, track: made+1 }));

                const pollResult = await pollKieTask(kieKey, taskId);
                if (pollResult) {
                    infoJson = pollResult;
                    break;
                }
                await sleep(POLL_STEP_SEC * 1000);
            }

            if (!infoJson) throw new Error(t('audio.errors.timeout'));
            
            const items = infoJson?.data?.records || infoJson?.records || [];
            if (!items || items.length === 0) throw new Error(t('audio.errors.noItems'));

            for (const item of items.slice(0, 2)) {
                if (!isRunningRef.current) { addLog(t('logs.stopped')); throw new Error("cancelled"); }
                const url = item.audioUrl || item.sourceAudioUrl;
                if (!url) { addLog(t('audio.logs.noUrl')); continue; }
                
                const baseTitle = titles[made] || item.title || `${t('audio.tracks.defaultTitle')} ${made + 1}`;
                const filename = `${sanitizeFilename(baseTitle)}.mp3`;
                
                addLog(t('audio.logs.downloading', { current: made + 1, total: totalTracks, filename }));
                
                try {
                    const blob = await downloadKieAudio(url);
                    downloadBlob(blob, filename);
                    addLog(t('audio.logs.saved', { current: made + 1, total: totalTracks, filename }));
                    made += 1;
                    setProgress((made / totalTracks) * 100, t('progress.saved', { filename }));
                } catch(e: any) {
                    addLog(t('audio.logs.downloadFail', { url: url }));
                }
            }
        }
    }, [trackFormState, kieKey, selectedModel, gptStatus, addLog, setProgress, t]);

    const runAlbumCreation = useCallback(async () => {
        const { destinationPath, albums, tracksPerAlbum } = albumFormState;

        if (!albumSourceFiles || albumSourceFiles.length === 0) {
            throw new Error(t('audio.errors.noAlbumSource'));
        }

        addLog(t('audio.logs.albumProcessStart', {
            albums,
            tracks: tracksPerAlbum,
            source: `${albumSourceFiles.length} files`,
            dest: destinationPath
        }));

        const allTracks = Array.from(albumSourceFiles);
        let trackIndex = 0;

        for (let i = 0; i < albums; i++) {
            if (!isRunningRef.current) { addLog(t('logs.stopped')); throw new Error("cancelled"); }
            
            const albumNumber = i + 1;
            const albumTracks = allTracks.slice(trackIndex, trackIndex + tracksPerAlbum);
            
            if(albumTracks.length === 0) {
                addLog(t('audio.logs.notEnoughTracks', { album: albumNumber }));
                break; 
            }
            
            const progress = (albumNumber / albums) * 100;
            setProgress(progress, t('audio.logs.creatingAlbum', { current: albumNumber, total: albums }));
            
            addLog(`💿 Album ${albumNumber}: Creating structure with ${albumTracks.length} tracks.`);
            for(let trackIdx = 0; trackIdx < albumTracks.length; trackIdx++) {
                const track = albumTracks[trackIdx];
                 addLog(`   - Track ${trackIdx + 1}: ${track.name} (${(track.size / 1024).toFixed(2)} KB)`);
                 if(trackIdx % 10 === 0) await sleep(10);
            }
            
            trackIndex += tracksPerAlbum;
        }

        addLog(t('audio.logs.albumProcessEnd'));

    }, [albumFormState, albumSourceFiles, addLog, setProgress, t]);


    useEffect(() => {
        if (pageMode === 'tracks' && isKieReady) {
            setProcessToRun(runGeneration);
        } else if (pageMode === 'albums') {
            setProcessToRun(runAlbumCreation);
        } else {
            setProcessToRun(null);
        }
        return () => setProcessToRun(null);
    }, [pageMode, runGeneration, runAlbumCreation, setProcessToRun, isKieReady]);

    return (
        <div className="space-y-6">
            <ApiStatusDisplay 
                kieKey={kieKey}
                selectedModel={selectedModel}
                gptStatus={gptStatus}
                setActivePage={setActivePage}
            />

            <GroupBox title={t('audio.workMode.title')}>
                 <SegmentedControl
                    value={pageMode}
                    onChange={(v) => setPageMode(v as 'tracks' | 'albums')}
                    disabled={isRunning}
                    options={[
                        { value: 'tracks', label: t('audio.workMode.tracks') },
                        { value: 'albums', label: t('audio.workMode.albums') },
                    ]}
                />
            </GroupBox>

            {pageMode === 'tracks' ? (
                <TracksPanel 
                    state={trackFormState} 
                    setState={setTrackFormState} 
                    isRunning={isRunning || !isKieReady} 
                    gptStatus={gptStatus} 
                />
            ) : (
                <AlbumsPanel 
                    state={albumFormState} 
                    setState={setAlbumFormState} 
                    isRunning={isRunning} 
                    onFilesSelected={setAlbumSourceFiles}
                />
            )}
        </div>
    );
};
