import { useEffect } from 'react';
import Slider from 'react-slick';
import '../styles/event.scss';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import useEventStore from '../store/EventStore';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Events = () => {
  const { events, fetchAllEvents } = useEventStore();

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const settings = {
    lazyLoad: true,
    dots: true,
    infinite: false, // removed dynamic infinite setting
    speed: 500,
    slidesToShow: Math.min(events.length || 1, 3), // fallback to 1 to avoid 0 or Infinity
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(events.length || 1, 3),
        }
      },
      {
        breakpoint: 820,
        settings: {
          slidesToShow: Math.min(events.length || 1, 2),
        }
      },
      {
        breakpoint: 600, // 👈 switch to 1 below this
        settings: {
          slidesToShow: 1,
        }
      }
    ],
  };
  

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="body-container">
      <div className="event-con">
        <div className="slide-container">
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
              {Array.isArray(events) && events.map((event, i) => (
                <div key={i} className="card-con">
                  <div className="image-container">
                    <div className="image-content">
                      <span className="overlay"></span>
                      <div className="card-image">
                        <img src={event.imageUrls[0]} alt={event.title} className="card-img" />
                      </div>
                    </div>
                  </div>
                  <div className="title-container">
                    <h6 style={{ color: "#ffd700" }} className="name">{event.title}</h6>
                  </div>
                  <div className="description-container">
                    <p className="description">{event.description}</p>
                  </div>
                  <div className="date-container">
                    <p className="event-date">{monthNames[event.month - 1]} {event.year}</p>
                  </div>
                  <div className="button-container">
                    <Link to={`/events/${event._id}`}>
                      <button className="button-events">Learn More</button>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Events;
