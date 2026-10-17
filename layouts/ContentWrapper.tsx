import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

const ContentWrapper = ({ children }: Props) => (
  <Container>{children}</Container>
);

const Container = styled.div`
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: #506967;
  margin-bottom: 64px;

  a {
    text-decoration: underline;
    color: rgb(21 128 61);
  }
  p {
    margin-bottom: 12px;

    strong {
      font-size: 1.4rem;
    }
  }

  h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 32px;
  }

  h3 {
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.45rem;
    line-height: 2rem;
    margin-bottom: 16px;
  }

  ul {
    margin-left: 1.5em;

    li {
      list-style-type: disc;
    }
  }

  hr {
    margin-top: 2.5em;
    margin-bottom: 2.5em;
  }

  .daniel-castellon-ievtpifod0a-unsplash {
    max-width: 300px;
  }

  img {
    display: block;
    margin: auto;
    margin-bottom: 1em;

    @media (min-width: 768px) {
      display: inline;
      float: right;
      margin-left: 2em;
      max-width: 420px;
    }
  }

  .block-img {
    @media (min-width: 768px) {
      float: right;
      margin-top: 8px;
      margin-left: 24px;
    }
  }
`;

export default ContentWrapper;
