import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import { useKumbh } from '../../store/kumbhStore';
import { 
  X, 
  ShieldCheck, 
  Heart, 
  Phone, 
  MapPin, 
  Download, 
  Printer, 
  Scan, 
  QrCode, 
  AlertTriangle, 
  Check, 
  Sparkles,
  User,
  Activity,
  Users
} from 'lucide-react';

export interface PilgrimProfile {
  id: string;
  name: string;
  relationTag?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  medicalConditions: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  preferredLanguage: string;
  baseCampLocation: string;
  kumbhId: string;
}

// Mhaske Family Presets directly matching app's family group
const MHASKE_FAMILY_PRESETS: PilgrimProfile[] = [
  {
    id: 'sahil-me',
    name: 'Sahil Mhaske (You)',
    relationTag: 'Me (Student / Builder)',
    age: 21,
    gender: 'Male',
    bloodGroup: 'B+ Positive',
    medicalConditions: 'Active student / Nil medical risks',
    emergencyContactName: 'Vinod Mhaske (Dad)',
    emergencyContactPhone: '+919822011223',
    preferredLanguage: 'English, Marathi & Hindi',
    baseCampLocation: 'MET Bhujbal Knowledge City (Adgaon, Nashik)',
    kumbhId: 'KMB-2027-SAHIL-01'
  },
  {
    id: 'dad-vinod',
    name: 'Vinod Mhaske',
    relationTag: 'Dad / Father',
    age: 56,
    gender: 'Male',
    bloodGroup: 'B+ Positive',
    medicalConditions: 'Mild Hypertension (Carries Telmisartan 40mg)',
    emergencyContactName: 'Anita Mhaske (Wife)',
    emergencyContactPhone: '+919822011223',
    preferredLanguage: 'Marathi & Hindi',
    baseCampLocation: 'Gangapur Road, Anandvalli, Nashik',
    kumbhId: 'KMB-2027-DAD-7821'
  },
  {
    id: 'mom-anita',
    name: 'Anita Mhaske',
    relationTag: 'Mom / Mother',
    age: 52,
    gender: 'Female',
    bloodGroup: 'O+ Positive',
    medicalConditions: 'No known chronic conditions • General fitness',
    emergencyContactName: 'Vinod Mhaske (Husband)',
    emergencyContactPhone: '+919822011223',
    preferredLanguage: 'Marathi',
    baseCampLocation: 'Makhmalabad / Mhasrul Road Base, Nashik',
    kumbhId: 'KMB-2027-MOM-6419'
  },
  {
    id: 'brother-yash',
    name: 'Yash Mhaske',
    relationTag: 'Brother',
    age: 20,
    gender: 'Male',
    bloodGroup: 'B+ Positive',
    medicalConditions: 'Active student / Nil medical risks',
    emergencyContactName: 'Vinod Mhaske (Father)',
    emergencyContactPhone: '+919822011223',
    preferredLanguage: 'Marathi & English',
    baseCampLocation: 'West Anandvalli, Gangapur Road',
    kumbhId: 'KMB-2027-BRO-9102'
  },
  {
    id: 'grandpa-dattatraya',
    name: 'Dattatraya Mhaske',
    relationTag: 'Grandfather (Ajoba)',
    age: 78,
    gender: 'Male',
    bloodGroup: 'O+ Positive',
    medicalConditions: 'Type-2 Diabetic • Cardiac Stent (Carries Sorbitrate)',
    emergencyContactName: 'Vinod Mhaske (Son)',
    emergencyContactPhone: '+919822011223',
    preferredLanguage: 'Marathi',
    baseCampLocation: 'Tapovan Sadhugram, Sector 4, Tent B-12',
    kumbhId: 'KMB-2027-ELD-8842'
  }
];

const OTHER_DEMO_PRESETS: PilgrimProfile[] = [
  {
    id: 'child-aarav',
    name: 'Aarav Sachin Patil',
    relationTag: 'Lost Child Demo',
    age: 8,
    gender: 'Male',
    bloodGroup: 'B+ Positive',
    medicalConditions: 'Peanut allergy • Wears blue cap',
    emergencyContactName: 'Sachin Patil (Father)',
    emergencyContactPhone: '+919822144556',
    preferredLanguage: 'Marathi',
    baseCampLocation: 'MET Bhujbal Campus Adgaon, Block C',
    kumbhId: 'KMB-2027-CHD-10943'
  },
  {
    id: 'adult-sunita',
    name: 'Sunita Sharma',
    relationTag: 'Devotee Demo',
    age: 54,
    gender: 'Female',
    bloodGroup: 'A+ Positive',
    medicalConditions: 'Mild Asthma (Uses Inhaler) • Hypertension',
    emergencyContactName: 'Ramesh Sharma (Husband)',
    emergencyContactPhone: '+919422788990',
    preferredLanguage: 'Hindi & English',
    baseCampLocation: 'Shree Maheshwari Bhakt Niwas, Panchavati',
    kumbhId: 'KMB-2027-FAM-33291'
  }
];

interface PilgrimSafetyBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile?: Partial<PilgrimProfile>;
}

export const PilgrimSafetyBadgeModal: React.FC<PilgrimSafetyBadgeModalProps> = ({
  isOpen,
  onClose,
  initialProfile
}) => {
  const { familyMembers } = useKumbh();
  const [activeCategory, setActiveCategory] = useState<'family' | 'other'>('family');
  const [activePresetId, setActivePresetId] = useState<string>(MHASKE_FAMILY_PRESETS[0].id);
  const [profile, setProfile] = useState<PilgrimProfile>(MHASKE_FAMILY_PRESETS[0]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrMode, setQrMode] = useState<'text' | 'tel'>('text');
  const [simulatedScanOpen, setSimulatedScanOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Sync profile when preset changes or initialProfile passed
  useEffect(() => {
    if (initialProfile && initialProfile.name) {
      // Find matching preset or construct custom
      const matched = MHASKE_FAMILY_PRESETS.find(p => p.name.toLowerCase().includes(initialProfile.name!.toLowerCase())) ||
                      OTHER_DEMO_PRESETS.find(p => p.name.toLowerCase().includes(initialProfile.name!.toLowerCase()));
      if (matched) {
        setProfile(matched);
        setActivePresetId(matched.id);
      } else {
        setProfile({
          ...MHASKE_FAMILY_PRESETS[0],
          ...initialProfile
        });
        setActivePresetId('custom');
      }
    }
  }, [initialProfile]);

  const selectPreset = (preset: PilgrimProfile) => {
    setActivePresetId(preset.id);
    setProfile(preset);
  };

  // Generate real scannable QR code
  useEffect(() => {
    let payload = '';
    if (qrMode === 'tel') {
      payload = `tel:${profile.emergencyContactPhone}`;
    } else {
      payload = `🚨 KUMBH SAATHI EMERGENCY IDENTITY 🚨
Name: ${profile.name} (${profile.age}y, ${profile.gender})
Relation: ${profile.relationTag || 'Pilgrim'}
Blood Group: ${profile.bloodGroup}
Medical: ${profile.medicalConditions}
Guardian: ${profile.emergencyContactName} (${profile.emergencyContactPhone})
Base Camp: ${profile.baseCampLocation}
Language: ${profile.preferredLanguage}
ID: ${profile.kumbhId}
Nashik Emergency Police: 112 / 0253-2305233`;
    }

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('QR code generation error:', err));
  }, [profile, qrMode]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `Kumbh-Safety-Badge-${profile.name.replace(/\s+/g, '-')}.png`;
    link.click();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentPresets = activeCategory === 'family' ? MHASKE_FAMILY_PRESETS : OTHER_DEMO_PRESETS;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-auto max-h-[92vh] relative z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-saffron-600 to-amber-700 text-white p-4 sm:p-5 flex items-start justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-xl shrink-0">
              <QrCode className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Digital Kumbh Raksha Bandhan
                </h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30">
                  Family Safety Badge
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Wearable Smart Safety & Medical ID Badge with Offline Scannable Emergency QR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto text-xs text-slate-700">

          {/* Category Tabs: My Family vs Demo Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('family');
                    selectPreset(MHASKE_FAMILY_PRESETS[0]);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all ${
                    activeCategory === 'family' 
                      ? 'bg-amber-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>👨‍👩‍👧‍👦 Mhaske Family (4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('other');
                    selectPreset(OTHER_DEMO_PRESETS[0]);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all ${
                    activeCategory === 'other' 
                      ? 'bg-amber-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Other Demo Personas</span>
                </button>
              </div>

              <span className="text-[10px] text-amber-900 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 hidden sm:inline">
                {activeCategory === 'family' ? 'Mhaske Family Group Active' : 'Sample Presets'}
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {currentPresets.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    activePresetId === preset.id
                      ? 'bg-amber-50 border-amber-500 shadow-sm ring-2 ring-amber-400'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900 truncate flex items-center space-x-1">
                    <span>
                      {preset.id.includes('dad') ? '👨' : 
                       preset.id.includes('mom') ? '👩' : 
                       preset.id.includes('grandpa') || preset.id.includes('eld') ? '👴' : 
                       preset.id.includes('brother') ? '👦' : 
                       preset.id.includes('child') ? '🧒' : '👩'}
                    </span>
                    <span className="truncate">{preset.name.split(' ')[0]}</span>
                  </div>
                  <div className="text-[10px] text-amber-800 font-semibold truncate mt-0.5">
                    {preset.relationTag}
                  </div>
                  <div className="text-[9px] text-slate-500 truncate">
                    {preset.age} yrs • {preset.bloodGroup.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Test Live on Phone Callout */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Scan className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-blue-950 block text-xs">Judges Live Camera Test:</strong>
                <span className="text-[11px] text-blue-800">
                  Point any smartphone camera at the QR code below to scan live.
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-blue-200 shrink-0">
              <button
                type="button"
                onClick={() => setQrMode('text')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  qrMode === 'text' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Encodes full medical, camp, and emergency contact text"
              >
                Medical Card
              </button>
              <button
                type="button"
                onClick={() => setQrMode('tel')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  qrMode === 'tel' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Encodes direct phone dialer intent"
              >
                1-Tap Call
              </button>
            </div>
          </div>

          {/* Wearable Badge Preview Card */}
          <div 
            ref={badgeRef}
            className="bg-gradient-to-br from-white via-amber-50/25 to-orange-50/30 rounded-3xl border-2 border-amber-300 p-4 sm:p-5 shadow-lg space-y-4 relative overflow-hidden"
          >
            {/* Top Watermark & Authority Header */}
            <div className="flex items-start justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-serif text-lg font-black shadow-md shrink-0">
                  🕉️
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                    Nashik Kumbh Mela 2027 • Police & Disaster Cell
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-950">
                    Official Pilgrim Safety & Medical ID
                  </h4>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-slate-900 text-amber-300 rounded-md">
                  {profile.kumbhId}
                </span>
                <span className="block text-[9px] text-emerald-700 font-bold mt-0.5">
                  ✓ Verified In-Situ
                </span>
              </div>
            </div>

            {/* Badge Content Grid: Profile Info + Scannable QR Code */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              
              {/* Left Column: Details */}
              <div className="sm:col-span-7 space-y-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-bold text-sm">
                    {profile.id.includes('dad') ? '👨' : 
                     profile.id.includes('mom') ? '👩' : 
                     profile.id.includes('grandpa') ? '👴' : 
                     profile.id.includes('brother') ? '👦' : '👤'}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-950 flex items-center space-x-2">
                      <span>{profile.name}</span>
                      {profile.relationTag && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded border border-amber-300">
                          {profile.relationTag}
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {profile.age} Years • {profile.gender} • Speaks: {profile.preferredLanguage}
                    </p>
                  </div>
                </div>

                {/* Blood Group & Medical Alert */}
                <div className="bg-white/90 p-2.5 rounded-2xl border border-amber-200 space-y-1 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider flex items-center space-x-1">
                      <Heart className="w-3 h-3 text-rose-600" />
                      <span>Blood Group:</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-black text-[11px]">
                      {profile.bloodGroup}
                    </span>
                  </div>
                  <div className="flex items-start space-x-1.5 pt-1 text-[11px] text-slate-700">
                    <Activity className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Medical:</strong> {profile.medicalConditions}</span>
                  </div>
                </div>

                {/* Emergency Contact & Base Camp */}
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Guardian:</strong> {profile.emergencyContactName}</span>
                    <a 
                      href={`tel:${profile.emergencyContactPhone}`}
                      className="ml-auto px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded hover:bg-emerald-200"
                    >
                      {profile.emergencyContactPhone}
                    </a>
                  </div>

                  <div className="flex items-start space-x-1.5 text-[11px] text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Base Camp:</strong> {profile.baseCampLocation}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Res Real Scannable QR Code */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-inner">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Pilgrim Emergency QR Code" 
                    className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                    Generating QR...
                  </div>
                )}
                
                <div className="text-center mt-1.5">
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider flex items-center justify-center space-x-1">
                    <Scan className="w-3 h-3 text-amber-600" />
                    <span>Scan with Any Phone</span>
                  </span>
                  <span className="text-[9px] text-slate-500 block">
                    Zero App or Internet Required to Scan
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Security Footer */}
            <div className="bg-amber-100/70 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-2.5 px-4 flex items-center justify-between text-[10px] text-amber-950 font-medium border-t border-amber-200">
              <span>Mhaske Family Safety Registry • Central Police Lost & Found</span>
              <span className="font-bold">Emergency: 112 / 1077</span>
            </div>
          </div>

          {/* Simulated Scanner Outcome Preview */}
          {simulatedScanOpen && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-emerald-950">
                <span className="font-bold text-xs flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Volunteer / Police Mobile Scanner View:</span>
                </span>
                <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  MATCH CONFIRMED
                </span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                When scanned by any pilgrim or police constable, your screen immediately displays: 
                <strong> "{profile.name} ({profile.relationTag}, {profile.age}y)"</strong> with urgent medical alerts and 1-tap call to <strong>{profile.emergencyContactPhone}</strong>.
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <a
                  href={`tel:${profile.emergencyContactPhone}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] flex items-center space-x-1 shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Guardian ({profile.emergencyContactName})</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSimulatedScanOpen(false)}
                  className="text-slate-500 hover:text-slate-800 text-[11px] font-semibold px-2 py-1"
                >
                  Close Preview
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSimulatedScanOpen(!simulatedScanOpen)}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Scan className="w-3.5 h-3.5 text-indigo-600" />
            <span>{simulatedScanOpen ? 'Hide Scanner View' : '⚡ Simulate Volunteer Scan'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Wristband</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{copied ? 'Downloaded!' : 'Save QR Badge'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
