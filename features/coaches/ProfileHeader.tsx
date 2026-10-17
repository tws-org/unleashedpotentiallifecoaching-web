import { useEffect, useId, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import Button from 'components/atoms/Button';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useRouter } from 'next/router';
import Carousel from 'components/atoms/Carousel';
import { PROFILE_CAROUSEL_ITEMS } from 'utils/constants';
import { useEmails } from 'contexts/EmailsContext';

const BookTimeUp = dynamic(() => import('components/shared/BookTimePopup'));

interface Props {
  name: string;
  profileImage: any;
  welcomeMessage?: any;
}

const ProfileHeader = ({ name, welcomeMessage }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const firstName = name.split(' ')[0];
  const isJessProfile = router.asPath.includes('coach/jessica-rebelo');
  const toastId = useId();
  const settings = useMemo(
    () => ({
      dots: false,
      fade: true,
      infinite: true,
      autoplay: true,
      speed: 2500,
      autoplaySpeed: 2500,
      cssEase: 'ease-in',
      slidesPerRow: 1,
      pauseOnHover: false,
      arrows: false,
    }),
    [],
  );

  const { didSend, response } = useEmails();

  useEffect(() => {
    if (didSend && response) {
      setIsOpen(false);
    }
  }, [didSend, response]);

  return (
    <>
      <div className="lg:flex lg:flex-row lg:justify-start">
        <div className="w-100 m-auto md:w-3/5 lg:w-2/5">
          <Carousel
            settings={settings}
            photoArray={PROFILE_CAROUSEL_ITEMS}
            carouselHeight="profile-image-wrapper"
            borderStyle="shadow-xl border-0"
          />
        </div>
        <div className="flex flex-col mw-full m-2 lg:w-3/5 lg:mx-12">
          <h1 className="text-forrest text-3xl mt-0 font-bold mb-4">
            Hi, I&apos;m {firstName}
          </h1>
          <Details>{documentToReactComponents(welcomeMessage?.json)}</Details>
          <div className="w-full lg:w-80">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-forrest-900 hover:bg-forrest  text-white text-center py-4 px-12 text-xl rounded"
            >
              Book now
            </button>
            <BookTimeUp open={isOpen} setOpen={setIsOpen} />
          </div>
          <div className="w-full">
            {isJessProfile && (
              <div className="mt-10">
                <p className="text-2xl text-forrest-900">
                  <strong>I have some news to share!</strong>
                </p>
                <p className="my-2 text-xl text-forrest-900">
                  {' '}
                  I was recently a guest on a fantastic podcast on{' '}
                  <a
                    href="https://www.womleadmag.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-semibold"
                  >
                    {' '}
                    WomLead Magazine.
                  </a>
                </p>
                <p className="mb-2 text-xl text-forrest-900">
                  You can check it out on all popular podcast streaming services
                </p>
                <ul className="list-disc ml-6 mt-8 text-forrest-900">
                  <li className="mb-3">
                    YouTube:{' '}
                    <a
                      href="https://youtu.be/AOTdkjDBdzM"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      https://youtu.be/AOTdkjDBdzM
                    </a>
                  </li>
                  <li className="mb-3">
                    Spotify Podcast:{' '}
                    <a
                      href="https://open.spotify.com/episode/5nWVZ64dgqsg7F4DT5iJiv"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      https://open.spotify.com/episode/5nWVZ64dgqsg7F4DT5iJiv
                    </a>
                  </li>
                  <li className="mb-3">
                    Apple Podcast:{' '}
                    <a
                      href="https://podcasts.apple.com/us/podcast/jessica-rebelo-self-worth-is-key-in-relationship-dynamics/id1617927566?i=1000596320700"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      https://podcasts.apple.com/us/podcast/jessica-rebelo-self-worth-is-key-in-relationship-dynamics/id1617927566?i=1000596320700
                    </a>
                  </li>
                  <li className="mb-3">
                    Podcast on WomLEAD:{' '}
                    <a
                      href="https://www.womleadmag.com/jessica-rebelo/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      https://www.womleadmag.com/jessica-rebelo/
                    </a>
                  </li>
                  <li className="mb-3">
                    Female Founders Podcast:{' '}
                    <a
                      href="https://traffic.libsyn.com/3d217128-111a-4aac-a1a5-dce8b932b1ac/Female_Founders_Podcast_-_Episode_77_-_Jessica_Rebelo.mp3"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      https://traffic.libsyn.com/3d217128-111a-4aac-a1a5-dce8b932b1ac/Female_Founders_Podcast_-_Episode_77_-_Jessica_Rebelo.mp3
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const Details = styled.div`
  margin-top: 0;
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: #506967;
  margin-bottom: 24px;
  font-size: 1.2rem;
`;

export default ProfileHeader;
