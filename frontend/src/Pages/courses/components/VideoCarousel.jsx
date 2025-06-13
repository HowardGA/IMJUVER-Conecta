import { useState } from 'react';
import YoutubeEmbeded from './YoutubeEmbeded';
import './VideoCarousel.css';

const VideoCarousel = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : videos.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < videos.length - 1 ? prev + 1 : 0));
  };

  if (videos.length === 0) return <p>No hay videos para esta lección.</p>;

  return (
    <div className="video-carousel-wrapper">
      <button className="nav-button left" onClick={handlePrev}>
        &#8249;
      </button>

      <div className="video-carousel">
        <YoutubeEmbeded
          key={videos[currentIndex].video_id}
          embedId={videos[currentIndex].video_id}
        />
      </div>

      <button className="nav-button right" onClick={handleNext}>
        &#8250;
      </button>
    </div>
  );
};

export default VideoCarousel;
