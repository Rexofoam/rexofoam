import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://maplesea-tracker.vercel.app';
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/character-search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guild-search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }
  ];

  // You can add dynamic routes here for popular characters and guilds
  // const popularCharacters = await getPopularCharacters();
  // const characterRoutes = popularCharacters.map((char) => ({
  //   url: `${baseUrl}/character/${char.ocid}`,
  //   lastModified: new Date(char.lastUpdated),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }));

  // const popularGuilds = await getPopularGuilds();
  // const guildRoutes = popularGuilds.map((guild) => ({
  //   url: `${baseUrl}/guild/${guild.oguild_id}`,
  //   lastModified: new Date(guild.lastUpdated),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // }));

  return [
    ...staticRoutes,
    // ...characterRoutes,
    // ...guildRoutes,
  ];
}
