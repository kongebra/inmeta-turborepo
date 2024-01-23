import { groq } from "next-sanity";
import { client } from ".";
import { Tournament, TournamentDetails } from "./types";

export const fetchTournamentsList = async () => {
  const query = groq`*[ _type == "tournament" ][]`;

  const result = await client.fetch<Tournament[]>(query);

  return result;
};

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

  const result = await client.fetch<TournamentDetails | null>(query, {
    tournamentId,
  });

  return result;
};
