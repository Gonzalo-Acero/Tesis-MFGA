import type { CommunityGroup, CommunityMeetup } from '@/types';

export const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: 1,
    icon: 'compass',
    name: 'Backpackers in Argentina',
    description: 'Budget routes, hostels, bus tips, and low-cost planning across provinces.',
    members: 1200,
  },
  {
    id: 2,
    icon: 'coffee',
    name: 'Food Lovers',
    description: 'Regional dishes, local markets, and restaurant recommendations.',
    members: 890,
  },
  {
    id: 3,
    icon: 'mountain',
    name: 'Nature and Adventure',
    description: 'Trekking, parks, wildlife, and outdoor preparation advice.',
    members: 1500,
  },
  {
    id: 4,
    icon: 'home',
    name: 'City Explorers',
    description: 'Architecture, museums, neighborhoods, and urban routes.',
    members: 980,
  },
];

export const COMMUNITY_MEETUPS: CommunityMeetup[] = [
  {
    id: 201,
    day: '25',
    month: 'NOV',
    title: 'Buenos Aires City Walk',
    location: 'Recoleta, Buenos Aires',
    summary: 'Walk through historic neighborhoods with local travelers and photographers.',
    attendees: 26,
  },
  {
    id: 202,
    day: '30',
    month: 'NOV',
    title: 'Mendoza Wine Tasting',
    location: 'Lujan de Cuyo, Mendoza',
    summary: 'Community tasting and winery tour with shared transportation options.',
    attendees: 18,
  },
  {
    id: 203,
    day: '05',
    month: 'DEC',
    title: 'Patagonia Hiking Group',
    location: 'El Chalten, Santa Cruz',
    summary: 'Moderate route with weather, gear, and safety checklists.',
    attendees: 31,
  },
];
