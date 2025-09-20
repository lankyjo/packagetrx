"use client";

import { motion, easeInOut } from "framer-motion";
import { FaGlobe, FaShippingFast, FaShieldAlt } from "react-icons/fa";

export default function About() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeInOut },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit="hidden"
      variants={containerVariants}
      className="relative w-full min-h-screen bg-background text-foreground"
    >
      <section className="z-20 relative">
        {/* Header */}
        <motion.div
          variants={fadeUpVariants}
          className="container mx-auto px-6 py-12 text-center"
        >
          <h1 className="text-4xl font-bold uppercase tracking-wide md:text-5xl">
            About <span className="text-primary">Us</span>
          </h1>
          <p className="text-lg mt-4 max-w-2xl mx-auto text-muted-foreground">
            Your trusted solution for real-time global package tracking. We help
            individuals and businesses track shipments seamlessly across
            multiple carriers, ensuring transparency and reliability.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          variants={fadeUpVariants}
          className="container mx-auto px-6 py-8 space-y-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaGlobe className="text-3xl text-primary" />
                Our Mission
              </h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Our mission is to simplify the package tracking process, making
                it more efficient and stress-free. In today&apos;s fast-paced world,
                waiting for packages can be frustrating, especially when
                tracking updates are scattered across multiple platforms. We
                bring everything into one place, giving you a centralized
                dashboard that keeps you informed in real time.
                <br />
                <br />
                Whether you&apos;re an e-commerce business tracking customer
                shipments, a frequent online shopper, or a logistics
                professional, our goal is to ensure that you never lose sight of
                your packages.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaShippingFast className="text-3xl text-primary" />
                Why Choose Us?
              </h2>
              <ul className="mt-3 space-y-4 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Real-Time Tracking:</strong>{" "}
                  Stay updated with instant status changes from global shipping
                  carriers like FedEx, UPS, DHL, USPS, and China Post.
                </li>
                <li>
                  <strong className="text-foreground">Multi-Carrier Support:</strong>{" "}
                  No need to visit multiple websites. We aggregate tracking data
                  from hundreds of carriers worldwide, providing you with a
                  unified tracking experience.
                </li>
                <li>
                  <strong className="text-foreground">Privacy & Security:</strong>{" "}
                  Your tracking numbers and shipment details remain completely
                  private. We don&apos;t share or store sensitive data unnecessarily.
                </li>
                <li>
                  <strong className="text-foreground">Predictive Insights:</strong>{" "}
                  Our system doesn&apos;t just show where your package is—it also
                  predicts estimated delivery dates, possible delays, and
                  alternate routes.
                </li>
                <li>
                  <strong className="text-foreground">Seamless Experience:</strong>{" "}
                  Our intuitive interface is designed for ease of use, whether
                  you&apos;re tracking one package or managing hundreds of shipments
                  at once.
                </li>
              </ul>
            </div>
          </div>

          {/* Vision */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FaShieldAlt className="text-3xl text-primary" />
                Our Vision
              </h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                The future of shipping is transparency and efficiency. Our
                vision is to create a world where package tracking is no longer
                a hassle—where customers, businesses, and couriers can
                collaborate seamlessly for faster, smarter, and more reliable
                deliveries.
                <br />
                <br />
                We aim to bridge the gap between logistics providers and
                end-users, offering a real-time logistics ecosystem that
                provides predictive tracking, AI-powered insights, and seamless
                cross-border shipment management.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
