/**
 * Navigation utilities for the Maplesea application
 * Centralized routing logic for consistent navigation
 */

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ROUTES } from '@/config/routes';

export { ROUTES };

export class NavigationService {
  private router: AppRouterInstance;

  constructor(router: AppRouterInstance) {
    this.router = router;
  }

  /**
   * Navigate to home page
   */
  goHome() {
    this.router.push(ROUTES.HOME);
  }

  /**
   * Navigate to character details page with SEO-friendly URL
   */
  goToCharacterDetails(ocid: string, characterName?: string) {
    console.log('NavigationService.goToCharacterDetails called');
    console.log('OCID:', ocid);
    console.log('Character Name:', characterName);
    console.log('ROUTES.CHARACTER.DETAILS:', ROUTES.CHARACTER.DETAILS);
    
    const url = ROUTES.CHARACTER.DETAILS.replace('[ocid]', ocid);
    console.log('URL after OCID replacement:', url);
    
    const finalUrl = characterName 
      ? `${url}?name=${encodeURIComponent(characterName)}`
      : url;
    console.log('Final URL:', finalUrl);
    
    console.log('About to call router.push...');
    this.router.push(finalUrl);
    console.log('router.push call completed');
  }

  /**
   * Navigate to character stats page
   */
  goToCharacterStats(ocid: string) {
    const url = ROUTES.CHARACTER.STATS.replace('[ocid]', ocid);
    this.router.push(url);
  }

  /**
   * Navigate to character equipment page
   */
  goToCharacterEquipment(ocid: string) {
    const url = ROUTES.CHARACTER.EQUIPMENT.replace('[ocid]', ocid);
    this.router.push(url);
  }

  /**
   * Navigate to character comparison
   */
  goToCharacterCompare(ocids: string[] = []) {
    const url = ocids.length > 0 
      ? `${ROUTES.CHARACTER.COMPARE}?characters=${ocids.join(',')}`
      : ROUTES.CHARACTER.COMPARE;
    this.router.push(url);
  }

  /**
   * Navigate to guild details
   */
  goToGuildDetails(guildId: string, guildName?: string) {
    const url = ROUTES.GUILD.DETAILS.replace('[guildId]', guildId);
    const finalUrl = guildName 
      ? `${url}?name=${encodeURIComponent(guildName)}`
      : url;
    this.router.push(finalUrl);
  }

  /**
   * Navigate back in history
   */
  goBack() {
    this.router.back();
  }

  /**
   * Navigate forward in history
   */
  goForward() {
    this.router.forward();
  }

  /**
   * Replace current URL (no history entry)
   */
  replace(path: string) {
    this.router.replace(path);
  }

  /**
   * Prefetch a route for faster navigation
   */
  prefetch(path: string) {
    this.router.prefetch(path);
  }
}

/**
 * Custom hook for navigation
 */
import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const router = useRouter();
  return new NavigationService(router);
};

/**
 * URL parameter utilities
 */
export const URLParams = {
  /**
   * Get character OCID from URL params
   */
  getCharacterOcid: (searchParams: URLSearchParams): string | null => {
    return searchParams.get('ocid');
  },

  /**
   * Get character name from URL params
   */
  getCharacterName: (searchParams: URLSearchParams): string | null => {
    return searchParams.get('name');
  },

  /**
   * Build character details URL (legacy support)
   */
  buildCharacterUrl: (ocid: string, characterName?: string): string => {
    const url = ROUTES.CHARACTER.DETAILS.replace('[ocid]', ocid);
    return characterName 
      ? `${url}?name=${encodeURIComponent(characterName)}`
      : url;
  },
};

/**
 * URL builder utilities (enhanced)
 */
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

export default NavigationService;
