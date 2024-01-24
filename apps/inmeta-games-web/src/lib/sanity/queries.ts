import { groq } from "next-sanity";
import { client } from ".";
import { Tournament, TournamentDetails } from "./types";

/**
 * This has a revalidate of 1 hour
 * @returns
 */
export const fetchTournamentsList = async () => {
  const query = groq`*[ _type == "tournament" ][]`;

  const result = await client.fetch<Tournament[]>(
    query,
    {},
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  return result;
};

/**
 * This has a revalidate of 15 minutes
 * @param tournamentId
 * @returns
 */
export const fetchTournamentDetails = async (tournamentId: string) => {
  const query = groq`*[_type == "tournament" && _id == $tournamentId][0] {
      ...,
      "games": games[]{
        ...,
        "organiziers": organiziers[]->,
        "participants": participants[]->,
        "firstPlace": firstPlace[]->,
        "secondPlace": secondPlace[]->,
        "thirdPlace": thirdPlace[]->,
        "spectators": spectators[]->,
      }
    }`;

  const result = await client.fetch<TournamentDetails | null>(
    query,
    {
      tournamentId,
    },
    {
      next: {
        revalidate: 900,
      },
    }
  );

  return result;
};
