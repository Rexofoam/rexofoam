/**
 * Enhanced routing configuration for MapleStory SEA application
 * Provides SEO-friendly URLs and better user experience
 */

export const ROUTES = {
  // Home and search
  HOME: '/',
  SEARCH: '/search',
  
  // Character routes - SEO friendly
  CHARACTER: {
    SEARCH: '/character',
    DETAILS: '/character/[ocid]',           // SEO: /character/abc123
    STATS: '/character/[ocid]/stats',       // Dedicated stats view
    EQUIPMENT: '/character/[ocid]/equipment', // Equipment focus
    COMPARE: '/character/compare',          // Compare multiple characters
  },
  
  // Guild routes
  GUILD: {
    SEARCH: '/guild',
    DETAILS: '/guild/[guildId]',           // SEO: /guild/guild-name-id
    MEMBERS: '/guild/[guildId]/members',    // Guild member list
    RANKINGS: '/guild/rankings',            // Guild rankings
  },
  
  // Rankings and leaderboards
  RANKINGS: {
    LEVEL: '/rankings/level',               // Level rankings
    GUILD: '/rankings/guild',               // Guild rankings
    WORLD: '/rankings/world/[worldName]',   // World-specific rankings
    CLASS: '/rankings/class/[className]',   // Class-specific rankings
  },
  
  // Tools and utilities
  TOOLS: {
    CALCULATOR: '/tools/damage-calculator', // Damage calculator
    SIMULATOR: '/tools/stat-simulator',     // Stat simulator
    PLANNER: '/tools/build-planner',        // Build planner
  },
  
  // User features
  USER: {
    BOOKMARKS: '/bookmarks',                // Saved characters
    HISTORY: '/history',                    // Search history
    SETTINGS: '/settings',                  // User preferences
  },
  
  // API routes
  API: {
    CHARACTER: '/api/character',
    GUILD: '/api/guild',
    RANKINGS: '/api/rankings',
  },
} as const;

// Route parameters interface
export interface RouteParams {
  ocid?: string;
  guildId?: string;
  worldName?: string;
  className?: string;
  characterName?: string;
}

// Search parameters interface
export interface SearchParams {
  q?: string;                    // Search query
  world?: string;               // World filter
  class?: string;               // Class filter
  level_min?: string;           // Minimum level
  level_max?: string;           // Maximum level
  page?: string;                // Pagination
  sort?: 'level' | 'name' | 'guild'; // Sort options
  order?: 'asc' | 'desc';       // Sort order
}

// URL builder utilities
export const buildUrl = {
  character: (ocid: string, name?: string) => {
    const url = ROUTES.CHARACTER.DETAILS.replace('[ocid]', ocid);
    return name ? `${url}?name=${encodeURIComponent(name)}` : url;
  },
  
  characterStats: (ocid: string) => 
    ROUTES.CHARACTER.STATS.replace('[ocid]', ocid),
  
  characterEquipment: (ocid: string) => 
    ROUTES.CHARACTER.EQUIPMENT.replace('[ocid]', ocid),
  
  guild: (guildId: string, name?: string) => {
    const url = ROUTES.GUILD.DETAILS.replace('[guildId]', guildId);
    return name ? `${url}?name=${encodeURIComponent(name)}` : url;
  },
  
  worldRankings: (worldName: string) => 
    ROUTES.RANKINGS.WORLD.replace('[worldName]', encodeURIComponent(worldName)),
  
  classRankings: (className: string) => 
    ROUTES.RANKINGS.CLASS.replace('[className]', encodeURIComponent(className)),
  
  characterCompare: (ocids: string[]) => 
    `${ROUTES.CHARACTER.COMPARE}?characters=${ocids.join(',')}`,
};

// Route validation
export const isValidRoute = (path: string): boolean => {
  const allRoutes = Object.values(ROUTES).flat();
  return allRoutes.some(route => 
    typeof route === 'string' && 
    (route === path || route.includes('[') && matchesPattern(path, route))
  );
};

const matchesPattern = (path: string, pattern: string): boolean => {
  const regex = pattern.replace(/\[[\w]+\]/g, '[^/]+');
  return new RegExp(`^${regex}$`).test(path);
};

export default ROUTES;
