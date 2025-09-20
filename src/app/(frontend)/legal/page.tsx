"use client";

import { motion, easeOut } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
// import Nav from "@/components/Nav";

export default function Legal() {
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
      transition: { duration: 0.6, ease: easeOut },
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
            Privacy & <span className="text-primary">Legal</span>
          </h1>
          <p className="text-lg mt-4 max-w-2xl mx-auto text-muted-foreground">
            Please read our policies carefully to understand your rights and
            obligations when using our services.
          </p>
        </motion.div>

        {/* Legal Content */}
        <motion.div
          variants={fadeUpVariants}
          className="container mx-auto px-6 pb-20 space-y-6"
        >
          {[
            {
              title: "1. Introduction",
              text: "This Agreement sets forth the legal terms governing your use of our platform. By accessing our services, you agree to these terms.",
            },
            {
              title: "2. No Data Collection",
              text: "We do not collect, store, or process any personal data from users. Our platform operates without tracking or recording user activity.",
            },
            {
              title: "3. User Obligations",
              text: "By using our platform, you agree not to misuse the services, engage in unauthorized access, disrupt platform operations, or violate any legal framework.",
            },
            {
              title: "4. Third-Party Services",
              text: "Our platform may interact with third-party providers, such as logistics networks. We do not control or assume responsibility for external services.",
            },
            {
              title: "5. Limitation of Liability",
              text: "We are not responsible for any direct or indirect damages arising from the use of our services, including service disruptions or inaccuracies.",
            },
            {
              title: "6. Governing Law & Dispute Resolution",
              text: "This Agreement is governed by the laws of Miami-Dade County, Florida, USA. Any disputes shall be resolved through arbitration, and users waive class action rights.",
            },
          ].map((section, i) => (
            <motion.div key={i} variants={fadeUpVariants}>
              <Card className="shadow-md">
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.text}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
