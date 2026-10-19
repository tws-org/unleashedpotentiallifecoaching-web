interface VIDEO_PROPS {
  description?: string;
  title?: string;
  url?: string;
}

const Video = ({ url, title, description }: VIDEO_PROPS) => (
  <div className="video-container">
    <iframe
      className="video-iframe"
      src={url}
      loading="lazy"
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write;
            encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
    <div className="video-details">
      <h2 className="text-2xl text-forrest mb-2">{title}</h2>
      <p className="leading-7 font-serif text-base">{description}</p>
    </div>
  </div>
);

export default Video;
