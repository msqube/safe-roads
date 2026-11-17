import { User, LoginCredentials, AuthResponse } from '../models/authModels';

const AUTH_STORAGE_KEY = 'saferoads_auth_user_v1';
const AUTH_TOKEN_KEY = 'saferoads_auth_token_v1';

export const DEMO_USERS: Record<string, User> = {
  'admin@saferoads.ai': {
    id: 'USR-001',
    name: 'Er. Rahul Baruah',
    email: 'admin@saferoads.ai',
    role: 'Super Admin',
    badgeId: 'MSQ-ADM-01',
    department: 'Autonomous Road Safety Command',
    organization: 'MSQUBE Infrastructure Technologies',
  },
  'drone.ops@saferoads.ai': {
    id: 'USR-002',
    name: 'Capt. Ananya Sharma',
    email: 'drone.ops@saferoads.ai',
    role: 'Drone Operations Pilot',
    badgeId: 'DGCA-DRN-4419',
    department: 'Aerial Surveillance & Lane Missions',
    organization: 'SafeRoads Flight Division',
  },
  'nsv.inspector@saferoads.ai': {
    id: 'USR-003',
    name: 'M. Bordoloi',
    email: 'nsv.inspector@saferoads.ai',
    role: 'NSV Highway Inspector',
    badgeId: 'NSV-ENG-8812',
    department: 'Network Survey Laser Telemetry',
    organization: 'National Highways Road Quality Board',
  },
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network authentication handshake
    await new Promise((resolve) => setTimeout(resolve, 350));

    const emailKey = credentials.email.toLowerCase().trim();
    const existing = DEMO_USERS[emailKey];

    const user: User = existing || {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: credentials.email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: credentials.email,
      role: 'Super Admin',
      badgeId: `MSQ-OP-${Math.floor(10 + Math.random() * 90)}`,
      department: 'Road Surveillance Engineering',
      organization: 'MSQUBE SafeRoads',
      lastLogin: new Date().toISOString(),
    };

    const token = `jwt_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    if (credentials.rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    return { user, token, expiresIn: '24h' };
  }

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading auth user from storage:', e);
    }
    // Default fallback demo user for immediate accessibility
    return DEMO_USERS['admin@saferoads.ai'];
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
    // If no explicit token stored yet, check if stored user exists
    return Boolean(token || localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY));
  }
}

export const authService = new AuthService();

