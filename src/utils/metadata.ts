import { Metadata } from 'next';

interface GenerateCharacterMetadataProps {
  characterName?: string;
  ocid: string;
  level?: number;
  characterClass?: string;
  combatPower?: number;
  guildName?: string;
  world?: string;
}

export function generateCharacterMetadata({
  characterName = 'Character',
  ocid,
  level,
  characterClass,
  combatPower,
  guildName,
  world
}: GenerateCharacterMetadataProps): Metadata {
  const title = `${characterName} - Level ${level || '?'} ${characterClass || 'Character'} | MapleSEA Tracker`;
  const description = `View ${characterName}'s MapleStory SEA character details. ${level ? `Level ${level}` : ''} ${characterClass || ''} ${guildName ? `from ${guildName} guild` : ''} ${world ? `in ${world}` : ''}. Combat Power: ${combatPower?.toLocaleString() || 'Unknown'}. Track equipment, skills, symbols, and growth progression on MapleSEA Tracker.`;

  const keywords = [
    `${characterName}`,
    `MapleStory SEA ${characterName}`,
    `Level ${level} ${characterClass}`,
    'MSEA character',
    'MapleStory Singapore',
    'character stats',
    'equipment tracking',
    'combat power',
    'character lookup',
    'maplestory tracker',
    characterClass || '',
    guildName || '',
    world || '',
    'skill tracking',
    'symbol tracking',
    'character progression'
  ].filter(Boolean);

  const baseUrl = 'https://maplesea-tracker.vercel.app';
  const fullUrl = `${baseUrl}/character/${ocid}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'MapleSEA Tracker' }],
    creator: 'MapleSEA Tracker',
    publisher: 'MapleSEA Tracker',
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: `${characterName} - MapleSEA Character Profile`,
      description,
      url: fullUrl,
      siteName: 'MapleSEA Tracker',
      type: 'profile',
      locale: 'en_SG',
      images: [
        {
          url: `/api/character-image/${ocid}`, // You can implement this API later
          width: 400,
          height: 400,
          alt: `${characterName} character portrait`
        },
        {
          url: `${baseUrl}/images/logo.png`,
          width: 1200,
          height: 630,
          alt: `MapleSEA Tracker - ${characterName} Profile`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@mapleseatracker',
      title: `${characterName} - Level ${level || '?'} ${characterClass || 'Character'}`,
      description: `MapleStory SEA character profile for ${characterName}. Track stats, equipment, and progression.`,
      images: [`${baseUrl}/images/logo.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  };
}

// For guild pages
interface GenerateGuildMetadataProps {
  guildName?: string;
  oguild_id: string;
  guildLevel?: number;
  memberCount?: number;
  guildMaster?: string;
  world?: string;
  guildPoints?: number;
}

export function generateGuildMetadata({
  guildName = 'Guild',
  oguild_id,
  guildLevel,
  memberCount,
  guildMaster,
  world,
  guildPoints
}: GenerateGuildMetadataProps): Metadata {
  const title = `${guildName} - Level ${guildLevel || '?'} Guild | MapleSEA Tracker`;
  const description = `View ${guildName} guild information on MapleStory SEA. ${guildLevel ? `Level ${guildLevel}` : ''} guild with ${memberCount || '?'} members${world ? ` in ${world}` : ''}. Guild Master: ${guildMaster || 'Unknown'}. ${guildPoints ? `Guild Points: ${guildPoints.toLocaleString()}` : ''}. Track guild growth, skills, member progression, and analytics on MapleSEA Tracker.`;

  const keywords = [
    `${guildName}`,
    `MapleStory SEA ${guildName}`,
    `Level ${guildLevel} guild`,
    'MSEA guild',
    'MapleStory Singapore guild',
    'guild stats',
    'guild tracking',
    'guild growth',
    'guild analytics',
    'guild lookup',
    'maplestory tracker',
    guildMaster || '',
    world || '',
    'guild members',
    'guild ranking',
    'guild skills'
  ].filter(Boolean);

  const baseUrl = 'https://maplesea-tracker.vercel.app';
  const fullUrl = `${baseUrl}/guild/${oguild_id}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'MapleSEA Tracker' }],
    creator: 'MapleSEA Tracker',
    publisher: 'MapleSEA Tracker',
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: `${guildName} - MapleSEA Guild Profile`,
      description,
      url: fullUrl,
      siteName: 'MapleSEA Tracker',
      type: 'website',
      locale: 'en_SG',
      images: [
        {
          url: `/api/guild-image/${oguild_id}`, // You can implement this API later
          width: 600,
          height: 400,
          alt: `${guildName} guild emblem`
        },
        {
          url: `${baseUrl}/images/logo.png`,
          width: 1200,
          height: 630,
          alt: `MapleSEA Tracker - ${guildName} Guild`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@mapleseatracker',
      title: `${guildName} - Level ${guildLevel || '?'} Guild`,
      description: `MapleStory SEA guild profile for ${guildName}. Track guild stats, members, and growth analytics.`,
      images: [`${baseUrl}/images/logo.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  };
}
