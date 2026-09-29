import React from 'react';
import { NexoraPlayConsole } from '../../components/NexoraPlayConsole';

export const AdminGamesStudioView: React.FC = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Embedded NEXORA Play Console (Exclusively Admin) */}
      <NexoraPlayConsole />
    </div>
  );
};
