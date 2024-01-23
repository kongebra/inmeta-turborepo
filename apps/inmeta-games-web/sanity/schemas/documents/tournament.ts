import { defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "tournament",
  title: "Turnering",
  groups: [
    {
      name: "info",
      title: "Info",
      default: true,
    },
    {
      name: "games",
      title: "Spill",
    },
    {
      name: "pointRules",
      title: "Poengregler",
    },
  ],
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Navn",
      group: "info",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      group: "info",
    }),
    defineField({
      name: "games",
      title: "Spill",
      type: "array",
      of: [{ type: "game" }],
      group: "games",
    }),

    defineField({
      name: "pointRules",
      title: "Poengregler",
      type: "tournamentPointRules",
      group: "pointRules",
    }),
  ],
});
