import React from 'react';
import { useNexora } from '../context/NexoraContext';
import { AndroidFrame } from '../components/AndroidFrame';
import { UserHeader } from './components/UserHeader';
import { UserBottomNav } from './components/UserBottomNav';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { MobileCheckoutModal } from './components/MobileCheckoutModal';
import { CreatePostModal } from './components/CreatePostModal';
import { UserHomeView } from './views/UserHomeView';
import { UserFeedView } from './views/UserFeedView';
import { UserShopView } from './views/UserShopView';
import { UserProfileView } from './views/UserProfileView';
import { MissionsView } from '../views/MissionsView';
import { LobbyModal } from '../components/LobbyModal';
import { NexoraDrawer } from '../components/NexoraDrawer';
import { PlayerProfileModal } from '../components/PlayerProfileModal';
import { CreatorProfileModal } from '../components/CreatorProfileModal';
import { CyberDashGame } from '../components/CyberDashGame';
import { QuantumMatrixGame } from '../components/QuantumMatrixGame';

export const UserAppRoot: React.FC = () => {
  const { activeTab, activePlayingMission, exitGame, activeThemePreset } = useNexora();

  // If a mission is actively being played, display arcade canvas
  if (activePlayingMission) {
    if (activePlayingMission.playableType === 'matrix') {
      return <QuantumMatrixGame mission={activePlayingMission} onExit={exitGame} />;
    }
    return <CyberDashGame mission={activePlayingMission} onExit={exitGame} />;
  }

  return (
    <AndroidFrame>
      <div
        className="flex-1 flex flex-col overflow-hidden relative"
        style={{
          backgroundColor: activeThemePreset.backgroundColor,
          color: activeThemePreset.textColor,
        }}
      >
        {/* User Application Header (No admin leak, no global LV) */}
        <UserHeader />

        {/* User Views */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'home' && <UserHomeView />}
          {activeTab === 'feed' && <UserFeedView />}
          {activeTab === 'missions' && <MissionsView />}
          {activeTab === 'shop' && <UserShopView />}
          {activeTab === 'profile' && <UserProfileView />}
        </main>

        {/* Bottom Ergonomic Navigation Bar */}
        <UserBottomNav />

        {/* User Modals */}
        <UniversalSearchModal />
        <MobileCheckoutModal />
        <CreatePostModal />
        <LobbyModal />
        <NexoraDrawer />
        <PlayerProfileModal />
        <CreatorProfileModal />
      </div>
    </AndroidFrame>
  );
};
