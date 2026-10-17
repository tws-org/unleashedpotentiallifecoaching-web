import React from 'react';
import Link from 'next/link';

const FOOTER_LINKS = [
  {
    slug: '/services',
    label: 'Services',
  },
  {
    slug: '/disclaimer',
    label: 'Disclaimer',
  },
  {
    slug: '/sitemap.xml',
    label: 'Sitemap',
  },
];

const SubFooter = () => {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col h-4 mt-12 border-t border-black sm:flex-row sm:justify-between">
      <p className="mt-4 text-forrest">Unleashed Potential ©️ {year}</p>
      <ul className="flex mt-4">
        {FOOTER_LINKS.map(({ slug, label }, index) =>
          slug !== FOOTER_LINKS[2].slug ? (
            <li key={`${label}-${index}`}>
              <Link
                href={slug}
                className="mx-4 font-serif text-lg italic text-forrest hover:underline"
              >
                {label}
              </Link>
            </li>
          ) : (
            <li key={`${label}-${index}`}>
              <a
                href={slug}
                className="mx-4 font-serif text-lg italic text-forrest hover:underline"
              >
                {label}
              </a>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default SubFooter;
