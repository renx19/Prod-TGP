import React from 'react';
import { motion } from 'framer-motion';
import '../styles/about.scss';

const About = () => {
  // Define the animation variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='body-container'>
      <div className="about-con">
        {/* First paragraph */}
        <motion.h1
          className='about-h1'
          initial="hidden"
          whileInView="visible"
          variants={variants}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }} // Set to true to animate only once
        >
          HISTORY
        </motion.h1>

        <div className="about-content first-color">
          {/* Using map to generate paragraphs for better scalability */}
          {[
            "Tayhi Chapter was founded on the premise that everyone should be given the same respect and treated equally, regardless of whether they are community-based or school-based. Tayhi Chapter was officially founded on November 11, 2000. The call for an alliance with BUTC Chapter emerged due to students having scuffles with fraternal residents on multiple occasions. Former BUTC GT Marlon Cante and officers would convene at Brod Virgilio Rodriguez's residence to settle disputes. At that time, Tayhi had many senior members, but there was no record of a chapter driven to maximize the potential of harnessing its purpose — to serve and excel — and to ensure that both triskelion residents and triskelion students recognized each other and avoided conflict.",
            "In early 1999, Brod Carlo Eleuterio, along with others who shared the aspiration to serve, secured the signatures of all senior Triskelions in Tayhi; no one was bypassed, and all gave their blessings to proceed. From this mandate emerged the urgency to create its own chapter policy and by-laws. An election was held at Brod Virgilio Rodriguez's residence on November 11th, attended and witnessed by then GenSec Nephtali Godino, Dennis Cua, officers of BUTC, and its general membership, who elected officers.",
            "Tayhi Chapter recognizes all Tayhi Triskelion Seniors and its members for their support and guidance, allowing us to represent the Fraternity and enforce its Tenets and Codes of Conduct until this day and the rest is history."
          ].map((paragraph, index) => (
            <motion.div
              className="text"
              key={index}
              initial="hidden"
              whileInView="visible"
              variants={variants}
              transition={{ duration: 0.5 }}
              viewport={{ once: false }} // Allow multiple animations on scroll
            >
              <h2>{paragraph}</h2>
            </motion.div>
          ))}
        </div>

        <div className="about-content second-color">
          <motion.div
            className="text"
            id='text-spacing'
            initial="hidden"
            whileInView="visible"
            variants={variants}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }} // Allow multiple animations on scroll
          >
            <h1 className='about-h1'>The Pioneers</h1>
          </motion.div>

          <motion.div
            className="text"
            id='text-spacing'
            initial="hidden"
            whileInView="visible"
            variants={variants}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }} // Allow multiple animations on scroll
          >
            <h4 className='text-org' id='text-org'>Chapter Organizer</h4>
            <p className='text-org'>Carlo Eleuterio</p>
          </motion.div>

          <motion.div
            className="text"
            id='text-spacing'
            initial="hidden"
            whileInView="visible"
            variants={variants}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }} // Allow multiple animations on scroll
          >
            <h4 className='text-org' id='text-org'>Tayhi Adviser</h4>
            <p className='text-org'>Virgilio Cardino</p>
          </motion.div>

          <motion.div
            className="text"
            id='text-spacing'
            initial="hidden"
            whileInView="visible"
            variants={variants}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }} // Allow multiple animations on scroll
          >
            <h4 className='text-org' id='text-org'>Signatories / Elders</h4>
          </motion.div>

          {[
            "GT - Carlo Eleuterio",
            "DGT - Alvin Celestial",
            "MWW - Edcel Dado",
            "DMWW - Rey Bragais"
          ].map((elder, index) => (
            <motion.div
              className="text"
              key={index}
              id='text-spacing'
              initial="hidden"
              whileInView="visible"
              variants={variants}
              transition={{ duration: 0.5 }}
              viewport={{ once: false }} // Allow multiple animations on scroll
            >
              <p className='text-org'>{elder}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="text" id='text-spacing'>
          <h4 className='text-org' id='text-org'>Tayhi Chapter Founders</h4>
        </motion.div>

        <motion.div className="text" id='text-spacing'>
          <div className="text-founder">
            <div className="text-con">
              {[
                "Virgilio Cardino",
                "Robert Bonagua",
                "Marlon Cante",
                "Rodel Mendoza",
                "Louiemeer Arguelles",
                "Dondon Bron",
                "Virgilio Rodriguez",
                "Alvin Celestial",
                "Renz Brofas",
                "Rey Bragais",
                "Edcel Dado"
              ].map((founder, index) => (
                <motion.p
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: false }} // Allow multiple animations on scroll
                >
                  {founder}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="text" id='text-spacing'>
          <h4 className='text-org' id='text-org'>Tayhi Chapter Officers</h4>
        </motion.div>

        <motion.div className="text" id='text-spacing'>
          <div className="text-founder">
            <div className="text-con">
              {[
                "Edwin Bueno",
                "Robert Reyes",
                "Obet Cardino",
                "Abe Dado",
                "Pido Pontalba",
                "Maning Serrano",
                "Bryan Reyes",
                "Jonathan Casimiro",
                "Joseph Brofas",
                "Gina Bedia",
                "Fidel Baclao",
                "Weng Bueno",
                "Ronaldo Buensalida",
                "Aldin Competente",
                "Reykats Anonuevo",
                "Yayie Estrella",
                "Joseph Cadelina"
              ].map((officer, index) => (
                <motion.p
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: false }} // Allow multiple animations on scroll
                >
                  {officer}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
