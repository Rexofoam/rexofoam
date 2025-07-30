import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { characterDataService } from '@/services/character-data.service';
import { CharacterDetailsClient } from './character-details-client';

interface PageProps {
  params: { ocid: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate static params for popular characters (optional optimization)
export async function generateStaticParams() {
  // You can implement this to pre-generate pages for popular characters
  // const popularCharacters = await getPopularCharacters();
  // return popularCharacters.map((char) => ({ ocid: char.ocid }));
  
  // For now, return empty array to generate pages on-demand
  return [];
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { ocid } = params;
  const characterName = searchParams.name as string;
  
  try {
    // Try to get character data for metadata
    const characterData = await characterDataService.fetchCharacterData(ocid);
    
    if (!characterData?.basic) {
      return {
        title: 'Character Not Found - MapleStory SEA',
        description: 'The requested character could not be found.',
      };
    }
    
    const { basic } = characterData;
    const title = `${basic.character_name} - Level ${basic.character_level} ${basic.character_class}`;
    const description = `View ${basic.character_name}'s stats, equipment, and details. Level ${basic.character_level} ${basic.character_class} from ${basic.world_name} world.`;
    
    return {
      title: `${title} | MapleStory SEA Character Lookup`,
      description,
      keywords: [
        basic.character_name,
        basic.character_class,
        basic.world_name,
        'MapleStory SEA',
        'character stats',
        'equipment',
        'level',
        basic.character_level.toString(),
      ],
      openGraph: {
        title,
        description,
        type: 'profile',
        images: basic.character_image ? [
          {
            url: basic.character_image,
            width: 200,
            height: 200,
            alt: `${basic.character_name} character image`,
          }
        ] : undefined,
        siteName: 'MapleStory SEA Character Lookup',
      },
      twitter: {
        card: 'summary',
        title,
        description,
        images: basic.character_image ? [basic.character_image] : undefined,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
      alternates: {
        canonical: `/character/${ocid}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Fallback metadata
    return {
      title: characterName 
        ? `${characterName} - MapleStory SEA Character`
        : 'Character Details - MapleStory SEA',
      description: 'View detailed character information including stats, equipment, and more.',
    };
  }
}

// Server component for initial data loading and SEO
export default async function CharacterPage({ params, searchParams }: PageProps) {
  const { ocid } = params;
  
  // Validate OCID format (basic validation)
  if (!ocid || ocid.length < 10) {
    notFound();
  }
  
  try {
    // Pre-fetch character data on server for faster initial load
    const initialData = await characterDataService.fetchCharacterData(ocid);
    
    if (!initialData?.basic) {
      notFound();
    }
    
    return (
      <CharacterDetailsClient 
        ocid={ocid}
        characterName={searchParams.name as string}
        initialData={initialData}
      />
    );
  } catch (error) {
    console.error('Error loading character:', error);
    notFound();
  }
}
