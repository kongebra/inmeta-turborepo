import type { CollectionConfig } from 'payload'

export const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'firstName',
  },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'nickname',
      type: 'text',
      admin: { description: 'Vis på scoreboard — eks. «Grandmester»' },
    },
    {
      name: 'homeBase',
      type: 'text',
      admin: { description: 'Trondheim-bydel: Byåsen, Lade, Møllenberg, …' },
    },
    {
      name: 'signatureGame',
      type: 'relationship',
      relationTo: 'game-types',
    },
    {
      name: 'funFact',
      type: 'text',
    },
  ],
}
