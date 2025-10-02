
import React, { useState } from 'react';
import { CalendarDays, PlusCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from '../i18n';

const sampleEvents = [
  { id: 1, date: '2024-08-15', title: 'Release "Starlight Echo"', type: 'Release' },
  { id: 2, date: '2024-08-20', title: 'Photoshoot for Album Art', type: 'Task' },
  { id: 3, date: '2024-08-22', title: 'Final Mixdown Session', type: 'Session' },
  { id: 4, date: '2024-09-01', title: 'Music Video Shoot', type: 'Task' },
];


export const PlannerPage: React.FC<{ addLog: (message: string) => void; }> = ({ addLog }) => {
  const { t } = useTranslation();
  const [selectedEventId, setSelectedEventId] = useState(1);
  const selectedEvent = sampleEvents.find(e => e.id === selectedEventId);

  React.useEffect(() => {
    addLog("Planner page loaded.");
  }, [addLog]);

  return (
    <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold flex items-center"><CalendarDays className="w-8 h-8 mr-3 text-[#A0ACC0]"/> {t('sidebar.planner')}</h1>
            <button className="flex items-center space-x-2 bg-[#3882F6] hover:bg-[#50A0FF] px-4 py-2 rounded-lg transition font-semibold">
                <PlusCircle className="w-5 h-5" />
                <span>New Event</span>
            </button>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-6">
            <aside className="col-span-1 bg-[#1E232B] border border-[#38414F] rounded-xl p-4 space-y-2 overflow-y-auto">
                {sampleEvents.map(event => (
                    <div 
                        key={event.id}
                        onClick={() => setSelectedEventId(event.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedEventId === event.id ? 'bg-[#3882F6]' : 'hover:bg-[#313843]'}`}
                    >
                        <p className="font-bold">{event.title}</p>
                        <p className="text-sm text-[#A0ACC0]">{event.date} - {event.type}</p>
                    </div>
                ))}
            </aside>
            <main className="col-span-2 bg-[#1E232B] border border-[#38414F] rounded-xl p-6">
                {selectedEvent ? (
                    <div>
                        <p className="text-sm text-[#50A0FF] font-semibold">{selectedEvent.date}</p>
                        <h2 className="text-2xl font-bold mt-1">{selectedEvent.title}</h2>
                        <div className="mt-6 border-t border-[#38414F] pt-4 space-y-3">
                            <h3 className="font-semibold">Checklist</h3>
                            <label className="flex items-center space-x-2 text-[#A0ACC0]"><CheckCircle className="w-5 h-5 text-green-500" /> <span>Confirm studio booking</span></label>
                            <label className="flex items-center space-x-2 text-[#A0ACC0]"><CheckCircle className="w-5 h-5 text-green-500" /> <span>Send final master to distributor</span></label>
                            <label className="flex items-center space-x-2 text-gray-500"><CheckCircle className="w-5 h-5 text-gray-600" /> <span>Prepare social media posts</span></label>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Select an event to see details.</div>
                )}
            </main>
        </div>
    </div>
  );
};