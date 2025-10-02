import React from 'react';
import { useTranslation } from '../../i18n';
import type { ApiStatus } from './types';
import { GroupBox } from '../../components/ui/GroupBox';
import { FormRow } from '../../components/ui/FormRow';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { Textarea } from '../../components/ui/Textarea';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';

interface TracksPanelProps {
    state: any;
    setState: React.Dispatch<React.SetStateAction<any>>;
    isRunning: boolean;
    gptStatus: ApiStatus;
}

export const TracksPanel: React.FC<TracksPanelProps> = ({ state, setState, isRunning, gptStatus }) => {
    const { t } = useTranslation();
    const handleFieldChange = (field: string, value: any) => {
        setState((s: any) => ({ ...s, [field]: value }));
    };
    const isGptDisabled = gptStatus !== 'ok';
    const isLyricsMode = state.genMode === 'lyrics';

    return (
        <GroupBox title={t('audio.tracks.title')}>
            <div className="space-y-4">
                <FormRow label={t('audio.tracks.mode')}>
                     <SegmentedControl
                        value={state.genMode}
                        onChange={(v) => handleFieldChange('genMode', v)}
                        disabled={isRunning}
                        options={[ { value: 'auto', label: t('audio.tracks.modeAuto') }, { value: 'lyrics', label: t('audio.tracks.modeLyrics') } ]}
                    />
                </FormRow>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3">
                        <label className="font-semibold text-gray-400">{t('audio.tracks.style')}</label>
                        <Textarea placeholder={t('audio.tracks.stylePlaceholder')} value={state.styleText} onChange={e => handleFieldChange('styleText', e.target.value)} disabled={isRunning} />
                        {isLyricsMode && (
                             <>
                                <label className="font-semibold text-gray-400">{t('audio.tracks.lyrics')}</label>
                                <Textarea placeholder={t('audio.tracks.lyricsPlaceholder')} value={state.lyricsText} onChange={e => handleFieldChange('lyricsText', e.target.value)} disabled={isRunning} />
                             </>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="font-semibold text-gray-400">{t('audio.tracks.options')}</label>
                             <div className="flex items-center space-x-4 mt-2">
                                <Checkbox label={t('audio.tracks.instrumental')} checked={state.instrumental} onChange={e => handleFieldChange('instrumental', e.target.checked)} disabled={isRunning || isLyricsMode}/>
                                <Checkbox label={t('audio.tracks.gptTitles')} checked={state.useGptTitles} onChange={e => handleFieldChange('useGptTitles', e.target.checked)} disabled={isRunning || isGptDisabled}/>
                             </div>
                        </div>
                        <div>
                            <label className="font-semibold text-gray-400">{t('audio.tracks.countDuration')}</label>
                             <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm">{t('audio.tracks.batches')}:</span>
                                    <Input type="number" min="1" value={state.batches} onChange={e => handleFieldChange('batches', parseInt(e.target.value) || 1)} className="w-20" disabled={isRunning} />
                                </div>
                                 <div className="flex items-center space-x-2">
                                    <span className="text-sm">{t('audio.tracks.duration')}:</span>
                                    <Input type="number" min="1" max="4" value={state.lengthMinutes} onChange={e => handleFieldChange('lengthMinutes', parseInt(e.target.value) || 1)} className="w-20" disabled={isRunning} />
                                </div>
                             </div>
                        </div>
                        <div>
                            <label className="font-semibold text-gray-400">{t('audio.tracks.trackTitles')}</label>
                            <Input placeholder={t('audio.tracks.trackTitlesPlaceholder')} className="mt-2" value={state.userTitles} onChange={e => handleFieldChange('userTitles', e.target.value)} disabled={isRunning} />
                        </div>
                    </div>
                </div>
            </div>
        </GroupBox>
    );
}