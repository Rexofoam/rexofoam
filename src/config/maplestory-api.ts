/**
 * MapleStory SEA API Configuration
 * Centralized configuration for API endpoints and authentication
 */

export const MAPLESTORY_API_CONFIG = {
  // Base URL for MapleStory SEA API
  BASE_URL: 'https://open.api.nexon.com/maplestorysea/v1',
  
  // API Key for authentication
  API_KEY: 'test_ea78af0bb88d495a94b6f66066c720e395fdf4f7b152747fba72a401626e4bfdefe8d04e6d233bd35cf2fabdeb93fb0d',
  
  // Common headers for all requests
  HEADERS: {
    'x-nxopen-api-key': 'test_ea78af0bb88d495a94b6f66066c720e395fdf4f7b152747fba72a401626e4bfdefe8d04e6d233bd35cf2fabdeb93fb0d',
    'Content-Type': 'application/json',
  },
  
  // API Endpoints
  ENDPOINTS: {
    CHARACTER_ID: '/id',
    CHARACTER_BASIC: '/character/basic',
    CHARACTER_STAT: '/character/stat',
    CHARACTER_HYPER_STAT: '/character/hyper-stat',
    CHARACTER_ABILITY: '/character/ability',
    CHARACTER_ITEM_EQUIPMENT: '/character/item-equipment',
    CHARACTER_CASH_ITEM_EQUIPMENT: '/character/cashitem-equipment',
    CHARACTER_SYMBOL_EQUIPMENT: '/character/symbol-equipment',
    CHARACTER_SET_EFFECT: '/character/set-effect',
    CHARACTER_BEAUTY_EQUIPMENT: '/character/beauty-equipment',
    CHARACTER_ANDROID_EQUIPMENT: '/character/android-equipment',
    CHARACTER_PET_EQUIPMENT: '/character/pet-equipment',
    CHARACTER_SKILL: '/character/skill',
    CHARACTER_LINK_SKILL: '/character/link-skill',
    CHARACTER_VMatrix: '/character/vmatrix',
    CHARACTER_HEXAMATRIX: '/character/hexamatrix',
    CHARACTER_HEXAMATRIX_STAT: '/character/hexamatrix-stat',
    CHARACTER_DOJANG: '/character/dojang',
  },
} as const;

/**
 * Helper function to create API URLs
 */
export const createApiUrl = (endpoint: string, params?: Record<string, string>) => {
  const url = new URL(MAPLESTORY_API_CONFIG.BASE_URL + endpoint);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
};

/**
 * Helper function to make API requests with standard headers
 */
export const makeApiRequest = async (endpoint: string, params?: Record<string, string>) => {
  const url = createApiUrl(endpoint, params);
  
  const response = await fetch(url, {
    headers: MAPLESTORY_API_CONFIG.HEADERS,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Export individual parts for convenience
export const { BASE_URL, API_KEY, HEADERS, ENDPOINTS } = MAPLESTORY_API_CONFIG;

export default MAPLESTORY_API_CONFIG;
