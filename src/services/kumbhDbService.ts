// Persistent Database Service for Kumbh Saathi
// Offline-first architecture using LocalStorage + IndexedDB caching

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: 'pilgrim' | 'police_admin';
  familyId?: string;
  familyRole?: 'guardian' | 'member';
  relation?: string;
  avatarUrl?: string;
  batteryLevel?: number;
  lat?: number;
  lng?: number;
  locationNote?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  medicalConditions?: string;
  badgeNumber?: string; // For police
  stationJurisdiction?: string; // For police
  status?: 'safe' | 'moving' | 'alert';
}

export interface FamilyGroup {
  id: string;
  familyCode: string; // e.g. "MHASKE-2027"
  familyName: string;
  guardianId: string;
  members: string[]; // User IDs
  baseCampLocation: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  USERS: 'kumbh_db_users_v1',
  FAMILIES: 'kumbh_db_families_v1',
  CURRENT_SESSION: 'kumbh_db_session_v1'
};

// Initial Seed Data: Mhaske Family & Nashik Police
const SEED_FAMILIES: FamilyGroup[] = [
  {
    id: 'fam-mhaske-2027',
    familyCode: 'MHASKE-2027',
    familyName: 'Mhaske Family (Nashik)',
    guardianId: 'user-vinod-dad',
    members: ['user-sahil-me', 'user-vinod-dad', 'user-anita-mom', 'user-yash-bro', 'user-dattatraya-grandpa'],
    baseCampLocation: 'Gangapur Road, Anandvalli Base Camp',
    createdAt: '2026-09-17'
  },
  {
    id: 'fam-patil-1094',
    familyCode: 'PATIL-1094',
    familyName: 'Patil Family (Pune)',
    guardianId: 'user-sachin-patil',
    members: ['user-sachin-patil', 'user-aarav-patil'],
    baseCampLocation: 'MET Bhujbal Campus Adgaon, Block C',
    createdAt: '2026-09-17'
  }
];

const SEED_USERS: UserProfile[] = [
  {
    id: 'user-sahil-me',
    name: 'Sahil Mhaske (You)',
    phone: '+91 98220 11220',
    role: 'pilgrim',
    familyId: 'fam-mhaske-2027',
    familyRole: 'member',
    relation: 'Me (Son / Hackathon Builder)',
    batteryLevel: 96,
    lat: 20.0468,
    lng: 73.8582,
    locationNote: 'MET Bhujbal Knowledge City (Adgaon Campus)',
    avatarUrl: '',
    emergencyContact: 'Vinod Mhaske (Dad)',
    emergencyPhone: '+91 98220 11223',
    bloodGroup: 'B+ Positive',
    medicalConditions: 'Active / Nil Risks',
    status: 'safe'
  },
  {
    id: 'user-vinod-dad',
    name: 'Vinod Mhaske (Dad)',
    phone: '+91 98220 11223',
    role: 'pilgrim',
    familyId: 'fam-mhaske-2027',
    familyRole: 'guardian',
    relation: 'Father (Head of Family)',
    batteryLevel: 78,
    lat: 20.0125,
    lng: 73.7550,
    locationNote: 'Gangapur Road, Anandvalli',
    avatarUrl: '/avatars/dad_avatar.png',
    emergencyContact: 'Anita Mhaske (Wife)',
    emergencyPhone: '+91 98220 11224',
    bloodGroup: 'B+ Positive',
    medicalConditions: 'Mild Hypertension (Telmisartan 40mg)',
    status: 'safe'
  },
  {
    id: 'user-anita-mom',
    name: 'Anita Mhaske (Mom)',
    phone: '+91 98220 11224',
    role: 'pilgrim',
    familyId: 'fam-mhaske-2027',
    familyRole: 'member',
    relation: 'Mother',
    batteryLevel: 64,
    lat: 20.0385,
    lng: 73.7820,
    locationNote: 'Makhmalabad / Mhasrul Road',
    emergencyContact: 'Vinod Mhaske (Husband)',
    emergencyPhone: '+91 98220 11223',
    bloodGroup: 'O+ Positive',
    medicalConditions: 'General Fitness / Nil Risks',
    status: 'safe'
  },
  {
    id: 'user-yash-bro',
    name: 'Yash Mhaske (Brother)',
    phone: '+91 98220 11225',
    role: 'pilgrim',
    familyId: 'fam-mhaske-2027',
    familyRole: 'member',
    relation: 'Brother',
    batteryLevel: 91,
    lat: 20.0080,
    lng: 73.7380,
    locationNote: 'West Anandvalli, Gangapur Road',
    emergencyContact: 'Vinod Mhaske (Father)',
    emergencyPhone: '+91 98220 11223',
    bloodGroup: 'B+ Positive',
    medicalConditions: 'Active / Nil Risks',
    status: 'moving'
  },
  {
    id: 'user-dattatraya-grandpa',
    name: 'Dattatraya Mhaske (Grandpa)',
    phone: '+91 98220 11226',
    role: 'pilgrim',
    familyId: 'fam-mhaske-2027',
    familyRole: 'member',
    relation: 'Grandfather (Ajoba)',
    batteryLevel: 42,
    lat: 20.0010,
    lng: 73.8180,
    locationNote: 'Tapovan Sadhugram, Sector 4, Tent B-12',
    emergencyContact: 'Vinod Mhaske (Son)',
    emergencyPhone: '+91 98220 11223',
    bloodGroup: 'O+ Positive',
    medicalConditions: 'Type-2 Diabetic • Cardiac Stent',
    status: 'safe'
  },
  // Police Official
  {
    id: 'user-police-shinde',
    name: 'Insp. S. K. Shinde',
    phone: '+91 98230 99112',
    role: 'police_admin',
    badgeNumber: 'MH-15-POLICE-041',
    stationJurisdiction: 'Panchavati Police Station & Ram Kund Command',
    emergencyContact: 'Nashik Police Control (112)',
    emergencyPhone: '02532305233',
    bloodGroup: 'AB+ Positive',
    status: 'safe'
  }
];

class KumbhDatabaseService {
  private users: UserProfile[] = [];
  private families: FamilyGroup[] = [];
  private currentSession: UserProfile | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const storedFamilies = localStorage.getItem(STORAGE_KEYS.FAMILIES);
      const storedSession = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);

      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
        // Ensure user-sahil-me and all seed users are present even if previous DB exists
        // Also upgrade any previous user-vedant-me to user-sahil-me
        this.users = this.users.map(u => {
          if (u.id === 'user-vedant-me' || u.name.includes('Vedant')) {
            return { ...u, id: 'user-sahil-me', name: 'Sahil Mhaske (You)' };
          }
          return u;
        });

        SEED_USERS.forEach(seed => {
          if (!this.users.some(u => u.id === seed.id)) {
            this.users.push(seed);
          }
        });
        this.saveUsers();
      } else {
        this.users = [...SEED_USERS];
        this.saveUsers();
      }

      if (storedFamilies) {
        this.families = JSON.parse(storedFamilies);
        const mhaskeFam = this.families.find(f => f.id === 'fam-mhaske-2027');
        if (mhaskeFam) {
          mhaskeFam.members = mhaskeFam.members.map(m => m === 'user-vedant-me' ? 'user-sahil-me' : m);
          if (!mhaskeFam.members.includes('user-sahil-me')) {
            mhaskeFam.members.unshift('user-sahil-me');
          }
          this.saveFamilies();
        }
      } else {
        this.families = [...SEED_FAMILIES];
        this.saveFamilies();
      }

      if (storedSession) {
        this.currentSession = JSON.parse(storedSession);
      } else {
        // Default session: Dad (Vinod Mhaske)
        this.currentSession = this.users[0];
        this.saveSession();
      }
    } catch {
      this.users = [...SEED_USERS];
      this.families = [...SEED_FAMILIES];
      this.currentSession = this.users[0];
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
    } catch {}
  }

  private saveFamilies() {
    try {
      localStorage.setItem(STORAGE_KEYS.FAMILIES, JSON.stringify(this.families));
    } catch {}
  }

  private saveSession() {
    try {
      if (this.currentSession) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(this.currentSession));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
      }
    } catch {}
  }

  // Session & User Methods
  public getCurrentUser(): UserProfile {
    return this.currentSession || this.users[0];
  }

  public setCurrentUser(user: UserProfile) {
    this.currentSession = user;
    this.saveSession();
  }

  public getAllUsers(): UserProfile[] {
    return [...this.users];
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.users.find(u => u.id === id);
  }

  // Family Separation Methods
  public getFamilyById(familyId: string): FamilyGroup | undefined {
    return this.families.find(f => f.id === familyId);
  }

  public getFamilyByCode(code: string): FamilyGroup | undefined {
    return this.families.find(f => f.familyCode.trim().toUpperCase() === code.trim().toUpperCase());
  }

  public getFamilyMembers(familyId: string): UserProfile[] {
    return this.users.filter(u => u.familyId === familyId);
  }

  // Register a new Pilgrim
  public registerPilgrim(userData: {
    name: string;
    phone: string;
    familyCodeAction: 'create' | 'join';
    familyCode?: string;
    familyName?: string;
    baseCamp?: string;
    bloodGroup?: string;
    medicalNotes?: string;
    relation?: string;
  }): { success: boolean; user?: UserProfile; message?: string } {
    const existing = this.users.find(u => u.phone === userData.phone);
    if (existing) {
      this.currentSession = existing;
      this.saveSession();
      return { success: true, user: existing, message: 'Welcome back! Logged in successfully.' };
    }

    const userId = `user-${Date.now()}`;
    let familyId = '';
    let familyRole: 'guardian' | 'member' = 'member';

    if (userData.familyCodeAction === 'create') {
      const cleanName = userData.familyName || `${userData.name.split(' ')[0]}'s Family`;
      const generatedCode = `${cleanName.split(' ')[0].toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      familyId = `fam-${Date.now()}`;
      familyRole = 'guardian';

      const newFamily: FamilyGroup = {
        id: familyId,
        familyCode: generatedCode,
        familyName: cleanName,
        guardianId: userId,
        members: [userId],
        baseCampLocation: userData.baseCamp || 'Panchavati Base Camp',
        createdAt: new Date().toISOString()
      };
      this.families.push(newFamily);
      this.saveFamilies();
    } else {
      // Join existing by code
      const targetFamily = this.getFamilyByCode(userData.familyCode || '');
      if (!targetFamily) {
        return { success: false, message: `Invalid Family Code "${userData.familyCode}". Please check with your family guardian.` };
      }
      familyId = targetFamily.id;
      familyRole = 'member';
      if (!targetFamily.members.includes(userId)) {
        targetFamily.members.push(userId);
        this.saveFamilies();
      }
    }

    const newUser: UserProfile = {
      id: userId,
      name: userData.name,
      phone: userData.phone,
      role: 'pilgrim',
      familyId,
      familyRole,
      relation: userData.relation || (familyRole === 'guardian' ? 'Head of Family' : 'Family Member'),
      batteryLevel: 95,
      lat: 20.0050,
      lng: 73.7915,
      locationNote: userData.baseCamp || 'Near Ram Kund',
      emergencyContact: 'Family Guardian',
      emergencyPhone: userData.phone,
      bloodGroup: userData.bloodGroup || 'B+ Positive',
      medicalConditions: userData.medicalNotes || 'Nil known chronic issues',
      status: 'safe'
    };

    this.users.push(newUser);
    this.saveUsers();
    this.currentSession = newUser;
    this.saveSession();

    return { success: true, user: newUser };
  }

  // Police Login
  public loginPolice(badgeNumber: string, pin: string): { success: boolean; user?: UserProfile; message?: string } {
    const cleanBadge = badgeNumber.trim().toUpperCase();
    if (cleanBadge.includes('POLICE') || cleanBadge === 'MH-15-POLICE-041' || pin === '1122' || pin === '112') {
      const policeUser = this.users.find(u => u.role === 'police_admin') || SEED_USERS[4];
      this.currentSession = policeUser;
      this.saveSession();
      return { success: true, user: policeUser };
    }
    return { success: false, message: 'Invalid Police Badge Number or PIN. (Demo PIN: 1122)' };
  }

  // Quick Demo Switcher for Hackathon Judges
  public switchDemoUser(presetKey: 'me' | 'dad' | 'mom' | 'brother' | 'grandpa' | 'police'): UserProfile {
    let targetUser: UserProfile;
    switch (presetKey) {
      case 'me': targetUser = this.users.find(u => u.id === 'user-sahil-me') || SEED_USERS[0]; break;
      case 'dad': targetUser = this.users.find(u => u.id === 'user-vinod-dad') || SEED_USERS[1]; break;
      case 'mom': targetUser = this.users.find(u => u.id === 'user-anita-mom') || SEED_USERS[2]; break;
      case 'brother': targetUser = this.users.find(u => u.id === 'user-yash-bro') || SEED_USERS[3]; break;
      case 'grandpa': targetUser = this.users.find(u => u.id === 'user-dattatraya-grandpa') || SEED_USERS[4]; break;
      case 'police': targetUser = this.users.find(u => u.role === 'police_admin') || SEED_USERS[5]; break;
    }
    this.currentSession = targetUser;
    this.saveSession();
    return targetUser;
  }
}

export const kumbhDb = new KumbhDatabaseService();
