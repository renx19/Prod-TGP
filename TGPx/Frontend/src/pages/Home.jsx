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
    <div className='body-container'>
 
       <div className='content'>
        
         <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
           
          >

              <div className="home-con">
                <h1>TAYHI CHAPTER</h1>
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


                
            <div className='home-text'>
              <div className="text-content">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0 },
                    }}
                   
                    >
                   
                   

                </motion.div>
              
                         
                     <div className="h1-image-content">
                      <div className='tayhi-image-con'>
                      <img src={TayhiChapter} alt="pic-goruo" />
                      </div>
                    </div>
                     </div>


                     <div className="h1-image-content">
                      <img src={coverImage} alt="pic-goruo" />
                    </div>
                  
                </div>

          </motion.div>
        </div>

                      <div className='divider-con'>
    

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

                    <div className='tenets-con'>
                        <div className='tenets'>
                            <h1 className='tenets-h1'>Tenets</h1>
                            <table className='tenets-table'>
                                <thead>
                                    <tr>
                                        <th className='tenet-number'>Number</th>
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
                <div className='conduct-con'> 
                    <div className='code-of-conduct'>
                        <h1>THE TRISKELION CODE OF CONDUCT</h1>
                        <table className='conduct-table'>
                            <thead>
                                <tr>
                                    <th className='conduct-letter'>Letter</th>
                                    <th className='conduct-description'>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {codeOfConductData.map((item) => (
                                    <tr key={item.id} className='conduct-row'>
                                        <td className='conduct-letter'>
                                            <span className="first-letter">{item.letter}</span>
                                        </td>
                                        <td className='conduct-description'>
                                            {item.text}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>  
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
                          <div className='prayer'>
                            <img src="quote.png" alt="Quote" />
                            <h1>Prayer</h1>
                            <p>
                              TRISKELION PRAYER Almighty God, bless this brotherhood and sisterhood of ours, so that we may succeed in all of its endeavors. Enlighten and strengthen our Governor General,
                              Council’s Chairman, and chapter’s Grand Triskelion so for them to maintain the highest standard of decision making for a better and successful Tau Gamma Phi, 
                              Tau Gamma Sigma, Fraternity and Sorority. Amen
                            </p>
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
                   <div className='home-card-con'>
                      <div className='home-card'>
                        <div className="home-image-content">
                          
                        </div>
                        <TbTargetArrow size={48} className="icon"/>
                        <h3>Mission</h3>
                        <p>To provide holistic services to help brothers excel and become great leaders.</p>
                      </div>
                      <div className='home-card'>
                        <div className="home-image-content">
                        
                        </div>
                        <IoEyeSharp size={48} className="icon"/>
                        <h3>Vision</h3>
                        <p>Produce a great leader upholding excellence in any field.</p>
                      </div>
                     
                     

                     
                    </div>


              </motion.div>

    </div>
  );
}

export default Home;
