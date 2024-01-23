import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "game",
  title: "Spill",
  groups: [
    {
      name: "info",
      title: "Info",
      default: true,
    },
    {
      name: "participants",
      title: "Deltakere",
    },
    {
      name: "results",
      title: "Resultater",
    },
    {
      name: "spectators",
      title: "Tilskuere",
    },
  ],
  fields: [
    defineType({
      type: "string",
      name: "name",
      title: "Navn",
      group: "info",
    }),
    defineField({
      type: "text",
      name: "description",
      title: "Beskrivelse",
      group: "info",
    }),
    defineField({
      type: "image",
      name: "image",
      title: "Bilde",
      options: {
        hotspot: true,
      },
      group: "info",
    }),
    defineField({
      type: "array",
      name: "organiziers",
      title: "Arrangører",
      of: [{ type: "reference", to: [{ type: "person" }] }],
      group: "info",
    }),
    defineField({
      type: "boolean",
      name: "isOrganizersParticipating",
      title: "Deltok arrangører?",
      group: "info",
      initialValue: false,
    }),

    defineField({
      type: "array",
      name: "participants",
      title: "Deltakere",
      of: [{ type: "reference", to: [{ type: "person" }] }],
      group: "participants",
    }),

    defineField({
      type: "boolean",
      name: "isDone",
      title: "Er klar for resultattavle",
      initialValue: false,
      group: "results",
    }),
    defineField({
      type: "array",
      name: "firstPlace",
      title: "Første plass",
      of: [{ type: "reference", to: [{ type: "person" }] }],
      group: "results",
    }),
    defineField({
      type: "array",
      name: "secondPlace",
      title: "Andre plass",
      of: [{ type: "reference", to: [{ type: "person" }] }],
      group: "results",
    }),
    defineField({
      type: "array",
      name: "thirdPlace",
      title: "Tredje plass",
      of: [{ type: "reference", to: [{ type: "person" }] }],
      group: "results",
    }),

    defineField({
      type: "array",
      name: "spectators",
      title: "Tilskuere",
      of: [{ type: "reference", to: [{ type: "person" }] }],
      group: "spectators",
    }),
  ],
});
