"use client";

import { motion, easeOut } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "How does the tracking system work?",
      answer:
        "Our system pulls real-time tracking data from major shipping carriers. Just enter your tracking number, and we'll fetch the latest updates for you.",
    },
    {
      question: "Which carriers do you support?",
      answer:
        "We support a wide range of carriers including USPS, FedEx, DHL, China Post, Royal Mail, and more. Our platform provides tracking from hundreds of global couriers.",
    },
    {
      question: "Is my tracking information secure?",
      answer:
        "Yes, security is our priority. Your tracking data is not stored permanently, and we do not share your information with third parties.",
    },
    {
      question: "Can I track multiple shipments at once?",
      answer:
        "Yes! Our platform allows you to track multiple packages simultaneously, giving you a centralized dashboard to manage all your shipments.",
    },
    {
      question: "What should I do if my package is delayed?",
      answer:
        "Delays can occur due to customs, weather, or carrier issues. If your package hasn't updated for an extended period, we recommend contacting the shipping provider directly.",
    },
  ];

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
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut} },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit="hidden"
      variants={containerVariants}
      className="relative w-full min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <motion.div
        variants={fadeUpVariants}
        className="container mx-auto px-6 py-12 text-center"
      >
        <h1 className="text-4xl font-bold uppercase tracking-wide md:text-5xl">
          Frequently Asked <span className="text-primary">Questions</span>
        </h1>
        <p className="text-lg mt-4 max-w-2xl mx-auto text-muted-foreground">
          Have questions? We&apos;ve got answers. Find everything you need to know
          about tracking your packages.
        </p>
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div
        variants={fadeUpVariants}
        className="container mx-auto px-6 pb-20"
      >
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-lg"
            >
              <AccordionTrigger className="text-lg font-semibold px-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </motion.div>
  );
}
