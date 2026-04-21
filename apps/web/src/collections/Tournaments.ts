import type { CollectionConfig } from 'payload'

export const Tournaments: CollectionConfig = {
  slug: 'tournaments',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name',  type: 'text', required: true },
    { name: 'slug',  type: 'text', required: true, unique: true },
    {
      name: 'status',
      type: 'select',
      options: ['planned', 'active', 'finished'],
      defaultValue: 'planned',
      required: true,
    },
    { name: 'startDate',   type: 'date' },
    { name: 'year',        type: 'number' },
    { name: 'coverImage',  type: 'upload', relationTo: 'media' },
    { name: 'posterImage', type: 'upload', relationTo: 'media' },
    {
      name: 'pointRules',
      type: 'group',
      fields: [
        { name: 'participation',               type: 'number', defaultValue: 3 },
        { name: 'firstPlace',                  type: 'number', defaultValue: 3 },
        { name: 'secondPlace',                 type: 'number', defaultValue: 2 },
        { name: 'thirdPlace',                  type: 'number', defaultValue: 1 },
        { name: 'organizedWithParticipation',  type: 'number', defaultValue: 1 },
        { name: 'organizedWithoutParticipation', type: 'number', defaultValue: 3 },
        { name: 'spectator',                   type: 'number', defaultValue: 1 },
      ],
    },
  ],
}
