import {
  fetchTournamentDetails,
  fetchTournamentsList,
} from "@/lib/sanity/queries";
import { MetadataRoute } from "next";

const baseUrl = process.env.VERCEL_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tournaments = await fetchTournamentsList();

  const tournamentSitemaps: MetadataRoute.Sitemap[] = await Promise.all(
    tournaments.map(async (tournament) => {
      const details = await fetchTournamentDetails(tournament._id);

      if (!details) {
        return [];
      }

      const games = details.games.map((game) => ({
        url: `${baseUrl}/tournaments/${details._id}/games/${game._key}`,
        lastModified: details._updatedAt ?? new Date(),
        changeFrequency: "yearly",
        priority: 1,
      })) satisfies MetadataRoute.Sitemap;

      const tournamentSitemap = [
        {
          url: `${baseUrl}/tournaments/${details._id}`,
          lastModified: details._updatedAt ?? new Date(),
          changeFrequency: "yearly",
          priority: 1,
        },
      ] satisfies MetadataRoute.Sitemap;

      return [...tournamentSitemap, ...games];
    })
  );

  const tournamentSitemapsFlatten = tournamentSitemaps.flat();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${baseUrl}/tournaments`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/players`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...tournamentSitemapsFlatten,
  ];
}
