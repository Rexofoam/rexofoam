import { ENDPOINTS, makeApiRequest } from "@/config/maplestory-api";
import { GuildBasic, GuildData } from "@/types/maplestory-api";

class GuildDataService {
    private static instance: GuildDataService;
    private cache = new Map<string, GuildData>();
    private readonly CACHE_DURATION = 30 * 60 * 1000;
    private readonly KEY_TITLE = 'maplesotry_guild_';

    private constructor() { }

    static getInstance(): GuildDataService {
        if (!GuildDataService.instance) {
            GuildDataService.instance = new GuildDataService();
        }
        return GuildDataService.instance;
    }

    // Fetch and store guild data
    async fetchGuildData(oguild_id: string): Promise<GuildData> {
        try {
            // Chech cache first
            const cached = this.getFromCache(oguild_id);
            if (cached && !this.isCacheExpired(cached)) {
                return cached;
            }

            // Step 1: Fetch guild data
            const [guildBasic] = await Promise.all([
                makeApiRequest(ENDPOINTS.GUILD_BASIC, { oguild_id }),
            ]);

            let charBasic = null;
            let charId = null;

            if (guildBasic?.guild_master_name) {
                // Step 2: Fetch guild master ocid
                [charId] = await Promise.all([
                    makeApiRequest(ENDPOINTS.CHARACTER_ID, { character_name: guildBasic?.guild_master_name }),
                ]);

                // Step 3: Fetch guild master image based on ocid
                if (charId?.ocid) {
                    [charBasic] = await Promise.all([
                        makeApiRequest(ENDPOINTS.CHARACTER_BASIC, { ocid: charId.ocid }),
                    ]);
                }
            }

            // Create guild data object
            const guildData: GuildData = {
                oguild_id,
                basic: guildBasic as GuildBasic,
                guild_master_ocid: charId?.ocid ?? null,
                guild_master_image: charBasic?.character_image ?? null,
                lastUpdated: new Date(),
                cacheExpiry: new Date(Date.now() + this.CACHE_DURATION),
            }

            // Store in cache and localStorage
            this.storeInCache(oguild_id, guildData);
            this.storeInLocalStorage(oguild_id, guildData);

            return guildData;
        } catch (error) {
            console.error('Failed to fetch guild data:', error);
            throw new Error('Failed to fetch guild data');
        }
    }

    // Get guild data from cache
    private getFromCache(oguild_id_id: string): GuildData | null {
        return this.cache.get(oguild_id_id) || null;
    }

    // Store guild data in cache
    private storeInCache(oguild_id_id: string, data: GuildData): void {
        this.cache.set(oguild_id_id, data);
    }

    // Check if cache data is expired
    private isCacheExpired(data: GuildData): boolean {
        if (!data.cacheExpiry) return true;
        return new Date() > data.cacheExpiry;
    }

    // Store guild data in localStorage for persistence
    private storeInLocalStorage(oguild_id: string, data: GuildData): void {
        try {
            const key = this.KEY_TITLE + oguild_id;
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to store in localStorage:', error);
        }
    }

    // Get guild data from localStorage
    getFromLocalStorage(oguild_id: string): GuildData | null {
        try {
            const key = this.KEY_TITLE + oguild_id;
            const stored = localStorage.getItem(key);
            if (!stored) return null;

            const data = JSON.parse(stored) as GuildData;
            // Convert data strings back to Date objects
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

    // Clear cache for a specific character
    clearGuildCache(oguild_id: string): void {
        this.cache.delete(oguild_id);
        try {
            const key = this.KEY_TITLE + oguild_id;
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Failed to clear localStorage: ', error);
        }
    }

    // Clear all cached data
    clearAllCache(): void {
        this.cache.clear();
        try {
            // Clear all maplestory character data from localStorage
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.KEY_TITLE)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Failed to clear localStorage:', error);
        }
    }

    // Refresh guild data (force fetch from API)
    async refreshGuildDate(oguild_id: string): Promise<GuildData> {
        this.clearGuildCache(oguild_id);
        return this.fetchGuildData(oguild_id);
    }

    // Get all cached guild oguild_ids
    getCachedGuildIds(): string[] {
        try {
            const cachedIds: string[] = [];
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.KEY_TITLE)) {
                    const oguild_id = key.replace(this.KEY_TITLE, '');
                    cachedIds.push(oguild_id);
                }
            });
            return cachedIds;
        } catch (error) {
            console.warn('Failed to get cached guild IDs: ', error);
            return [];
        }
    }
}

// Export singleton instance
export const guildDataService = GuildDataService.getInstance();
export default guildDataService; 