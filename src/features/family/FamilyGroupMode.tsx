import React, { useState } from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { SmartMap } from '../../components/map/SmartMap';
import { FamilyMember } from '../../types';
import { PilgrimSafetyBadgeModal } from '../../components/common/PilgrimSafetyBadgeModal';
import { 
  Users, 
  Battery, 
  MapPin, 
  Navigation, 
  Clock, 
  UserPlus, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  QrCode,
  Sparkles
} from 'lucide-react';

export const FamilyGroupMode: React.FC = () => {
  const { familyMembers, navigateToPlace } = useKumbh();
  const [groupName, setGroupName] = useState('Mhaske Family (Nashik)');
  const [invited, setInvited] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [selectedBadgeProfile, setSelectedBadgeProfile] = useState<any>(null);

  const openBadgeModal = (member?: FamilyMember) => {
    if (member) {
      setSelectedBadgeProfile({
        name: member.name,
        emergencyContactName: 'Family Guardian',
        emergencyContactPhone: '+919823012345',
        baseCampLocation: member.locationNote,
        kumbhId: `KMB-2027-${member.relation.substring(0, 3).toUpperCase()}-4821`
      });
    } else {
      setSelectedBadgeProfile(null);
    }
    setIsBadgeModalOpen(true);
  };

  const handleNavigateToMember = (member: FamilyMember) => {
    // Create a temporary place object for navigation
    navigateToPlace({
      id: member.id,
      name: `${member.name} (${member.relation})`,
      category: 'temple',
      lat: member.lat,
      lng: member.lng,
      locationName: member.locationNote,
      description: `Live family member location. Battery: ${member.batteryLevel}%. Status: ${member.status}.`,
      facilities: ['Live GPS Ping', 'Battery Status', 'Direct Compass Tracking'],
      accessibility: {
        wheelchairAccessible: true,
        hasRamps: true,
        hasStairsOnly: false,
        elderlyFriendlyScore: 8,
        accessibilityNotes: 'Follow low-crowd path to rendezvous.'
      },
      openStatus: 'open',
      openHours: 'Continuous live tracking',
      currentCrowdLevel: 'LOW',
      currentWaitMinutes: 0
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Prototype Demo • Simulated Location Sharing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Users className="w-6 h-6 text-saffron-600" />
            <span>Family & Group Safety Tracker</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of elderly parents and family members amidst large Kumbh Mela crowds
          </p>
        </div>

        <button
          onClick={() => {
            setInvited(true);
            setTimeout(() => setInvited(false), 3000);
          }}
          className="self-start sm:self-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-all active:scale-95"
        >
          {invited ? <Check className="w-4 h-4 text-emerald-400" /> : <UserPlus className="w-4 h-4" />}
          <span>{invited ? 'Invite Link Copied!' : '+ Add Family Member'}</span>
        </button>
      </div>

      {/* USP Hero Banner: Digital Kumbh Raksha Bandhan */}
      <div className="bg-gradient-to-r from-amber-600 via-saffron-600 to-amber-700 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-amber-400/30">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white shrink-0 shadow-md">
            <QrCode className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30">
                ⭐ Top Judge USP
              </span>
              <span className="text-xs font-bold text-amber-100">Live Scannable Demo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
              Digital Kumbh Raksha Bandhan
            </h2>
            <p className="text-xs text-amber-100 mt-1 max-w-xl leading-relaxed">
              Smart wearable digital ID & medical badge with offline scannable QR code. Helps reunite lost elders & children with one phone scan!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openBadgeModal()}
          className="bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white font-extrabold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95 shrink-0 border border-amber-500/40"
        >
          <QrCode className="w-4 h-4 text-amber-400" />
          <span>Generate Safety QR Badge</span>
        </button>
      </div>

      {/* Active Group Card */}
      <div className="bg-gradient-to-r from-saffron-500 to-amber-500 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-saffron-100">
            Active Temporary Group
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-0.5">
            {groupName}
          </h2>
          <p className="text-xs text-saffron-100 mt-1">
            4 Connected Members • All active within Panchavati sector
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-2xl text-xs font-semibold self-start sm:self-auto">
          Auto-ping: Every 30s
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {familyMembers.map(member => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {member.avatarUrl ? (
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md ring-2 ring-amber-100 shrink-0">
                      <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  ) : member.badgeText === 'R' || member.relation.toLowerCase().includes('mother') ? (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 text-white font-black text-xl flex items-center justify-center shadow-md ring-2 ring-purple-100 shrink-0">
                      R
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white font-black text-xl flex items-center justify-center shadow-md ring-2 ring-indigo-100 shrink-0">
                      {member.badgeText || 'Y'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                    <span className="text-xs text-saffron-700 font-bold tracking-wide">
                      {member.relation} {member.badgeText ? `[Pin: ${member.badgeText}]` : ''}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  member.status === 'safe' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {member.status === 'safe' ? '✓ Safe' : 'Moving'}
                </span>
              </div>

              {/* Location Note */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{member.locationNote}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Last updated: {member.lastSeenTime}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-600 font-medium">
                    <Battery className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{member.batteryLevel}%</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => handleNavigateToMember(member)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-saffron-400" />
                <span>Navigate</span>
              </button>
              <button
                type="button"
                onClick={() => openBadgeModal(member)}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors"
                title="View Wearable Safety QR Badge"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-700" />
                <span>QR Badge</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Map Overview */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Family Rendezvous Map
          </h2>
          <span className="text-xs text-slate-400">
            Live simulated GPS pins
          </span>
        </div>
        <div className="h-[380px] rounded-2xl overflow-hidden border border-slate-200">
          <SmartMap />
        </div>
      </div>

      {/* Safety Badge Modal */}
      <PilgrimSafetyBadgeModal 
        isOpen={isBadgeModalOpen} 
        onClose={() => setIsBadgeModalOpen(false)} 
        initialProfile={selectedBadgeProfile} 
      />

    </div>
  );
};
