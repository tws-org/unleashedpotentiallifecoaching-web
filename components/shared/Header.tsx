import { useContext, Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { XMarkIcon, Bars4Icon } from '@heroicons/react/24/outline';
import { ConstantsContext } from 'contexts/ConstantsContext';

const Header = () => {
  const { site_navigation } = useContext(ConstantsContext);

  return (
    <Disclosure as="header" className="bg-white shadow sticky top-0 z-40">
      {({ open }) => (
        <>
          <nav
            aria-label="Main"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-row  justify-between sm:flex-col sm:items-center sm:justify-center">
              <div className="mt-2">
                <div className="text-left sm:text-center">
                  <p className="font-bold italic m-1 text-xl sm:text-3xl p-0 font-serif text-forrest">
                    Unleashed Potential: Life Coaching & Counseling
                  </p>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8 h-12">
                  {site_navigation.map(({ id, slug, children, label }) =>
                    slug ? (
                      <Link
                        key={id}
                        href={slug}
                        className="border-transparent text-forrest hover:border-forrest hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-4 text-lg font-medium ease-in duration-200"
                      >
                        {label}
                      </Link>
                    ) : (
                      <Menu as="div" key={id}>
                        <Menu.Button className="h-12 border-transparent text-forrest hover:border-forrest hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-4 text-lg font-medium ease-in duration-200">
                          {label}
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute w-48 rounded-md shadow-lg py-1 bg-offwhite ring-1 ring-black ring-opacity-5 focus:outline-none z-40">
                            {children?.map(({ id, slug, label, open }: any) => (
                              <Menu.Item key={id}>
                                {open ? (
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={slug}
                                    className="block px-4 py-2 text-base text-forrest hover:bg-gray-200 hover:text-gray-700 data-[focus]:bg-gray-200 data-[focus]:text-gray-700"
                                  >
                                    {label}
                                  </a>
                                ) : (
                                  <Link
                                    href={slug}
                                    className="block px-4 py-2 text-base text-forrest hover:bg-gray-200 hover:text-gray-700 data-[focus]:bg-gray-200 data-[focus]:text-gray-700"
                                  >
                                    {label}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    ),
                  )}
                  <a
                    href="#contact"
                    className="border-transparent text-forrest hover:border-forrest hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-4 text-lg font-medium ease-in duration-200"
                  >
                    Contact
                  </a>
                </div>
              </div>
              {/** Mobile Menu */}
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-forrest">
                  <span className="sr-only">
                    {open ? 'Close main menu' : 'Open main menu'}
                  </span>
                  {open ? (
                    <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                  ) : (
                    <Bars4Icon className="block h-8 w-8" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </nav>
          <Disclosure.Panel className="sm:hidden border-t absolute shadow-xl w-full z-10 bg-white">
            <div className="pt-2 pb-3 space-y-1">
              {site_navigation.map(({ id, slug, children, label }) =>
                slug ? (
                  <Disclosure.Button
                    as="a"
                    href={slug}
                    key={id}
                    className="border-transparent text-forrest hover:bg-gray-50 hover:border-forrest hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  >
                    {label}
                  </Disclosure.Button>
                ) : (
                  <div
                    key={id}
                    className="border-transparent text-forrest block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  >
                    {label}
                    <ul className="ml-4 mt-3 -mb-3">
                      {children?.map(({ id, slug, label }) => (
                        <li key={id} className="mb-3">
                          {slug && (
                            <Disclosure.Button
                              as={Link}
                              href={slug}
                              className="hover:underline"
                            >
                              {label}
                            </Disclosure.Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
              <Disclosure.Button
                as="a"
                href="#contact"
                className="border-transparent text-forrest hover:bg-gray-50 hover:border-forrest hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Contact
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
