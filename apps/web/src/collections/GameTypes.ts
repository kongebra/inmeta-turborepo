import type { CollectionConfig } from 'payload'

export const GameTypes: CollectionConfig = {
  slug: 'game-types',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: { description: 'dart, sjakk, discgolf, bar-quiz, …' },
    },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Emoji: 🎯 🏓 ⛳' },
    },
  ],
}
