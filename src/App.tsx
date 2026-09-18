import React, { Component, ErrorInfo, ReactNode } from 'react';
import { KumbhProvider, useKumbh } from './store/kumbhStore';
import { Header } from './components/layout/Header';
import { ShahiSnanTicker } from './components/common/ShahiSnanTicker';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { HomeScreen } from './features/home/HomeScreen';
import { SmartMapView } from './features/map/SmartMapView';
import { SmartNavigation } from './features/navigation/SmartNavigation';
import { NearbyFacilities } from './features/facilities/NearbyFacilities';
import { AiAssistant } from './features/assistant/AiAssistant';
import { ItineraryPlanner } from './features/itinerary/ItineraryPlanner';
import { EmergencySection } from './features/emergency/EmergencySection';
import { CrowdOverview } from './features/crowd/CrowdOverview';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { FamilyGroupMode } from './features/family/FamilyGroupMode';
import { DemoPitchController } from './components/common/DemoPitchController';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Kumbh Saathi caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-600 mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected issue occurred while rendering this view.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const MainContent: React.FC = () => {
  const { activeTab } = useKumbh();

  switch (activeTab) {
    case 'home':
      return <HomeScreen />;
    case 'map':
      return <SmartMapView />;
    case 'navigation':
      return <SmartNavigation />;
    case 'facilities':
      return <NearbyFacilities />;
    case 'assistant':
      return <AiAssistant />;
    case 'itinerary':
      return <ItineraryPlanner />;
    case 'emergency':
      return <EmergencySection />;
    case 'crowd':
      return <CrowdOverview />;
    case 'admin':
      return <AdminDashboard />;
    case 'family':
      return <FamilyGroupMode />;
    default:
      return <HomeScreen />;
  }
};

export const App: React.FC = () => {
  return (
    <KumbhProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Header />
        <ShahiSnanTicker />
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            <ErrorBoundary>
              <MainContent />
            </ErrorBoundary>
          </main>
        </div>

        <BottomNav />
        <DemoPitchController />
      </div>
    </KumbhProvider>
  );
};

export default App;
