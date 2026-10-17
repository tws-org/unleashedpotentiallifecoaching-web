import styled from 'styled-components';

interface VIDEO_PROPS {
  description?: string;
  title?: string;
  url?: string;
}

const Video = ({ url, title, description }: VIDEO_PROPS) => (
  <VideoContainer>
    <Iframe
      src={url}
      loading="lazy"
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write;
            encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
    <VideoDetails>
      <h2 className="text-2xl text-forrest mb-2">{title}</h2>
      <p className="leading-7 font-serif text-base">{description}</p>
    </VideoDetails>
  </VideoContainer>
);

const VideoContainer = styled.div`
  width: 100%;
  margin-bottom: 42px;
  @media (min-width: 640px) {
    width: 47%;
  }
`;
const Iframe = styled.iframe`
  width: 100%;
  min-height: 350px;
`;

const VideoDetails = styled.div`
   margin-top: 16px;
}
`;

export default Video;
