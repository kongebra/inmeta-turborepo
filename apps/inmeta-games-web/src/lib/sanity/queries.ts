import { groq } from "next-sanity";
import { client } from ".";
import {
  Person,
  PlayerDetails,
  PlayerWinLossStats,
  Tournament,
  TournamentDetails,
} from "./types";

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
        revalidate: 60,
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
        revalidate: 60,
      },
    }
  );

  return result;
};

export const fetchPlayers = async () => {
  const query = groq`*[_type == "person"][]`;

  const result = await client.fetch<Person[]>(
    query,
    {},
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return result;
};

export const fetchPlayerDetails = async (playerId: string) => {
  const query = groq`*[_type == "person" && _id == $playerId][0] {
  ...,
  "tournaments": *[_type == "tournament" && references(^._id)][] {
    _id,
    name,
    slug,
    "games": games[references(^.^._id) && isDone == true]{

      _key,
      name,
      "placement": select(
        ^.^._id in firstPlace[]->._id => 1,
        ^.^._id in secondPlace[]->._id => 2,
        ^.^._id in thirdPlace[]->._id => 3,
        0
      ),
      "organizer": ^.^._id in organiziers[]->._id,
    },

  },
  "spectatedGameCount": count(*[_type == "tournament"][].games[^._id in spectators[]->._id])
}`;

  const result = await client.fetch<PlayerDetails | null>(
    query,
    { playerId },
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return result;
};

export const fetchPlayerWinLossStats = async () => {
  const query = groq`*[_type == "tournament"][] {
    "games": games[isDone == true] {
      "firstPlaceIds": firstPlace[]->._id,
      "participantIds": participants[]->._id
    }
  }`;

  const result = await client.fetch<PlayerWinLossStats>(
    query,
    {},
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return result;
};
