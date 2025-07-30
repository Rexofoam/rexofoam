# Best Practices & Fundamentals Guide

This document outlines essential best practices and fundamentals for building a robust, scalable, and maintainable MapleStory character lookup application.

## 🏗️ Project Architecture

### 1. Folder Structure & Organization

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components (Button, Input, etc.)
│   ├── layout/            # Layout components (Header, Footer, etc.)
│   └── features/          # Feature-specific components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and configurations
├── services/              # API services and data fetching
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
├── config/                # Configuration files
├── constants/             # Application constants
├── styles/                # Global styles and themes
├── docs/                  # Documentation
└── tests/                 # Test files
```

### 2. Component Architecture

```typescript
// Component structure example
interface ComponentProps {
  // Always define props interface
}

export const Component = ({ prop1, prop2 }: ComponentProps) => {
  // 1. Hooks at the top
  // 2. Event handlers
  // 3. Computed values
  // 4. Return JSX
};

// Export types for reusability
export type { ComponentProps };
```

## 🛣️ Advanced Routing Strategy

### 1. Route Planning & SEO

```typescript
// Enhanced routing structure
export const ROUTES = {
  HOME: '/',
  CHARACTER: {
    SEARCH: '/character',
    DETAILS: '/character/[ocid]',           // SEO-friendly URLs
    COMPARE: '/character/compare',
    STATS: '/character/[ocid]/stats',
    EQUIPMENT: '/character/[ocid]/equipment',
  },
  GUILD: {
    SEARCH: '/guild',
    DETAILS: '/guild/[guildId]',
    MEMBERS: '/guild/[guildId]/members',
  },
  RANKINGS: {
    LEVEL: '/rankings/level',
    GUILD: '/rankings/guild',
    WORLD: '/rankings/world/[worldName]',
  },
  TOOLS: {
    CALCULATOR: '/tools/calculator',
    SIMULATOR: '/tools/simulator',
  },
} as const;
```

### 2. Dynamic Route Patterns

```typescript
// app/character/[ocid]/page.tsx
interface PageProps {
  params: { ocid: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function CharacterPage({ params, searchParams }: PageProps) {
  const { ocid } = params;
  // Implementation
}

// Generate static params for popular characters
export async function generateStaticParams() {
  const popularCharacters = await getPopularCharacters();
  return popularCharacters.map((char) => ({
    ocid: char.ocid,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const character = await getCharacter(params.ocid);
  
  return {
    title: `${character.name} - Level ${character.level} ${character.class}`,
    description: `View ${character.name}'s stats, equipment, and details from ${character.world}`,
    openGraph: {
      title: `${character.name} - MapleStory SEA`,
      description: `Level ${character.level} ${character.class} from ${character.world}`,
      images: [character.image],
    },
  };
}
```

### 3. Route Guards & Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Implement rate limiting logic
  }
  
  // Redirect old URLs
  if (request.nextUrl.pathname === '/character-details') {
    return NextResponse.redirect(new URL('/character', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

## 💾 Advanced Storage Strategy

### 1. Multi-Layer Caching System

```typescript
// lib/storage/cache-manager.ts
export class CacheManager {
  private static instance: CacheManager;
  private memoryCache = new Map<string, CacheItem>();
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes
  
  static getInstance() {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }
  
  // Memory cache (fastest)
  setMemory<T>(key: string, data: T, ttl = this.DEFAULT_TTL) {
    this.memoryCache.set(key, {
      data,
      expiry: Date.now() + ttl,
      lastAccessed: Date.now(),
    });
  }
  
  // IndexedDB for larger datasets
  async setIndexedDB<T>(key: string, data: T, ttl = this.DEFAULT_TTL) {
    const item: CacheItem = {
      data,
      expiry: Date.now() + ttl,
      lastAccessed: Date.now(),
    };
    
    await this.openDB().then(db => {
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      store.put(item, key);
    });
  }
  
  // Cache invalidation strategies
  invalidatePattern(pattern: string) {
    // Invalidate cache entries matching pattern
  }
  
  // Cache warming for popular data
  async warmCache() {
    const popularCharacters = await getPopularCharacters();
    popularCharacters.forEach(char => this.preloadCharacter(char.ocid));
  }
}

interface CacheItem {
  data: any;
  expiry: number;
  lastAccessed: number;
}
```

### 2. Data Persistence Strategy

```typescript
// lib/storage/persistence.ts
export class DataPersistence {
  // Recent searches
  static saveRecentSearch(query: string, type: 'character' | 'guild') {
    const searches = this.getRecentSearches(type);
    const updated = [
      { query, timestamp: Date.now() },
      ...searches.filter(s => s.query !== query).slice(0, 9)
    ];
    localStorage.setItem(`recent_${type}_searches`, JSON.stringify(updated));
  }
  
  // User preferences
  static saveUserPreferences(preferences: UserPreferences) {
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
  }
  
  // Bookmarked characters
  static bookmarkCharacter(character: CharacterBasic) {
    const bookmarks = this.getBookmarks();
    const updated = [...bookmarks, character].slice(0, 50); // Limit bookmarks
    localStorage.setItem('bookmarked_characters', JSON.stringify(updated));
  }
  
  // Export/Import functionality
  static exportUserData() {
    return {
      preferences: this.getUserPreferences(),
      bookmarks: this.getBookmarks(),
      recentSearches: {
        character: this.getRecentSearches('character'),
        guild: this.getRecentSearches('guild'),
      },
      timestamp: Date.now(),
    };
  }
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  defaultWorld: string;
  language: 'en' | 'ko' | 'zh';
  autoRefresh: boolean;
  notifications: boolean;
}
```

## 🔄 State Management

### 1. Context + useReducer Pattern

```typescript
// lib/context/app-context.tsx
interface AppState {
  user: UserPreferences;
  cache: Map<string, any>;
  recentSearches: RecentSearch[];
  bookmarks: CharacterBasic[];
  loading: Record<string, boolean>;
}

type AppAction = 
  | { type: 'SET_USER_PREFERENCES'; payload: UserPreferences }
  | { type: 'ADD_RECENT_SEARCH'; payload: RecentSearch }
  | { type: 'SET_LOADING'; payload: { key: string; loading: boolean } };

const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
```

### 2. Custom Hooks for Data Management

```typescript
// hooks/use-character-data.ts
export function useCharacterData(ocid: string) {
  const [data, setData] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await characterDataService.fetchCharacterData(ocid, forceRefresh);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [ocid]);
  
  useEffect(() => {
    if (ocid) fetchData();
  }, [ocid, fetchData]);
  
  return { data, loading, error, refetch: () => fetchData(true) };
}

// hooks/use-local-storage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue] as const;
}
```

## 🔧 Configuration Management

### 1. Environment Configuration

```typescript
// config/environment.ts
const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://open.api.nexon.com',
    key: process.env.NEXT_PUBLIC_API_KEY || '',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
    retryAttempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),
  },
  cache: {
    defaultTTL: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '1800000'), // 30 minutes
    maxMemoryEntries: parseInt(process.env.NEXT_PUBLIC_MAX_MEMORY_CACHE || '100'),
  },
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableServiceWorker: process.env.NEXT_PUBLIC_ENABLE_SW === 'true',
    enableOfflineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE === 'true',
  },
  app: {
    name: 'MapleStory SEA Lookup',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
  },
} as const;

export default config;
```

### 2. Feature Flags

```typescript
// lib/feature-flags.ts
export const featureFlags = {
  CHARACTER_COMPARISON: true,
  GUILD_RANKINGS: false,
  ADVANCED_FILTERS: true,
  DARK_MODE: true,
  NOTIFICATIONS: false,
} as const;

export function useFeatureFlag(flag: keyof typeof featureFlags) {
  return featureFlags[flag];
}
```

## 🛡️ Error Handling & Monitoring

### 1. Error Boundaries

```typescript
// components/error-boundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    // Send to error tracking service
    this.logError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

### 2. API Error Handling

```typescript
// lib/error-handler.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleApiError = (error: unknown): APIError => {
  if (error instanceof APIError) return error;
  
  if (error instanceof Error) {
    return new APIError(error.message, 500);
  }
  
  return new APIError('Unknown error occurred', 500);
};

// Global error handler
export const globalErrorHandler = (error: Error, errorInfo?: ErrorInfo) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Global error:', error, errorInfo);
  }
  
  // Send to monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    // Sentry, LogRocket, etc.
  }
};
```

## 📊 Performance Monitoring

### 1. Performance Metrics

```typescript
// lib/performance.ts
export class PerformanceMonitor {
  static measureApiCall<T>(
    name: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    
    return apiCall()
      .then(result => {
        const duration = performance.now() - start;
        this.recordMetric(`api_${name}`, duration);
        return result;
      })
      .catch(error => {
        const duration = performance.now() - start;
        this.recordMetric(`api_${name}_error`, duration);
        throw error;
      });
  }
  
  static measureComponentRender(componentName: string) {
    return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
      const method = descriptor.value;
      
      descriptor.value = function (...args: any[]) {
        const start = performance.now();
        const result = method.apply(this, args);
        const duration = performance.now() - start;
        
        PerformanceMonitor.recordMetric(`render_${componentName}`, duration);
        return result;
      };
    };
  }
  
  private static recordMetric(name: string, value: number) {
    // Send to analytics service
    console.log(`Performance metric: ${name} = ${value}ms`);
  }
}
```

## 🧪 Testing Strategy

### 1. Testing Setup

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// tests/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/character/:ocid', (req, res, ctx) => {
    return res(
      ctx.json({
        character_name: 'TestCharacter',
        character_level: 250,
        // ... mock data
      })
    );
  }),
];
```

### 2. Component Testing

```typescript
// tests/components/character-details.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { CharacterDetailsPage } from '@/app/character-details/page';

describe('CharacterDetailsPage', () => {
  it('displays character information correctly', async () => {
    render(<CharacterDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('TestCharacter')).toBeInTheDocument();
      expect(screen.getByText('Level: 250')).toBeInTheDocument();
    });
  });
});
```

## 🔒 Security Best Practices

### 1. Input Validation

```typescript
// lib/validation.ts
import { z } from 'zod';

export const characterSearchSchema = z.object({
  characterName: z.string()
    .min(1, 'Character name is required')
    .max(13, 'Character name too long')
    .regex(/^[a-zA-Z0-9]+$/, 'Invalid characters'),
});

export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map(e => e.message).join(', '));
    }
    throw error;
  }
};
```

### 2. API Security

```typescript
// lib/api-client.ts
class SecureApiClient {
  private async makeRequest(url: string, options: RequestInit = {}) {
    // Rate limiting
    await this.checkRateLimit();
    
    // Add security headers
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    };
    
    // Sanitize URL
    const sanitizedUrl = this.sanitizeUrl(url);
    
    return fetch(sanitizedUrl, { ...options, headers });
  }
  
  private sanitizeUrl(url: string): string {
    // Prevent URL injection
    return url.replace(/[<>]/g, '');
  }
}
```

This comprehensive guide covers all the fundamental best practices you should implement. Would you like me to elaborate on any specific section or create implementation examples for particular areas?
