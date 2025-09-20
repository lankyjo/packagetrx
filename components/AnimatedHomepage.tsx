'use client';

import { motion, easeInOut } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Highlighter } from '@/components/magicui/highlighter';
import TrackingForm from './TrackingForm';
import Marque from './Marquee';
import { Package, Truck, MapPin, Clock } from 'lucide-react';

interface AnimatedHomepageProps {
  trackDoc: number;
}

const AnimatedHomepage = ({ trackDoc }: AnimatedHomepageProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  const iconVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0, 
      rotate: -180 
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        duration: 0.8,
      },
    },
  };

//   const floatingVariants = {
//     animate: {
//       y: [-10, 10, -10],
//       transition: {
//         duration: 3,
//         repeat: Infinity,
//         ease: easeInOut, // ✅ fixed
//       },
//     },
//   };

  return (
    <main className="relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 " />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Packages */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.2, 0.8],
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: easeInOut, // ✅ fixed
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          >
            <Package className="w-8 h-8 text-purple-400" />
          </motion.div>
        ))}

        {/* Floating Trucks */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`truck-${i}`}
            className="absolute opacity-10"
            initial={{ x: -100 }}
            animate={{
              x: ['100vw', '-100px'],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              delay: i * 5,
              ease: easeInOut, // ✅ fixed
            }}
            style={{
              top: `${30 + i * 20}%`,
            }}
          >
            <Truck className="w-10 h-10 text-blue-400" />
          </motion.div>
        ))}
      </div>

      <motion.section 
        className="min-h-dvh container max-sm:px-4 mx-auto flex flex-col gap-6  justify-center items-center max-xs:pt-20 xs:pt-8 relative  z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Logo Section */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          {/* Animated Logo */}
          <motion.div
            variants={iconVariants}
            className="relative inline-block max-sm:hidden"
          >
              <div className="relative">
                <Image 
                  src="/icon.png" 
                  width={60} 
                  height={60} 
                  alt="Tracking Logo" 
                //   className="w-12 md:w-20 mx-auto relative z-10" 
                />
                
              </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="main-header text-center leading-none  font-bold uppercase tracking-wide relative z-10"
            variants={itemVariants}
          >
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Track Your Packages,
            </motion.span>
            <br />

              <Highlighter action="circle" color="#FF9800">
                Anywhere.
              </Highlighter>
          </motion.h1>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 md:gap-8"
          >
            {/* Total Packages */}
            <motion.div 
              className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Package className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-gray-700">
                {trackDoc <= 1 ? '10k+': trackDoc } Packages Tracked
              </span>
            </motion.div>

            {/* Real-time Updates */}
            <motion.div 
              className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-gray-700">
                Real-time Updates
              </span>
            </motion.div>

            {/* Global Coverage */}
            <motion.div 
              className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-gray-700">
                Global Coverage
              </span>
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Enter your tracking ID below to see your package journey in real-time with our 
            interactive map and live updates.
          </motion.p>
        </motion.div>

        {/* Tracking Form Section */}
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-2xl mx-auto"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <TrackingForm />
        </motion.div>

        {/* Marquee Section */}
        <motion.div 
          variants={itemVariants}
          className="w-full mx-auto"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Marque />
        </motion.div>
      </motion.section>
    </main>
  );
};

export default AnimatedHomepage;
