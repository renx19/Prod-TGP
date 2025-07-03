import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import "../styles/contact.scss";

const Contact = () => {
  const {
    register,
    trigger,
    formState: { errors },
  } = useForm();

  const onSubmit = async (e) => {
    const isValid = await trigger();
    if (!isValid) {
      e.preventDefault();
    }
  };

  return (
    <div className="contact-wrapper">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
        }}
        className="flex justify-end w-full"
      >
        <div>
          <p className="p-contact">
            <span className="text-yellow">CONTACT US</span>
          </p>
          <div className="p-container"></div>
        </div>
      </motion.div>

      <section id="contact" className="contacts">
        {/* FORM & IMAGE */}
        <div className="contact">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            className="basis-1/2 mt-10 md:mt-0"
          >
            <form
              target="_blank"
              onSubmit={onSubmit}
              action="https://formsubmit.co/eba4c91a729faa5d4f8eff6952d7fc3c"
              method="POST"
              className="form-con"
            >
              <input
                className="input"
                type="text"
                placeholder="NAME"
                {...register("name", {
                  required: true,
                  maxLength: 100,
                })}
              />
              {errors.name && (
                <p className="text-red mt-1">
                  {errors.name.type === "required" && "This field is required."}
                  {errors.name.type === "maxLength" && "Max length is 100 char."}
                </p>
              )}

              <input
                className="input"
                type="text"
                placeholder="EMAIL"
                {...register("email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
              />
              {errors.email && (
                <p className="text-red mt-1">
                  {errors.email.type === "required" && "This field is required."}
                  {errors.email.type === "pattern" && "Invalid email address."}
                </p>
              )}

              <textarea
                className="input-message"
                name="message"
                placeholder="MESSAGE"
                rows="4"
                cols="50"
                {...register("message", {
                  required: true,
                  maxLength: 2000,
                })}
              />
              {errors.message && (
                <p className="text-red mt-1">
                  {errors.message.type === "required" && "This field is required."}
                  {errors.message.type === "maxLength" && "Max length is 2000 char."}
                </p>
              )}

              <motion.button
                className="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span>Send</span>
              </motion.button>
            </form>
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
          <div className="iframe-wrapper">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.810290045165!2d123.7287854384377!3d13.362069344300778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a1ad9806705881%3A0x665a05dc6b7e4cfe!2sTAYHI%20BARANGAY%20HALL!5e0!3m2!1sen!2sph!4v1714489848502!5m2!1sen!2sph"
            width="650"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="iframe-con"
            referrerPolicy="no-referrer-when-downgrade"
          />
          </div>
        </motion.div>
        
      </section>

    </div>
  );
};

export default Contact;
