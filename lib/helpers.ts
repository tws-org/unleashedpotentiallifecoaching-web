import { parseISO, format } from 'date-fns';
import {
  BANNER_URL,
  BOOLEAN_CHOICE,
  PAGE_IDS,
  SEO_DEFAULTS,
  SERVICES_LIST,
  SERVICES_OPTIONS,
  SITE_NAVS,
  SITE_TITLE,
} from './constants';

export const urlify = (str: string): string =>
  str.replace(/\s+/g, '-').toLowerCase();

export const removeSlashFromSlug = (slug: string) => slug.replace('/', '');

// date conversion
export const formatDate = (date: string): string | undefined => {
  const dateObj = new Date(date);
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const results = `${
    month[dateObj.getMonth()]
  } ${dateObj.getDate()}, ${dateObj.getFullYear()}`;

  return results;
};

export const organizeVideos = (videos: any) => {
  const results: any = [];

  for (let i = 0; i < videos?.pages?.length; i++) {
    const page = videos?.pages[i];

    for (let j = 0; j < page?.items.length; j++) {
      const item = page?.items[j];
      results.push(item);
    }
  }

  return results;
};

export const formatDateToReadableString = (isoDateString: string): string => {
  const date = parseISO(isoDateString);
  const formattedDate = format(date, "MMMM d, yyyy 'at' h:mm a");
  return formattedDate;
};

export const siteConstants = {
  banner_url: BANNER_URL,
  boolean_choices: BOOLEAN_CHOICE,
  page_ids: PAGE_IDS,
  service_list: SERVICES_LIST,
  service_options: SERVICES_OPTIONS,
  site_navigation: SITE_NAVS,
  seo_default: SEO_DEFAULTS,
  site_title: SITE_TITLE,
};
