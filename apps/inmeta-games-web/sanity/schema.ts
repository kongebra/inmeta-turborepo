import { type SchemaTypeDefinition } from "sanity";

import person from "./schemas/documents/person";
import tournament from "./schemas/documents/tournament";
import game from "./schemas/objects/game";
import tournamentPointRules from "./schemas/objects/tournamentPointRules";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    tournament,
    person,

    // objects
    game,
    tournamentPointRules,
  ],
};
