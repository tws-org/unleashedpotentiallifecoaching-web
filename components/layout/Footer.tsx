import Banner from 'components/layout/FooterBanner';
import Container from 'components/layout/Container';
import dynamic from 'next/dynamic';
import SharedToastContainer from 'components/layout/ToastContainer';

const ContactForm = dynamic(() => import('features/forms/ContactForm'));

const ContactInfo = dynamic(() => import('components/layout/ContactInfo'));

const SubFooter = dynamic(() => import('components/layout/SubFooter'));

const FeaturedReview = dynamic(() => import('features/reviews/FeaturedReview'));

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
