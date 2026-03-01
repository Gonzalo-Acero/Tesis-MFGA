import { buildStaticAssetUrl } from '@/lib/config';
import type { GuideProfileContent } from '@/types';

export const GUIDE_PROFILES: GuideProfileContent[] = [
  {
    key: 'miguel-fernandez',
    names: ['Dancer Miguel Fernandez', 'Miguel Fernandez'],
    location: 'Teatro Colon',
    imageUrl: buildStaticAssetUrl(
      'after_login',
      'Audio_guides',
      'AudioGuides',
      'dancer-miguel-fernandez-profile.jpeg'
    ),
    description:
      'I am a classical dancer and performing arts guide who spent more than two decades on the stage of Teatro Colon. Today I share the discipline, history, and backstage stories that shaped one of Argentina\'s most iconic cultural venues.',
  },
  {
    key: 'maria-lopez',
    names: ['Dr. Maria Lopez', 'Maria Lopez'],
    location: 'Iguazu Falls',
    imageUrl: buildStaticAssetUrl(
      'after_login',
      'Audio_guides',
      'AudioGuides',
      'dr-maria-lopez-profile.jpeg'
    ),
    description:
      'I am an environmental scientist focused on biodiversity and conservation in Iguazu National Park. My work combines research, education, and guided interpretation to help visitors understand why protecting this ecosystem matters globally.',
  },
  {
    key: 'carlos-mendes',
    names: [
      'Prof. Carlos Mendes',
      'Prof. Carlos Mendez',
      'Carlos Mendes',
      'Carlos Mendez',
    ],
    location: 'The Obelisk',
    imageUrl: buildStaticAssetUrl(
      'after_login',
      'Audio_guides',
      'AudioGuides',
      'prof-carlos-mendez-profile.jpeg'
    ),
    description:
      'I am a professor of urban history and researcher of Argentine heritage. I guide visitors through the stories behind Buenos Aires landmarks, connecting architecture, politics, and city life to explain how these monuments became national symbols.',
  },
  {
    key: 'ana-torres',
    names: ['Biologist Ana Torres', 'Ana Torres'],
    location: 'Cerro Catedral',
    imageUrl: buildStaticAssetUrl(
      'after_login',
      'Audio_guides',
      'AudioGuides',
      'biologist-ana-torres-profile.jpeg'
    ),
    description:
      'I am a biologist specializing in high-altitude ecosystems and Patagonian mountain ecology. I guide travelers through the wildlife, glaciers, and resilience of Cerro Catedral so they can experience the mountain with greater scientific and cultural context.',
  },
];
