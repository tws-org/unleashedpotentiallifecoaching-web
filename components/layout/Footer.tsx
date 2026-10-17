import Banner from 'components/organisms/footer/Banner';
import Container from 'layouts/Container';
import dynamic from 'next/dynamic';
import SharedToastContainer from './SharedToastContainer';

const ContactForm = dynamic(
  () => import('components/organisms/footer/ContactForm'),
);

const ContactInfo = dynamic(
  () => import('components/organisms/footer/ContactInfo'),
);

const SubFooter = dynamic(
  () => import('components/organisms/footer/SubFooter'),
);

const FeaturedReview = dynamic(
  () => import('components/shared/FeaturedReview'),
);

const Footer = () => (
  <>
    <SharedToastContainer />
    <footer>
      <FeaturedReview />
      <div className="w-100">
        <Container>
          <Banner />
          <div className="flex flex-col lg:flex-row lg:space-evenly items-center lg:items-start mt-12 sm:mt-24">
            <ContactInfo />
            <ContactForm />
          </div>
          <SubFooter />
        </Container>
      </div>
    </footer>
  </>
);

export default Footer;
