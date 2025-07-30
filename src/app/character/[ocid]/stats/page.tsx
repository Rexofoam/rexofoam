import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { characterDataService } from '@/services/character-data.service';
import { CharacterStatsClient } from './character-stats-client';

interface PageProps {
  params: { ocid: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ocid } = params;
  
  try {
    const characterData = await characterDataService.fetchCharacterData(ocid);
    
    if (!characterData?.basic) {
      return {
        title: 'Character Stats Not Found - MapleStory SEA',
        description: 'The requested character stats could not be found.',
      };
    }
    
    const { basic } = characterData;
    const title = `${basic.character_name} Stats - Level ${basic.character_level} ${basic.character_class}`;
    const description = `View detailed stats for ${basic.character_name}, a Level ${basic.character_level} ${basic.character_class} from ${basic.world_name} world.`;
    
    return {
      title: `${title} | MapleStory SEA`,
      description,
      alternates: {
        canonical: `/character/${ocid}/stats`,
      },
    };
  } catch (error) {
    return {
      title: 'Character Stats - MapleStory SEA',
      description: 'View detailed character stats and information.',
    };
  }
}

export default async function CharacterStatsPage({ params }: PageProps) {
  const { ocid } = params;
  
  if (!ocid || ocid.length < 10) {
    notFound();
  }
  
  try {
    const initialData = await characterDataService.fetchCharacterData(ocid);
    
    if (!initialData?.basic) {
      notFound();
    }
    
    return (
      <CharacterStatsClient 
        ocid={ocid}
        initialData={initialData}
      />
    );
  } catch (error) {
    console.error('Error loading character stats:', error);
    notFound();
  }
}
