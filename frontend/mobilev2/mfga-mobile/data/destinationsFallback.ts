import type { Destination } from '@/types';

export const DESTINATION_FALLBACK: Destination[] = [
  {
    id: '1',
    name: 'Perito Moreno Glacier',
    city: 'El Calafate',
    province: 'Santa Cruz',
    category: 'Nature',
    tag: 'UNESCO Site',
    description:
      'One of the world\'s most awe-inspiring natural wonders, the Perito Moreno Glacier stretches 30 km and towers 60 metres above Lake Argentino.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
      'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    ],
    highlights: [
      'Watch massive ice blocks calve into the turquoise lake',
      'Walk the elevated boardwalks for panoramic glacier views',
      'Take an ice trekking adventure on the glacier surface',
      'Witness the spectacular rupture cycle every 4-5 years',
      'Spot Andean condors soaring above the ice field',
    ],
    bestTimeToVisit: 'October - April',
    estimatedBudget: '$80-$150 USD/day',
    duration: '1-2 days',
    mapEmbedUrl: 'https://www.google.com/maps/place/Perito+Moreno+Glacier/',
    audioGuides: [
      {
        title: 'Glacier Formation and History',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      },
      {
        title: 'Wildlife of Los Glaciares',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      },
    ],
    tips: [
      'Arrive early to beat the crowds and get the best light for photos.',
      'Bring layered clothing because glacial winds can be cold even in summer.',
      'Book ice trekking tours at least 48 hours in advance.',
      'The park entrance fee is approximately $25 USD for foreigners.',
    ],
  },
  {
    id: '2',
    name: 'Buenos Aires',
    city: 'Buenos Aires',
    province: 'Buenos Aires',
    category: 'City',
    tag: 'Capital City',
    description:
      'The vibrant capital of Argentina blends European architecture with tango, steakhouses, colorful La Boca, and a buzzing nightlife.',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1400&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80',
      'https://images.unsplash.com/photo-1548783300-4d4d4d4d4d4d?w=800&q=80',
      'https://images.unsplash.com/photo-1612294037637-ec400d0e5d97?w=800&q=80',
      'https://images.unsplash.com/photo-1552353617-3bfd679b3bdd?w=800&q=80',
    ],
    highlights: [
      'Explore the colorful Caminito street in La Boca',
      'Watch a live tango show in San Telmo or Palermo',
      'Visit the Recoleta Cemetery',
      'Stroll Avenida 9 de Julio',
      'Dine on a world-famous Argentine asado',
    ],
    bestTimeToVisit: 'March - May, September - November',
    estimatedBudget: '$60-$120 USD/day',
    duration: '3-5 days',
    mapEmbedUrl: 'https://www.google.com/maps/place/Buenos+Aires/',
    audioGuides: [
      {
        title: 'History of Buenos Aires',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      },
      {
        title: 'Tango and Culture Walking Tour',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      },
    ],
    tips: [
      'Use the Subte for fast travel around the city.',
      'Avoid peak summer if you dislike humidity.',
      'Many restaurants open for dinner after 9 PM.',
      'Exchange money at official exchange houses for better rates.',
    ],
  },
  {
    id: '3',
    name: 'Iguazu Falls',
    city: 'Puerto Iguazu',
    province: 'Misiones',
    category: 'Nature',
    tag: '7th Wonder',
    description:
      'A network of 275 waterfalls spanning nearly 3 km across the Argentine-Brazilian border.',
    image: 'https://images.unsplash.com/photo-1544015759-237f2a4ac73f?w=600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1544015759-237f2a4ac73f?w=1400&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1544015759-237f2a4ac73f?w=800&q=80',
      'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=800&q=80',
      'https://images.unsplash.com/photo-1612789083373-1dab5eda2e6d?w=800&q=80',
      'https://images.unsplash.com/photo-1502920514313-52581002a659?w=800&q=80',
    ],
    highlights: [
      'Stand at the Devil\'s Throat viewpoint',
      'Take a zodiac boat ride under the spray',
      'Spot toucans, coatis, and butterflies',
      'Visit both the Argentine and Brazilian sides',
      'Start early for the best light and fewer crowds',
    ],
    bestTimeToVisit: 'August - November',
    estimatedBudget: '$70-$130 USD/day',
    duration: '2-3 days',
    mapEmbedUrl: 'https://www.google.com/maps/place/Iguazu+Falls/',
    audioGuides: [
      {
        title: 'The Power of Iguazu',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      },
      {
        title: 'Jungle Wildlife Guide',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      },
    ],
    tips: [
      'Bring waterproof clothing for the boat ride.',
      'The Argentine side has more trails and closer access.',
      'Go early in the morning before the park gets crowded.',
      'Bring insect repellent.',
    ],
  },
  {
    id: '4',
    name: 'Mendoza Wine Region',
    city: 'Mendoza',
    province: 'Mendoza',
    category: 'Culture',
    tag: 'Wine Country',
    description:
      'Argentina\'s wine capital at the foot of the Andes offers Malbec tastings, vineyard routes, and mountain views.',
    image: 'https://images.unsplash.com/photo-1474314881477-04c4aac40a0e?w=600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1474314881477-04c4aac40a0e?w=1400&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1474314881477-04c4aac40a0e?w=800&q=80',
      'https://images.unsplash.com/photo-1566378246598-5b11a0d486cc?w=800&q=80',
      'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    ],
    highlights: [
      'Cycle the vineyard routes of Maipu and Lujan de Cuyo',
      'Taste world-class Malbec at boutique bodegas',
      'Enjoy olive oil and cheese pairings',
      'Visit Aconcagua on a day trip',
      'Join the Vendimia harvest festival',
    ],
    bestTimeToVisit: 'March - May',
    estimatedBudget: '$55-$110 USD/day',
    duration: '2-4 days',
    mapEmbedUrl: 'https://www.google.com/maps/place/Mendoza/',
    audioGuides: [
      {
        title: 'The Art of Argentine Malbec',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      },
      {
        title: 'Mendoza City Walking Tour',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      },
    ],
    tips: [
      'Rent a bicycle in Maipu for flat vineyard routes.',
      'Book winery tours in advance during harvest season.',
      'The city has strong restaurant and cafe options.',
      'Pair your Malbec with local empanadas.',
    ],
  },
  {
    id: '5',
    name: 'Bariloche and Patagonia',
    city: 'San Carlos de Bariloche',
    province: 'Rio Negro',
    category: 'Adventure',
    tag: 'Mountain Escape',
    description:
      'An alpine town on Nahuel Huapi Lake where travelers can hike, ski, kayak, and sample legendary chocolate.',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    ],
    highlights: [
      'Hike the Cerro Catedral circuit',
      'Ski or snowboard at Cerro Catedral',
      'Kayak on Nahuel Huapi Lake',
      'Drive Ruta de los Siete Lagos',
      'Sample artisan chocolate around town',
    ],
    bestTimeToVisit: 'December - February, June - August',
    estimatedBudget: '$65-$130 USD/day',
    duration: '3-5 days',
    mapEmbedUrl: 'https://www.google.com/maps/place/Bariloche/',
    audioGuides: [
      {
        title: 'Bariloche and the Lake District',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      },
      {
        title: 'Andean Trekking Guide',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
      },
    ],
    tips: [
      'The cable car to the summit is worth the views.',
      'Book accommodation months ahead for ski season.',
      'Try local craft beer alongside the chocolate.',
      'Public buses cover many key spots.',
    ],
  },
  {
    id: '6',
    name: 'Salta and the Northwest',
    city: 'Salta',
    province: 'Salta',
    category: 'Culture',
    tag: 'Colonial Heritage',
    description:
      'Salta combines colonial architecture, Andean culture, and dramatic landscapes such as the Quebrada de Humahuaca.',
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1400&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80',
      'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&q=80',
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    ],
    highlights: [
      'Explore the Quebrada de Humahuaca valley',
      'Ride the Train to the Clouds',
      'Visit the Cathedral and MAAM museum',
      'Taste humitas, tamales, and locro',
      'See the Cerro de los Siete Colores',
    ],
    bestTimeToVisit: 'April - October',
    estimatedBudget: '$50-$100 USD/day',
    duration: '3-5 days',
    mapEmbedUrl: 'https://www.google.com/maps/place/Salta/',
    audioGuides: [
      {
        title: 'Colonial Salta City Tour',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
      },
      {
        title: 'The Quebrada de Humahuaca',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
      },
    ],
    tips: [
      'Altitude can affect visitors, so acclimatize slowly.',
      'A local guide helps unlock the best cultural context.',
      'The Train to the Clouds should be booked in advance.',
      'Local markets offer strong artisan textile options.',
    ],
  },
];
