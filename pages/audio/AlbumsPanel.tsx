import React, { useRef } from 'react';
import { useTranslation } from '../../i18n';
import { Folder } from 'lucide-react';
import { GroupBox } from '../../components/ui/GroupBox';
import { FormRow } from '../../components/ui/FormRow';
import { Input } from '../../components/ui/Input';
import { IconButton } from '../../components/ui/IconButton';

interface AlbumsPanelProps {
    state: any;
    setState: React.Dispatch<React.SetStateAction<any>>;
    isRunning: boolean;
    onFilesSelected: (files: FileList | null) => void;
}

export const AlbumsPanel: React.FC<AlbumsPanelProps> = ({ state, setState, isRunning, onFilesSelected }) => {
    const { t } = useTranslation();
    const sourceInputRef = useRef<HTMLInputElement>(null);

    const handleFieldChange = (field: string, value: any) => {
        setState((s: any) => ({ ...s, [field]: value }));
    };

    const handleSourceSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            onFilesSelected(event.target.files);
            // Show a representative path in the UI
            const files = event.target.files;
            let representativePath = '';
            if (files.length > 0) {
                 const firstFile = files[0];
                 // webkitRelativePath is non-standard but gives the folder structure
                 const relativePath = (firstFile as any).webkitRelativePath;
                 if (relativePath) {
                    representativePath = relativePath.substring(0, relativePath.lastIndexOf('/') || relativePath.length);
                 } else {
                    representativePath = `${files.length} file(s) selected`;
                 }
            }
            handleFieldChange('sourcePath', representativePath);
        }
    };

    return (
    <GroupBox title={t('audio.albums.title')}>
        <div className="space-y-4">
            <input 
                type="file" 
                ref={sourceInputRef} 
                className="hidden" 
                onChange={handleSourceSelect}
                // @ts-ignore - These attributes are non-standard but enable folder selection in supporting browsers.
                webkitdirectory="true" 
                mozdirectory="true" 
                directory="true"
                multiple
            />
            
            <FormRow label={t('audio.albums.source')}>
                <div className="flex items-center space-x-2">
                    <Input 
                        placeholder={t('audio.albums.sourcePlaceholder')} 
                        value={state.sourcePath} 
                        readOnly
                        disabled={isRunning} 
                    />
                    <IconButton onClick={() => sourceInputRef.current?.click()} disabled={isRunning}>
                        <Folder className="w-4 h-4" />
                    </IconButton>
                </div>
            </FormRow>
            
            <FormRow label={t('audio.albums.destination')}>
                <div className="flex items-center space-x-2">
                    <Input 
                        placeholder={t('audio.albums.destinationPlaceholder')}
                        value={state.destinationPath} 
                        onChange={(e) => handleFieldChange('destinationPath', e.target.value)}
                        disabled={isRunning} 
                    />
                     {/* NOTE: Destination folder selection is not possible in browser. This button is for UI consistency. */}
                    <IconButton disabled={true}> 
                        <Folder className="w-4 h-4" />
                    </IconButton>
                </div>
            </FormRow>
            
            <FormRow label={t('audio.albums.count')}>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm">{t('audio.albums.albums')}:</span>
                        <Input 
                            type="number" 
                            min="1"
                            value={state.albums} 
                            onChange={e => handleFieldChange('albums', parseInt(e.target.value) || 1)}
                            className="w-20" 
                            disabled={isRunning} 
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm">{t('audio.albums.tracksPerAlbum')}:</span>
                        <Input 
                            type="number" 
                            min="1"
                            value={state.tracksPerAlbum} 
                            onChange={e => handleFieldChange('tracksPerAlbum', parseInt(e.target.value) || 1)}
                            className="w-20" 
                            disabled={isRunning} 
                        />
                    </div>
                </div>
            </FormRow>
        </div>
        
    </GroupBox>
    );
};