import { defineArrayMember, defineField, defineType } from "sanity";

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
    } as any),
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
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
      group: "info",
    } as any),
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
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
      group: "participants",
    } as any),

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
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
      group: "results",
    } as any),
    defineField({
      type: "array",
      name: "secondPlace",
      title: "Andre plass",
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
      group: "results",
    } as any),
    defineField({
      type: "array",
      name: "thirdPlace",
      title: "Tredje plass",
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
      group: "results",
    } as any),

    defineField({
      type: "array",
      name: "spectators",
      title: "Tilskuere",
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
      group: "spectators",
    } as any),
  ],
});
