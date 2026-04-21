import type { CollectionConfig } from 'payload'

export const Games: CollectionConfig = {
  slug: 'games',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name',       type: 'text', required: true },
    { name: 'tournament', type: 'relationship', relationTo: 'tournaments', required: true },
    { name: 'gameType',   type: 'relationship', relationTo: 'game-types' },
    { name: 'date',       type: 'date' },
    {
      name: 'status',
      type: 'select',
      options: ['planned', 'scheduled', 'live', 'done', 'cancelled'],
      defaultValue: 'planned',
    },
    { name: 'location', type: 'text' },
    { name: 'duration', type: 'number', admin: { description: 'Minutter' } },
    {
      name: 'format',
      type: 'select',
      options: ['placement', 'score', 'time', 'bracket'],
      defaultValue: 'placement',
    },

    // Deltakelse
    { name: 'organizers',   type: 'relationship', relationTo: 'players', hasMany: true },
    { name: 'participants', type: 'relationship', relationTo: 'players', hasMany: true },
    { name: 'spectators',   type: 'relationship', relationTo: 'players', hasMany: true },

    // Plasseringer
    { name: 'firstPlace',  type: 'relationship', relationTo: 'players', hasMany: true },
    { name: 'secondPlace', type: 'relationship', relationTo: 'players', hasMany: true },
    { name: 'thirdPlace',  type: 'relationship', relationTo: 'players', hasMany: true },

    // Innhold
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    { name: 'heroPhoto', type: 'upload', relationTo: 'media' },
    { name: 'story',     type: 'richText' },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        { name: 'quote',  type: 'text', required: true },
        { name: 'player', type: 'relationship', relationTo: 'players' },
      ],
    },

    // Tidsbasert
    {
      name: 'timeResults',
      type: 'array',
      admin: { condition: (data) => data.format === 'time' },
      fields: [
        { name: 'player',  type: 'relationship', relationTo: 'players', required: true },
        { name: 'round',   type: 'number', required: true },
        { name: 'lapTime', type: 'text',   required: true },
      ],
    },

    // Bracket
    {
      name: 'bracketType',
      type: 'select',
      options: ['single_elimination', 'double_elimination', 'round_robin'],
      admin: { condition: (data) => data.format === 'bracket' },
    },
    {
      name: 'bracketData',
      type: 'json',
      admin: { condition: (data) => data.format === 'bracket' },
    },
    {
      name: 'isDone',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Legacy-felt for Sanity-migrering' },
    },
  ],
}
