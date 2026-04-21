import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  fields: [
    {
      name: 'accentColor',
      type: 'select',
      options: ['neon', 'signal', 'forest', 'red', 'blue'],
      defaultValue: 'neon',
    },
    {
      name: 'themeMode',
      type: 'select',
      options: ['light', 'dark', 'system'],
      defaultValue: 'system',
    },
    {
      type: 'collapsible',
      label: 'Auto-utleda stats',
      fields: [
        { name: 'showTettasteDuell',       type: 'checkbox', defaultValue: true },
        { name: 'showLengstePodiumStripe', type: 'checkbox', defaultValue: true },
        { name: 'showComebackOfTheYear',   type: 'checkbox', defaultValue: true },
        { name: 'showDebutantensSjokk',    type: 'checkbox', defaultValue: true },
        { name: 'showMestAktivArrangor',   type: 'checkbox', defaultValue: true },
        { name: 'showSpellKongar',         type: 'checkbox', defaultValue: true },
        {
          name: 'showBydelskamp',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Krev homeBase på alle spillere' },
        },
        {
          name: 'showNemesis',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Potensielt negativt — opt-in per person' },
        },
        { name: 'showActivityFeed', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
