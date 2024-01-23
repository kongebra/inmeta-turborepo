import { defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "person",
  title: "Person",
  fields: [
    defineField({
      type: "string",
      name: "firstName",
      title: "Fornavn",
    }),
    defineField({
      type: "string",
      name: "lastName",
      title: "Etternavn",
    }),
    defineField({
      type: "image",
      name: "image",
      title: "Bilde",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      firstName: "firstName",
      lastName: "lastName",
      image: "image",
    },
    prepare(value) {
      const { firstName, lastName, image } = value;

      return {
        title: `${firstName} ${lastName}`,
        media: image,
      };
    },
  },
});
