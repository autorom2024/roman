
import React, { useState } from 'react';
import { Eye, EyeOff, Unlock, Zap, Settings } from 'lucide-react';
import { useTranslation } from '../i18n';
import type { ApiStatus } from './audio/types';
import { GroupBox } from '../components/ui/GroupBox';
import { FormRow } from '../components/ui/FormRow';
import { Input } from '../components/ui/Input';
import { IconButton } from '../components/ui/IconButton';
import { Select } from '../components/ui/Select';

interface KeysPageProps {
  kieKey: string; setKieKey: (k: string) => void;
  authorizeKie: () => Promise<void>;
  kieCredits: number | null;
  models: string[]; selectedModel: string; setSelectedModel: (m: string) => void;
  // FIX: Removed gptKey and setGptKey props, as the key is now handled by environment variables.
  authorizeGpt: () => Promise<void>;
  gptStatus: ApiStatus;
  isRunning: boolean;
}

const StatusIndicator: React.FC<{ status: ApiStatus | 'credits', credits?: number | null, t: (key: string, params?: any) => string, translationKey: string }> = ({ status, credits, t, translationKey }) => {
    if (status === 'credits') {
        if (credits === null) return <span className="text-xs text-gray-500">—</span>;
        return <span className="text-xs font-bold text-green-400">{t(translationKey, { count: credits.toFixed(2) })}</span>
    }
    const colorMap: Record<ApiStatus, string> = { ok: 'text-green-400', bad: 'text-red-400', unknown: 'text-gray-500' };
    const textMap: Record<ApiStatus, string> = { ok: t(`${translationKey}.ok`), bad: t(`${translationKey}.bad`), unknown: t(`${translationKey}.unknown`) };
    return <span className={`text-xs font-semibold ${colorMap[status]}`}>{textMap[status]}</span>;
}


export const KeysPage: React.FC<KeysPageProps> = (props) => {
    const { 
        kieKey, setKieKey, authorizeKie, kieCredits, models, selectedModel, setSelectedModel, 
        authorizeGpt, gptStatus, 
        isRunning 
    } = props;
    const { t } = useTranslation();
    const [kieKeyVisible, setKieKeyVisible] = useState(false);
    // FIX: Removed state for gptKeyVisible as the input field is removed.

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center"><Settings className="w-8 h-8 mr-3 text-[var(--color-text-tertiary)]"/> {t('keysPage.title')}</h1>

            <GroupBox title={t('keysPage.kie.title')}>
                <div className="space-y-4">
                    <FormRow label={t('keysPage.kie.label')}>
                        <div className="flex items-center space-x-2">
                            <Input type={kieKeyVisible ? "text" : "password"} placeholder={t('keysPage.kie.placeholder')} value={kieKey} onChange={e => setKieKey(e.target.value)} disabled={isRunning} />
                            <IconButton onClick={() => setKieKeyVisible(!kieKeyVisible)} disabled={isRunning}>{kieKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</IconButton>
                            <button className="flex-shrink-0 flex items-center space-x-2 text-sm bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] px-3 py-2 rounded-lg transition disabled:opacity-50 font-semibold" onClick={authorizeKie} disabled={isRunning || !kieKey}>
                               <Unlock className="w-4 h-4" /><span>{t('keysPage.kie.button')}</span>
                            </button>
                            <StatusIndicator status="credits" credits={kieCredits} t={t} translationKey="keysPage.kie.credits" />
                        </div>
                    </FormRow>
                     <FormRow label={t('keysPage.kie.modelLabel')}>
                        <Select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} disabled={isRunning || models.length === 0}>
                            {models.length === 0 ? (
                               <option>{t('keysPage.kie.modelPlaceholder')}</option>
                            ) : (
                               models.map(m => <option key={m} value={m}>{m}</option>)
                            )}
                        </Select>
                    </FormRow>
                </div>
            </GroupBox>

            <GroupBox title={t('keysPage.gemini.title')}>
                {/* FIX: Removed the input field for the Gemini API key to comply with guidelines. The key is now sourced from environment variables. */}
                <FormRow label={t('keysPage.gemini.label')}>
                    <div className="flex items-center space-x-2">
                        <Input type="password" placeholder="Configured via environment variable" disabled={true} value="******************" />
                        <button className="flex-shrink-0 flex items-center space-x-2 text-sm bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] px-3 py-2 rounded-lg transition disabled:opacity-50 font-semibold" onClick={authorizeGpt} disabled={isRunning}>
                           <Zap className="w-4 h-4" /><span>{t('keysPage.gemini.button')}</span>
                        </button>
                         <StatusIndicator status={gptStatus} t={t} translationKey="keysPage.gemini.status" />
                    </div>
                </FormRow>
            </GroupBox>
        </div>
    );
};
