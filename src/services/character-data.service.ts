/**
 * Character Data Service
 * Handles storage, caching, and retrieval of character data
 */

import { makeApiRequest, ENDPOINTS } from '@/config/maplestory-api';
import { CharacterData, CharacterBasic, CharacterStat, HyperStat, CharacterAbility, ItemEquipment } from '@/types/maplestory-api';

class CharacterDataService {
  private static instance: CharacterDataService;
  private cache = new Map<string, CharacterData>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  private constructor() {}

  static getInstance(): CharacterDataService {
    if (!CharacterDataService.instance) {
      CharacterDataService.instance = new CharacterDataService();
    }
    return CharacterDataService.instance;
  }

  /**
   * Check if we're running in the browser (not during SSR)
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Fetch complete character data with caching
   */
  async fetchCharacterData(ocid: string): Promise<CharacterData> {
    // Check memory cache first
    const cached = this.getFromCache(ocid);
    if (cached && !this.isCacheExpired(cached)) {
      return cached;
    }

    // Check localStorage cache (only in browser)
    if (this.isBrowser()) {
      const localCached = this.getFromLocalStorage(ocid);
      if (localCached && !this.isCacheExpired(localCached)) {
        // Store back in memory cache
        this.storeInCache(ocid, localCached);
        return localCached;
      }
    }

    try {
      // Fetch all character data in parallel
      const [basic, stat, hyperStat, ability, itemEquipment] = await Promise.all([
        makeApiRequest(ENDPOINTS.CHARACTER_BASIC, { ocid }),
        makeApiRequest(ENDPOINTS.CHARACTER_STAT, { ocid }),
        makeApiRequest(ENDPOINTS.CHARACTER_HYPER_STAT, { ocid }),
        makeApiRequest(ENDPOINTS.CHARACTER_ABILITY, { ocid }),
        makeApiRequest(ENDPOINTS.CHARACTER_ITEM_EQUIPMENT, { ocid }),
      ]);

      const characterData: CharacterData = {
        ocid,
        basic: basic as CharacterBasic,
        stat: stat as CharacterStat,
        hyperStat: hyperStat as HyperStat,
        ability: ability as CharacterAbility,
        itemEquipment: itemEquipment as ItemEquipment,
        lastUpdated: new Date(),
        cacheExpiry: new Date(Date.now() + this.CACHE_DURATION),
      };

      // Store in cache and localStorage
      this.storeInCache(ocid, characterData);
      this.storeInLocalStorage(ocid, characterData);

      return characterData;
    } catch (error) {
      console.error('Failed to fetch character data:', error);
      throw new Error('Failed to fetch character data');
    }
  }

  /**
   * Get character data from cache
   */
  private getFromCache(ocid: string): CharacterData | null {
    return this.cache.get(ocid) || null;
  }

  /**
   * Store character data in memory cache
   */
  private storeInCache(ocid: string, data: CharacterData): void {
    this.cache.set(ocid, data);
  }

  /**
   * Check if cached data is expired
   */
  private isCacheExpired(data: CharacterData): boolean {
    if (!data.cacheExpiry) return true;
    return new Date() > data.cacheExpiry;
  }

  /**
   * Store character data in localStorage for persistence
   */
  private storeInLocalStorage(ocid: string, data: CharacterData): void {
    if (!this.isBrowser()) {
      return; // Skip localStorage operations during SSR
    }
    
    try {
      const key = `maplestory_character_${ocid}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to store in localStorage:', error);
    }
  }

  /**
   * Get character data from localStorage
   */
  getFromLocalStorage(ocid: string): CharacterData | null {
    if (!this.isBrowser()) {
      return null; // Return null during SSR
    }
    
    try {
      const key = `maplestory_character_${ocid}`;
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const data = JSON.parse(stored) as CharacterData;
      // Convert date strings back to Date objects
      data.lastUpdated = new Date(data.lastUpdated);
      if (data.cacheExpiry) {
        data.cacheExpiry = new Date(data.cacheExpiry);
      }

      return data;
    } catch (error) {
      console.warn('Failed to retrieve from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear character from cache and localStorage
   */
  clearCharacterCache(ocid: string): void {
    this.cache.delete(ocid);
    
    if (!this.isBrowser()) {
      return; // Skip localStorage operations during SSR
    }
    
    try {
      const key = `maplestory_character_${ocid}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Clear all cached data
   */
  clearAllCache(): void {
    this.cache.clear();
    
    if (!this.isBrowser()) {
      return; // Skip localStorage operations during SSR
    }
    
    try {
      // Clear all maplestory character data from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('maplestory_character_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Get character basic info only (lighter request)
   */
  async getCharacterBasic(ocid: string): Promise<CharacterBasic> {
    // Check if we have full data in cache first
    const fullData = this.getFromCache(ocid);
    if (fullData && !this.isCacheExpired(fullData) && fullData.basic) {
      return fullData.basic;
    }

    // Check localStorage for full data (only in browser)
    if (this.isBrowser()) {
      const localCached = this.getFromLocalStorage(ocid);
      if (localCached && !this.isCacheExpired(localCached) && localCached.basic) {
        return localCached.basic;
      }
    }

    // Fetch basic data only
    return makeApiRequest(ENDPOINTS.CHARACTER_BASIC, { ocid }) as Promise<CharacterBasic>;
  }

  /**
   * Refresh character data (force fetch from API)
   */
  async refreshCharacterData(ocid: string): Promise<CharacterData> {
    // Clear existing cache
    this.clearCharacterCache(ocid);
    
    // Fetch fresh data
    return this.fetchCharacterData(ocid);
  }

  /**
   * Get all cached character OCIDs
   */
  getCachedCharacterIds(): string[] {
    if (!this.isBrowser()) {
      return []; // Return empty array during SSR
    }
    
    try {
      const cachedIds: string[] = [];
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('maplestory_character_')) {
          const ocid = key.replace('maplestory_character_', '');
          cachedIds.push(ocid);
        }
      });
      return cachedIds;
    } catch (error) {
      console.warn('Failed to get cached character IDs:', error);
      return [];
    }
  }
}

// Export singleton instance
export const characterDataService = CharacterDataService.getInstance();
