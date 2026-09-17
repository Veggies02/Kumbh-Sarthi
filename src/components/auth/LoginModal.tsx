import React, { useState } from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { 
  X, 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  KeyRound, 
  Phone, 
  UserPlus, 
  LogIn, 
  CheckCircle2, 
  Sparkles, 
  Fingerprint
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    currentFamily, 
    switchDemoUser, 
    loginPilgrimByPhone, 
    registerPilgrim, 
    loginPolice,
    logout
  } = useKumbh();

  const [activeTab, setActiveTab] = useState<'switch' | 'pilgrim' | 'police'>('switch');
  const [pilgrimMode, setPilgrimMode] = useState<'login' | 'register'>('login');
  
  // Pilgrim Login Form
  const [loginPhone, setLoginPhone] = useState('+91 98220 11223');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Pilgrim Registration Form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [familyAction, setFamilyAction] = useState<'create' | 'join'>('join');
  const [regFamilyCode, setRegFamilyCode] = useState('MHASKE-2027');
  const [regFamilyName, setRegFamilyName] = useState('');
  const [regRelation, setRegRelation] = useState('Family Member');
  const [regBaseCamp, setRegBaseCamp] = useState('Panchavati Camp');
  const [regBloodGroup, setRegBloodGroup] = useState('B+ Positive');
  const [regMedical, setRegMedical] = useState('Nil');
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);

  // Police Login Form
  const [policeBadge, setPoliceBadge] = useState('MH-15-POLICE-041');
  const [policePin, setPolicePin] = useState('1122');
  const [policeError, setPoliceError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePilgrimLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = loginPilgrimByPhone(loginPhone);
    if (res.success) {
      onClose();
    } else {
      setLoginError(res.message || 'Login failed');
    }
  };

  const handlePilgrimRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!regName.trim() || !regPhone.trim()) {
      setLoginError('Please provide both name and phone number.');
      return;
    }

    const res = registerPilgrim({
      name: regName.trim(),
      phone: regPhone.trim(),
      familyCodeAction: familyAction,
      familyCode: familyAction === 'join' ? regFamilyCode.trim() : undefined,
      familyName: familyAction === 'create' ? regFamilyName.trim() : undefined,
      relation: regRelation,
      baseCamp: regBaseCamp,
      bloodGroup: regBloodGroup,
      medicalNotes: regMedical
    });

    if (res.success) {
      setRegSuccessMsg('Account & Family Group created successfully!');
      setTimeout(() => {
        setRegSuccessMsg(null);
        onClose();
      }, 1200);
    } else {
      setLoginError(res.message || 'Registration failed');
    }
  };

  const handlePoliceLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPoliceError(null);
    const res = loginPolice(policeBadge, policePin);
    if (res.success) {
      onClose();
    } else {
      setPoliceError(res.message || 'Police authorization failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-3 sm:p-4 flex justify-center min-h-screen animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[88vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 sm:p-5 text-white flex items-center justify-between relative shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-saffron-500/20 border border-saffron-400/30 flex items-center justify-center text-saffron-400 shrink-0">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-tight">Kumbh Saathi Identity & Access</h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SQLite / IndexedDB Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Role-based partition: Pilgrim Family Circles vs. Police War Room
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active User Banner */}
        <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center space-x-2 text-amber-950">
            <span className="font-semibold text-slate-600">Active Session:</span>
            <span className="font-bold text-amber-900">{currentUser.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
              currentUser.role === 'police_admin' ? 'bg-indigo-600 text-white' : 'bg-saffron-600 text-white'
            }`}>
              {currentUser.role === 'police_admin' ? 'Police Authority' : 'Pilgrim'}
            </span>
            {currentFamily && currentUser.role === 'pilgrim' && (
              <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-amber-300 font-black text-amber-900">
                Code: {currentFamily.familyCode}
              </span>
            )}
          </div>
          <button
            onClick={logout}
            className="text-[11px] text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
          >
            Switch User / Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('switch')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'switch'
                ? 'bg-white text-saffron-700 border-saffron-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Judge 1-Click Fast Switcher</span>
          </button>

          <button
            onClick={() => setActiveTab('pilgrim')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'pilgrim'
                ? 'bg-white text-saffron-700 border-saffron-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-saffron-600" />
            <span>Pilgrim Registration & Family Codes</span>
          </button>

          <button
            onClick={() => setActiveTab('police')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'police'
                ? 'bg-white text-indigo-700 border-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
            <span>Police ICCC Portal Login</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0 space-y-4">
          
          {/* TAB 1: 1-CLICK FAST SWITCHER FOR JUDGES */}
          {activeTab === 'switch' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl text-xs text-indigo-900 flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>How Families are Differentiated in Database:</strong>
                  <p className="mt-1 text-slate-700">
                    Each pilgrim is assigned to a distinct <code className="bg-white px-1 py-0.5 rounded font-mono font-bold text-indigo-800">familyId</code> and shares a secure <code className="bg-white px-1 py-0.5 rounded font-mono font-bold text-indigo-800">familyCode</code> (e.g. <strong>MHASKE-2027</strong>). Members only see live GPS, low battery, and alert pins belonging strictly to their family code. Police accounts bypass family silos to monitor city-wide crowd density.
                  </p>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Persona to Demonstrate:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Preset: Sahil (You) */}
                <button
                  onClick={() => { switchDemoUser('me'); onClose(); }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    currentUser.id === 'user-sahil-me' || currentUser.id === 'user-vedant-me'
                      ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-400'
                      : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg border border-emerald-300">
                      ⭐
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <div className="text-xs font-extrabold text-slate-900">Sahil Mhaske (You)</div>
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 uppercase">You</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">MET Bhujbal Campus Base</div>
                      <div className="text-[10px] text-slate-500">Code: MHASKE-2027 • Battery 96%</div>
                    </div>
                  </div>
                  {(currentUser.id === 'user-sahil-me' || currentUser.id === 'user-vedant-me') && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </button>

                {/* Preset: Dad */}
                <button
                  onClick={() => { switchDemoUser('dad'); onClose(); }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    currentUser.id === 'user-vinod-dad'
                      ? 'border-saffron-500 bg-saffron-50 shadow-md ring-2 ring-saffron-400'
                      : 'border-slate-200 hover:border-saffron-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center font-black text-lg border border-saffron-300">
                      V
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Vinod Mhaske (Dad)</div>
                      <div className="text-[11px] text-saffron-700 font-semibold">Head of Family • Guardian</div>
                      <div className="text-[10px] text-slate-500">Gangapur Rd • Battery 78%</div>
                    </div>
                  </div>
                  {currentUser.id === 'user-vinod-dad' && (
                    <CheckCircle2 className="w-5 h-5 text-saffron-600" />
                  )}
                </button>

                {/* Preset: Brother Yash */}
                <button
                  onClick={() => { switchDemoUser('brother'); onClose(); }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    currentUser.id === 'user-yash-bro'
                      ? 'border-saffron-500 bg-saffron-50 shadow-md ring-2 ring-saffron-400'
                      : 'border-slate-200 hover:border-saffron-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg border border-indigo-300">
                      Y
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Yash Mhaske (Brother)</div>
                      <div className="text-[11px] text-indigo-700 font-semibold">Son / Active Member</div>
                      <div className="text-[10px] text-slate-500">Code: MHASKE-2027 • Battery 91%</div>
                    </div>
                  </div>
                  {currentUser.id === 'user-yash-bro' && (
                    <CheckCircle2 className="w-5 h-5 text-saffron-600" />
                  )}
                </button>

                {/* Preset: Mother Anita */}
                <button
                  onClick={() => { switchDemoUser('mom'); onClose(); }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    currentUser.id === 'user-anita-mom'
                      ? 'border-saffron-500 bg-saffron-50 shadow-md ring-2 ring-saffron-400'
                      : 'border-slate-200 hover:border-saffron-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-lg border border-purple-300">
                      R
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Anita Mhaske (Mom)</div>
                      <div className="text-[11px] text-purple-700 font-semibold">Mother • Safe Zone</div>
                      <div className="text-[10px] text-slate-500">Code: MHASKE-2027 • Battery 64%</div>
                    </div>
                  </div>
                  {currentUser.id === 'user-anita-mom' && (
                    <CheckCircle2 className="w-5 h-5 text-saffron-600" />
                  )}
                </button>

                {/* Preset: Grandpa Dattatraya */}
                <button
                  onClick={() => { switchDemoUser('grandpa'); onClose(); }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    currentUser.id === 'user-dattatraya-grandpa'
                      ? 'border-saffron-500 bg-saffron-50 shadow-md ring-2 ring-saffron-400'
                      : 'border-slate-200 hover:border-saffron-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg border border-amber-300">
                      D
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Dattatraya Mhaske (Grandpa)</div>
                      <div className="text-[11px] text-amber-700 font-semibold">Elderly • High Medical Attention</div>
                      <div className="text-[10px] text-slate-500">Tapovan Tent B-12 • Battery 42%</div>
                    </div>
                  </div>
                  {currentUser.id === 'user-dattatraya-grandpa' && (
                    <CheckCircle2 className="w-5 h-5 text-saffron-600" />
                  )}
                </button>

                {/* Preset: Police Authority */}
                <button
                  onClick={() => { switchDemoUser('police'); onClose(); }}
                  className={`sm:col-span-2 p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    currentUser.role === 'police_admin'
                      ? 'border-indigo-600 bg-indigo-950 text-white shadow-xl ring-2 ring-indigo-500'
                      : 'border-slate-300 hover:border-indigo-500 bg-gradient-to-r from-slate-900 to-indigo-950 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg border border-indigo-400">
                      👮
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-wide text-white">
                        Insp. S. K. Shinde (Nashik Police Authority)
                      </div>
                      <div className="text-[11px] text-indigo-300 font-semibold">
                        Badge: MH-15-POLICE-041 • Panchavati ICCC War Room
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Full Command Over Helbing Physics, AI CCTV Bounding Boxes & Barricades
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded bg-indigo-500 text-white">
                      Enter War Room →
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PILGRIM LOGIN & REGISTRATION */}
          {activeTab === 'pilgrim' && (
            <div className="space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setPilgrimMode('login')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    pilgrimMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Login by Registered Phone
                </button>
                <button
                  onClick={() => setPilgrimMode('register')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    pilgrimMode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Register New Pilgrim & Family
                </button>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {loginError}
                </div>
              )}

              {regSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{regSuccessMsg}</span>
                </div>
              )}

              {pilgrimMode === 'login' ? (
                <form onSubmit={handlePilgrimLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="+91 98220 11223"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Demo test phones: <code>+91 98220 11220</code> (You / Sahil), <code>+91 98220 11223</code> (Dad), <code>+91 98220 11225</code> (Brother Yash)
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login & Sync Family Tracker</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePilgrimRegister} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Ramesh Kulkarni"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-saffron-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-saffron-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Family Code Partition Selector */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-900">
                      Family Group Association
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFamilyAction('join')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          familyAction === 'join' 
                            ? 'bg-saffron-50 border-saffron-400 text-saffron-800' 
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        Join Existing (Enter Code)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFamilyAction('create')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          familyAction === 'create' 
                            ? 'bg-saffron-50 border-saffron-400 text-saffron-800' 
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        Create New Family
                      </button>
                    </div>

                    {familyAction === 'join' ? (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Enter 6-digit Family Code
                        </label>
                        <input
                          type="text"
                          value={regFamilyCode}
                          onChange={(e) => setRegFamilyCode(e.target.value)}
                          placeholder="e.g. MHASKE-2027"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-saffron-500"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Tip: Use <strong>MHASKE-2027</strong> to join the Mhaske family circle.
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            New Family Group Name
                          </label>
                          <input
                            type="text"
                            value={regFamilyName}
                            onChange={(e) => setRegFamilyName(e.target.value)}
                            placeholder="e.g. Sharma Family (Nashik)"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                      <select
                        value={regBloodGroup}
                        onChange={(e) => setRegBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      >
                        <option>A+ Positive</option>
                        <option>B+ Positive</option>
                        <option>O+ Positive</option>
                        <option>AB+ Positive</option>
                        <option>O- Negative</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Relation in Family</label>
                      <input
                        type="text"
                        value={regRelation}
                        onChange={(e) => setRegRelation(e.target.value)}
                        placeholder="e.g. Son / Mother / Father"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all active:scale-95"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>Complete Registration & Generate Safety QR</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: POLICE ICCC ACCESS */}
          {activeTab === 'police' && (
            <div className="space-y-4">
              <div className="bg-indigo-950 text-indigo-100 p-4 rounded-2xl border border-indigo-800 flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-extrabold tracking-wide text-white uppercase text-[11px]">
                    Maharashtra Police • Nashik Kumbh Security Cell
                  </span>
                  <p className="text-indigo-200/80 leading-relaxed">
                    Dedicated Police ICCC portal for crowd dispatch, live YOLO computer vision CCTV monitoring, Helbing stampede physics modeling, and city-wide road barrier actuation.
                  </p>
                </div>
              </div>

              {policeError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {policeError}
                </div>
              )}

              <form onSubmit={handlePoliceLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Police Official Badge ID
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={policeBadge}
                      onChange={(e) => setPoliceBadge(e.target.value)}
                      placeholder="MH-15-POLICE-041"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Command Station Security PIN
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      value={policePin}
                      onChange={(e) => setPolicePin(e.target.value)}
                      placeholder="••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Demo Official PIN: <code>1122</code>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-800 hover:to-indigo-950 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95 border border-indigo-500/40"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Authorize & Enter Police Command War Room</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
