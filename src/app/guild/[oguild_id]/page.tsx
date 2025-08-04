import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guildDataService } from '@/services/guild-data.service';
import { GuildDetailsClient } from './guild-details-client';

interface PageProps {
  params: { oguild_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate dynamic metadata for SEO
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { params, searchParams } = props;
  const { oguild_id } = await params;
  const guildName = await searchParams.name as string;
  const worldName = await searchParams.world as string;
  
  try {
    // Try to get character data for metadata
    const guildData = await guildDataService.fetchGuildData(oguild_id);
    
    if (!guildData?.basic) {
      return {
        title: 'Guild Not Found - MapleStory SEA',
        description: 'The requested guild could not be found.',
      };
    }
    
    const { basic } = guildData;
    const title = `${basic.guild_name} - Level ${basic.guild_level} - Guild Master: ${basic.guild_master_name}`;
    const description = `View ${basic.guild_name}'s info, skills, and members. Level ${basic.guild_level} from ${basic.world_name} world.`;
    
    return {
      title: `${title} | MapleStory SEA Guild Lookup`,
      description,
      keywords: [
        basic.guild_name,
        basic.guild_master_name,
        basic.world_name,
        'MapleStory SEA',
        'guild info',
        'skills',
        'members',
        basic.guild_level.toString(),
      ],
    // To be updated with guild master image
    //   openGraph: {
    //     title,
    //     description,
    //     type: 'profile',
    //     images: basic.character_image ? [
    //       {
    //         url: basic.character_image,
    //         width: 200,
    //         height: 200,
    //         alt: `${basic.character_name} character image`,
    //       }
    //     ] : undefined,
    //     siteName: 'MapleStory SEA Character Lookup',
    //   },
    //   twitter: {
    //     card: 'summary',
    //     title,
    //     description,
    //     images: basic.character_image ? [basic.character_image] : undefined,
    //   },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
      alternates: {
        canonical: `/guild/${oguild_id}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Fallback metadata
    return {
      title: guildName 
        ? `${guildName} - MapleStory SEA Guild`
        : 'Guild Details - MapleStory SEA',
      description: 'View detailed guild information including skills, members, and more.',
    };
  }
}

// Server component for initial data loading and SEO
export default async function GuildPage(props: PageProps) {
  const { params, searchParams } = props;
  const { oguild_id } = await params;
  
  // Validate OCID format (basic validation)
  if (!oguild_id || oguild_id.length < 10) {
    notFound();
  }
  
  try {
    // Pre-fetch character data on server for faster initial load
    const initialData = await guildDataService.fetchGuildData(oguild_id);
    
    if (!initialData?.basic) {
      notFound();
    }
    
    return (
      <GuildDetailsClient 
        oguild_id={oguild_id}
        guildName={searchParams.name as string}
        initialData={initialData}
      />
    );
  } catch (error) {
    console.error('Error loading character:', error);
    notFound();
  }
}
