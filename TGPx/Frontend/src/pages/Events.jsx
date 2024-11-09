import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import '../styles/event.scss';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import useEventStore from '../store/EventStore'; // Adjust path to match your store's location
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 

const Events = () => {
  const [index, setIndex] = useState(0);
  const { events, fetchAllEvents } = useEventStore();

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const settings = {
    lazyLoad: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ],
    afterChange: (current) => {
      setIndex(current);
    }
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
              {events.map((event, index) => (
                <div key={index} className="card-con">
                  <div className="image-container">
                    <div className="image-content">
                      <span className="overlay"></span>
                      <div className="card-image">
                        <img src={event.imageUrls[0]} alt={event.title} className="card-img" />
                      </div>
                    </div>
                  </div>
                  <div className="title-container">
                    <h6 style={{color: "#ffd700"}} className="name">{event.title}</h6>
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
