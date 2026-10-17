import React, { createContext } from 'react';
import { siteConstants } from 'utils/helpers';

interface ContextProps {
  banner_url: string;
  boolean_choices: {
    name: string;
    checked: boolean;
  }[];
  page_ids: {
    page: string;
    id: string;
  }[];
  seo_defaults: {
    title: string;
    metaDescription: string;
  };
  service_list: {
    id: number;
    slug: string;
    service: string;
  }[];
  service_options: {
    name: string;
    checked: boolean;
  }[];
  site_title: string;
  site_navigation: {
    id: number;
    label: string;
    slug?: string;
    children?: {
      id: number;
      label: string;
      slug?: string;
      open?: boolean;
    }[];
  }[];
}

const defaultProps = {
  banner_url: '',
  boolean_choices: [
    {
      name: 'Yes',
      checked: false,
    },
  ],
  page_ids: [
    {
      page: 'Home',
      id: '1',
    },
  ],
  seo_defaults: {
    title: 'seo title',
    metaDescription: 'seo description',
  },
  service_list: [
    {
      id: 1,
      slug: '/coach',
      service: 'Coaching',
    },
  ],
  service_options: [
    {
      name: 'Yes',
      checked: false,
    },
  ],
  site_title: 'site title',
  site_navigation: [
    {
      id: 1,
      label: 'Home',
      slug: '/',
      children: [
        {
          id: 1,
          label: 'Home child',
          slug: '/home/child',
          open: false,
        },
      ],
    },
  ],
};

export const ConstantsContext = createContext<ContextProps>(defaultProps);

export const ConstantsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ConstantsContext.Provider
      value={{
        ...siteConstants,
        seo_defaults: siteConstants.seo_default,
        page_ids: siteConstants.page_ids,
        site_navigation: siteConstants.site_navigation.map((nav: any) => ({
          ...nav,
          // Ensure slug is string or undefined, not null
          slug: nav.slug === null ? undefined : nav.slug,
          children: nav.children
            ? nav.children.map((child: any) => ({
                ...child,
                slug: child.slug === null ? undefined : child.slug,
              }))
            : undefined,
        })),
      }}
    >
      {children}
    </ConstantsContext.Provider>
  );
};
