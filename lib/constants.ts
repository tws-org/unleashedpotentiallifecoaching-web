export const CONTENTFUL_GRAPHQL_API_URL = process.env
  .NEXT_PUBLIC_CONTENTFUL_GRAPHQL_API_URL as string | undefined;

export const CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN = process.env
  .NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN as string | undefined;

export const FAILED_EMAIL_MESSAGE: string =
  'There was an issue with your submission, please email the details to unleashedpotential@gmail.com';
export const successEmailMessage = (page: string) =>
  `Thank you for your ${page} submission. We will reach out you shortly!`;

export const SITE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://www.jessrebelo.com/'
    : 'http://localhost:3000';

export const CONTACT_INFO = [
  'Jessica: (631) 432-8897',
  'unleashedpotentiallifecoaching@gmail.com',
];

export const headers = {
  'Content-Type': 'application/json',
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
  Accept: 'application/json; charset=UTF-8',
  Authorization: '',
};

export const CACHE_CONTROL = 'Cache-Control';
export const CACHE_LIFE = 'public, s-maxage=300, stale-while-revalidate=59';

export const CAROUSEL_COACHES_LIST = ['Jessica Rebelo'];

export const CTA_CAROUSEL_ITEMS = [
  {
    source: '/images/cta-carousel/1.webp',
    alt: 'Jess Rebelo explaining EMDR therapy for processing distressing or traumatic memories',
  },
  {
    source: '/images/cta-carousel/2.webp',
    alt: 'Jess Rebelo providing specialized trauma therapy support to help individuals navigate their healing journey.',
  },
  {
    source: '/images/cta-carousel/3.webp',
    alt: 'Jess Rebelo, a trauma-informed life coach, offering guidance and support for a more fulfilling life.',
  },
  {
    source: '/images/cta-carousel/4.webp',
    alt: 'Jess Rebelo utilizing EMDR techniques to help clients with unprocessed trauma',
  },
  {
    source: '/images/cta-carousel/5.webp',
    alt: 'Jess Rebelo, a trauma therapist, using evidence-based techniques like EMDR and CBT for trauma healing.',
  },
  {
    source: '/images/cta-carousel/6.webp',
    alt: 'Jess Rebelo providing trauma-informed life coaching to help overcome challenges and improve well-being.',
  },
  {
    source: '/images/cta-carousel/7.webp',
    alt: 'Jess Rebelo discussing the benefits of EMDR in managing psychological and physical difficulties from past trauma',
  },
  {
    source: '/images/cta-carousel/8.webp',
    alt: 'Jess Rebelo guiding clients through emotional regulation and coping strategies in trauma-focused therapy sessions.',
  },
  {
    source: '/images/cta-carousel/9.webp',
    alt: "Jess Rebelo's trauma-informed coaching sessions focus on goal setting, resilience building, and personal growth.",
  },
];

export const PROFILE_CAROUSEL_ITEMS = [
  {
    source: '/images/profile/1.webp',
    alt: 'Jess Rebelo explaining EMDR therapy for processing distressing or traumatic memories',
  },
  {
    source: '/images/profile/2.webp',
    alt: 'Jess Rebelo providing specialized trauma therapy support to help individuals navigate their healing journey.',
  },
  {
    source: '/images/profile/3.webp',
    alt: 'Jess Rebelo, a trauma-informed life coach, offering guidance and support for a more fulfilling life.',
  },
];
export const GA_ID = 'G-X4HKDL4H2G';

export const NEXT_PUBLIC_CONTENTFUL_GRAPHQL_API_URL: string | unknown =
  process.env.NEXT_PUBLIC_CONTENTFUL_GRAPHQL_API_URL;
export const NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN:
  | string
  | unknown = process.env.NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN;

export const BOOLEAN_CHOICE = [
  {
    name: 'Yes',
    checked: false,
  },
  {
    name: 'No',
    checked: true,
  },
];

export const SERVICES_OPTIONS = [
  {
    name: 'Excellent',
    checked: false,
  },
  {
    name: 'Good',
    checked: false,
  },
  {
    name: 'Disappointing',
    checked: false,
  },
];

export const SITE_NAVS = [
  {
    id: 1,
    slug: '/',
    label: 'Home',
  },
  {
    id: 2,
    slug: null,
    label: 'Our Team',
    children: [
      {
        id: 1,
        slug: '/coach/jessica-rebelo',
        label: 'Jessica Rebelo',
        open: false,
      },
      {
        id: 3,
        slug: 'https://themendwellness.com/',
        label: 'Kristin Brien',
        open: true,
      },
    ],
  },
  {
    id: 3,
    slug: '/services',
    label: 'Services',
  },
  {
    id: 5,
    slug: null,
    label: 'Media',
    children: [
      {
        id: 1,
        slug: '/blog',
        label: 'Blog',
      },
      {
        id: 2,
        slug: '/interviews',
        label: 'Interviews',
      },
      {
        id: 3,
        slug: '/podcast',
        label: 'Podcast',
      },
    ],
  },
  {
    id: 6,
    slug: '/reviews',
    label: 'Reviews',
  },
];

export const SERVICES_LIST = [
  {
    id: 1,
    slug: '/service/emdr',
    service: 'EMDR',
  },
  {
    id: 2,
    slug: '/service/trauma-therapy',
    service: 'Trauma Therapy',
  },
  {
    id: 3,
    slug: '/service/trauma-informed-life-coaching',
    service: 'Trauma-Informed Life Coaching',
  },
];

export const BANNER_URL: string =
  'https://res.cloudinary.com/tumulty-web-services/image/upload/v1638888993/unleashedpotential/geoffroy-hauwen-hU_A4b397bQ-unsplash.webp';

export const SEO_DEFAULTS = {
  title: 'Unleashed Potential Life Coaching',
  metaDescription:
    'Unleashed Potential: Life Coaching helps you uncover your purpose by identifying negative behaviors and giving a plan to achieve your goals.',
};

export const SITE_TITLE = 'Unleashed Potential';

export const BLOG_PAGE_ID = '6zowWUPrZmyZ0HjQXBnoye';
export const PODCAST_PAGE_ID = '2TrjFekCNc6OGZAsLLB7WK';
export const REVIEWS_PAGE_ID = '7M8IWPzBF60jrl0SiHgUsW';
export const INTERVIEWS_PAGE_ID = '3o5X9MvYCjNeqDdHOQSFZd';

export const PAGE_IDS = [
  {
    page: 'Blog',
    id: BLOG_PAGE_ID,
  },
  {
    page: 'Podcast',
    id: PODCAST_PAGE_ID,
  },
  {
    page: 'Reviews',
    id: REVIEWS_PAGE_ID,
  },
  {
    page: 'Interviews',
    id: INTERVIEWS_PAGE_ID,
  },
];
