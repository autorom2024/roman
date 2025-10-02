
import React from 'react';
import { Wand2, FileText, Tags, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n';
import { GroupBox } from '../components/ui/GroupBox';
import { FormRow } from '../components/ui/FormRow';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

export const AutoFillPage: React.FC<{ addLog: (message: string) => void; }> = ({ addLog }) => {
  const { t } = useTranslation();
  React.useEffect(() => { addLog("AutoFill page loaded."); }, [addLog]);

  return (
    <div className="flex flex-col h-full space-y-6">
        <h1 className="text-3xl font-bold flex items-center"><Wand2 className="w-8 h-8 mr-3 text-[#A0ACC0]"/> {t('sidebar.autofill')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GroupBox title="1. Input Criteria">
                <div className="space-y-4">
                    <FormRow label="Style / Genre">
                        <Input placeholder="e.g., Lofi Hip-Hop, Melodic House" />
                    </FormRow>
                    <FormRow label="Mood / Vibe">
                        <Input placeholder="e.g., Chill, Energetic, Nostalgic" />
                    </FormRow>
                    <FormRow label="Keywords">
                        <Input placeholder="e.g., rain, study, summer" />
                    </FormRow>
                    <button className="w-full flex items-center justify-center space-x-2 bg-[#3882F6] hover:bg-[#50A0FF] px-4 py-2 rounded-lg transition font-semibold">
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Content</span>
                    </button>
                </div>
            </GroupBox>
            <GroupBox title="2. Generated Results">
                <div className="space-y-4">
                    <FormRow label="Title">
                        <Input readOnly value="Midnight Reverie" />
                    </FormRow>
                    <FormRow label="Description">
                        <Textarea readOnly rows={4} value="Close your eyes and drift away to the soothing sounds of 'Midnight Reverie'. A perfect lofi companion for late-night study sessions, quiet contemplation, or simply watching the rain fall outside your window. Let the chill beats and nostalgic melodies wash over you." />
                    </FormRow>
                    <FormRow label="Tags">
                         <Input readOnly value="lofi, hiphop, chill, study beats, instrumental, aesthetic, relaxing" />
                    </FormRow>
                </div>
            </GroupBox>
        </div>
    </div>
  );
};