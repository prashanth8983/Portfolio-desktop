// Session management utilities for persisting user state across reloads

const SESSION_KEY = 'portfolio_session';
const SESSION_EXPIRY_HOURS = 24; // Session expires after 24 hours

export interface IconPosition {
  id: string;
  x: number;
  y: number;
}

export interface SessionData {
  isUnlocked: boolean;
  userId: string | null;
  userName: string | null;
  feedbackAuth?: {
    firstName: string;
    email: string;
  } | null;
  iconPositions?: IconPosition[];
  timestamp: number;
}

const getDefaultSession = (): SessionData => ({
  isUnlocked: false,
  userId: null,
  userName: null,
  feedbackAuth: null,
  iconPositions: [],
  timestamp: Date.now(),
});

export const getSession = (): SessionData => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return getDefaultSession();

    const session: SessionData = JSON.parse(stored);

    // Check if session has expired
    const hoursElapsed = (Date.now() - session.timestamp) / (1000 * 60 * 60);
    if (hoursElapsed > SESSION_EXPIRY_HOURS) {
      clearSession();
      return getDefaultSession();
    }

    return session;
  } catch {
    return getDefaultSession();
  }
};

export const saveSession = (data: Partial<SessionData>): void => {
  try {
    const current = getSession();
    const updated: SessionData = {
      ...current,
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

export const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
};

// Specific helper functions
export const setUnlocked = (userId: string, userName: string): void => {
  saveSession({
    isUnlocked: true,
    userId,
    userName,
  });
};

export const setLocked = (): void => {
  saveSession({
    isUnlocked: false,
    userId: null,
    userName: null,
  });
};

export const setFeedbackAuth = (firstName: string, email: string): void => {
  saveSession({
    feedbackAuth: { firstName, email },
  });
};

export const getFeedbackAuth = (): { firstName: string; email: string } | null => {
  const session = getSession();
  return session.feedbackAuth || null;
};

export const isSessionUnlocked = (): boolean => {
  const session = getSession();
  return session.isUnlocked;
};

// Icon position helpers
export const saveIconPositions = (positions: IconPosition[]): void => {
  saveSession({ iconPositions: positions });
};

export const getIconPositions = (): IconPosition[] => {
  const session = getSession();
  return session.iconPositions || [];
};
