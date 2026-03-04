export type SanitySlug = {
  _type: "slug";
  current: string;
};

export type SanityReference = {
  _ref: string;
  _type: "reference";
  _key: string;
};

export type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
};

export type TournamentPointRules = {
  participation: number;
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  organizedWithParticipation: number;
  organizedWithoutParticipation: number;
  spectator: number;
};

export type Tournament = {
  _type: "tournament";
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;

  name: string;
  slug: SanitySlug;

  games: Game[];

  pointRules: TournamentPointRules;
};

export type Game = {
  _type: "game";
  _key: string;

  name: string;
  description: string;
  image: SanityImage;

  organiziers: SanityReference[];
  isOrganizersParticipating: boolean;

  participants: SanityReference[];

  isDone: boolean;
  firstPlace: SanityReference[];
  secondPlace: SanityReference[];
  thirdPlace: SanityReference[];

  spectators: SanityReference[];
};

export type TournamentDetails = {
  _type: "tournament";
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;

  name: string;
  slug: SanitySlug;

  games: GameDetails[];

  pointRules: TournamentPointRules;
};

export type GameDetails = {
  _type: "game";
  _key: string;

  name: string;
  description: string;
  image: SanityImage | null;

  organiziers: Person[] | null;
  isOrganizersParticipating: boolean;

  participants: Person[] | null;

  isDone: boolean;
  firstPlace: Person[] | null;
  secondPlace: Person[] | null;
  thirdPlace: Person[] | null;

  spectators: Person[] | null;
};

export type Person = {
  _type: "person";
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;

  firstName: string;
  lastName: string;
  image: SanityImage;
};

export type PlayerDetails = Person & {
  tournaments: {
    _id: string;
    name: string;
    slug: SanitySlug;
    games: {
      _key: string;
      name: string;
      placement: number;
      organizer: boolean;
    }[];
  }[];
  spectatedGameCount: number;
};

export type PlayerWinLossStats = {
  games: {
    firstPlaceIds: string[] | null;
    participantIds: string[] | null;
  }[];
}[];
