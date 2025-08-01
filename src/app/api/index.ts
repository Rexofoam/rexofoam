/**
 * API Routes Index
 * 
 * This file serves as a centralized reference for all available API routes
 * in the MapleStory SEA Dashboard application.
 * 
 * All routes use the MapleStory SEA Open API and return JSON responses.
 */

export const API_ROUTES = {
  // Character-related endpoints
  CHARACTER: {
    SYMBOLS: '/api/character/symbols',
    EQUIPMENT: '/api/character/equipment',
    
    // Future character endpoints can be added here:
    // STATS: '/api/character/stats',
    // HYPER_STAT: '/api/character/hyper-stat',
    // ABILITY: '/api/character/ability',
    // CASH_ITEMS: '/api/character/cash-items',
    // SET_EFFECTS: '/api/character/set-effects',
    // BEAUTY: '/api/character/beauty',
    // ANDROID: '/api/character/android',
    // PETS: '/api/character/pets',
    // SKILLS: '/api/character/skills',
    // LINK_SKILLS: '/api/character/link-skills',
    // VMATRIX: '/api/character/vmatrix',
    // HEXAMATRIX: '/api/character/hexamatrix',
    // DOJANG: '/api/character/dojang',
  },
  
  // Guild-related endpoints (placeholder for future implementation)
  GUILD: {
    // BASIC: '/api/guild/basic',
    // MEMBERS: '/api/guild/members',
  },
  
  // User-related endpoints (placeholder for future implementation)  
  USER: {
    // PROFILE: '/api/user/profile',
    // PREFERENCES: '/api/user/preferences',
  },
} as const;

/**
 * Helper function to build API URLs with query parameters
 * 
 * @param route - The API route path
 * @param params - Query parameters to append
 * @returns Complete URL with query parameters
 * 
 * @example
 * buildApiUrl(API_ROUTES.CHARACTER.SYMBOLS, { ocid: 'abc123' })
 * // Returns: '/api/character/symbols?ocid=abc123'
 */
export function buildApiUrl(route: string, params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) {
    return route;
  }
  
  const searchParams = new URLSearchParams(params);
  return `${route}?${searchParams.toString()}`;
}

/**
 * Type-safe API client for making requests to internal API routes
 */
export class ApiClient {
  /**
   * Fetch character symbols data
   */
  static async getCharacterSymbols(ocid: string) {
    const url = buildApiUrl(API_ROUTES.CHARACTER.SYMBOLS, { ocid });
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch symbols: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Fetch character equipment data
   */
  static async getCharacterEquipment(ocid: string) {
    const url = buildApiUrl(API_ROUTES.CHARACTER.EQUIPMENT, { ocid });
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch equipment: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export default API_ROUTES;
