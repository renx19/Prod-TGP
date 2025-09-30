// import React from 'react';

import '../styles/home.scss'
import { motion } from "framer-motion";
import coverImage from "../assets/logo1.png";
// import { Link } from 'react-router-dom';
import { TbTargetArrow } from "react-icons/tb";
import { IoEyeSharp } from "react-icons/io5";
import TayhiChapter from '../assets/light.jpg'
import { tenetsData, codeOfConductData } from '../utils/data';

function Home() {
  return (
    <div className='home-container'>
      <div className='home-wrapper'>
        <div className="home-section">
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
            <div className="home-content">

              {/* Left side: Heading + Text */}
              <div className="home-left">
                <div className="home-header">
                  <h1>TAYHI CHAPTER</h1>
                </div>
                <div className="home-text">
                  <p>
                    Upholding tradition, fostering brotherhood, and striving for excellence in all endeavors.
                    We are dedicated to community service and the continuous development of our members.
                  </p>
                </div>
              </div>

              {/* Right side: Logos */}
              <div className="home-logos">
                <div className="home-logo">
                  <img src={TayhiChapter} alt="Tayhi Chapter Logo" />
                </div>
                <div className="home-logo">
                  <img src={coverImage} alt="Cover Logo" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="home-about-section">
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
            <h2>About Our Chapter</h2>
            <p>
              The Tayhi Chapter is a beacon of leadership and service, committed to nurturing individuals who embody the principles of integrity, perseverance, and community dedication. Founded on the bedrock of time-honored traditions, we strive to make a tangible impact both within our fraternity and in the wider community.
            </p>
            <p>
              Our members are united by a common purpose: to excel academically, professionally, and personally, while fostering an unbreakable bond of brotherhood. We believe in continuous growth, mutual support, and upholding the highest standards of conduct in all aspects of life.
            </p>
          </motion.div>
        </div>


        <div className='divider-con'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }} // triggers sooner on mobile
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className='tenets-container'>
              <div className='tenets-con'>
                <div className='tenets'>
                  <h1 className='tenets-h1'>Tenets</h1>
                  <div className="tenets-table-wrapper">
                    <table className='tenets-table'>
                      <thead>
                        <tr>
                          <th className='tenet-number'>Tenet</th>
                          <th className='tenet-description'>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tenetsData.map((tenet) => (
                          <tr key={tenet.id} className='tenet-row'>
                            <td className='tenet-number'><span>Tenet {tenet.id}:</span></td>
                            <td className='tenet-description'>{tenet.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}   // 👈 triggers sooner on mobile
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className='conduct-container'>
              <div className="conduct-con">
                <div className="code-of-conduct-cards">
                  {codeOfConductData.map((item) => (
                    <div key={item.id} className="conduct-card">
                      <h2 className="conduct-card-heading">
                        <span className="letter-circle">{item.letter}</span>
                        {item.word}
                      </h2>
                      <p className="conduct-card-text">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>

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
          <div className="prayer-container">
            <div className="prayer-wrapper">
              <div className='prayer'>
                <img src="quote.svg" alt="Quote" />
                <h1>Chapter Prayer</h1>
                <p>
                  TRISKELION PRAYER Almighty God, bless this brotherhood and sisterhood of ours, so that we may succeed in all of its endeavors. Enlighten and strengthen our Governor General,
                  Council’s Chairman, and chapter’s Grand Triskelion so for them to maintain the highest standard of decision making for a better and successful Tau Gamma Phi,
                  Tau Gamma Sigma, Fraternity and Sorority. Amen
                </p>
                <p>
                  Guide us, O Lord, in Your infinite wisdom, that we may always walk in the path of righteousness and service. May our actions reflect our commitment to truth, justice, and equality for all.
                  Protect our brotherhood and sisterhood, and instill in us the courage to face challenges with fortitude and resolve.
                </p>
              </div>
            </div>
          </div>
        </motion.div>


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
          <div className='mission-vision-cards-container'>
            <div className='mission-vision-cards-wrapper'>
              <div className='mission-vision-card'>
                <TbTargetArrow size={48} className="mission-vision-card-icon" />
                <h3 className="mission-vision-card-title">Mission</h3>
                <p className="mission-vision-card-text">
                  To provide lifelong service to our communities, foster intellectual growth, and cultivate responsible and effective leaders for a better tomorrow.
                </p>
              </div>

              <div className='mission-vision-card'>
                <IoEyeSharp size={48} className="mission-vision-card-icon" />
                <h3 className="mission-vision-card-title">Vision</h3>
                <p className="mission-vision-card-text">
                  To be a leading chapter recognized for its unwavering commitment to brotherhood, academic excellence, and positive societal impact.
                </p>
              </div>
            </div>
          </div>


        </motion.div>

      </div>
    </div>
  );
}

export default Home;
