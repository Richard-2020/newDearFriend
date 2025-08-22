export const categories = [
  'Peers',
  'Central figures',
  'Spousal relationship',
  'Work force',
  'Parenting',
  'Children',
  'Faith',
  'Other'
] as const;

export type Category = typeof categories[number]; 