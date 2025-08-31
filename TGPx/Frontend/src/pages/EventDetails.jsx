import { useEffect } from 'react';
import Slider from 'react-slick';
import '../styles/event.scss';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import useEventStore from '../store/EventStore';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const EventDetails = () => {
  const { id } = useParams();
  const { currentEvent, fetchEventById } = useEventStore();

  useEffect(() => {
    if (id) fetchEventById(id);
  }, [id, fetchEventById]);

  if (!currentEvent) {
    return <p>Loading event details...</p>;
  }

  const { id: eventId, title, description, imageUrls = [], month, year } = currentEvent;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const settings = {
    lazyLoad: true,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(imageUrls.length, 4),
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(imageUrls.length, 3) },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(imageUrls.length, 1) },
      },
    ],
  };

  return (
    <div className="eventDetails-container">
      <div className="sliderDetails-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Slider {...settings}>
            {imageUrls.map((url) => (
              <div key={`${eventId}-${url}`} className="imageDetails-container">
                <div className="imageDetails-content">
                  <span className="overlayDetails"></span>
                  <div className="cardDetails-image">
                    <img src={url} alt={`${title} image`} className="cardDetails-img" />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </motion.div>

        <div className="titleDetails-container">
          <h2 className="titleDetails">{title}</h2>
        </div>
        <div className="descriptionDetails-container">
          <p className="descriptionDetails">{description}</p>
        </div>
        <div className="dateDetails-container">
          <p className="dateDetails">{monthNames[month - 1]} {year}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
