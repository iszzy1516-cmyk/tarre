import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gem, Leaf, Award } from "lucide-react";

export default function OurStoryPage() {
  return (
    <div className="pt-[140px]">
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-portrait.jpeg"
            alt="The TAREÉ Legacy"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-primary/50" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-margin max-w-3xl mx-auto"
        >
          <span className="text-label-caps uppercase tracking-[0.4em] text-secondary-fixed mb-4 block font-body">
            A Heritage Reborn
          </span>
          <h1 className="font-display text-display-lg text-white mb-6">
            The TAREÉ Legacy
          </h1>
          <p className="text-white/80 text-body-lg mb-10 font-body italic">
            Redefining African luxury through the art of metamorphosis
          </p>
          <Link
            to="#story"
            className="inline-block bg-secondary-fixed text-on-secondary-fixed px-10 py-5 text-label-caps uppercase tracking-widest hover:bg-secondary-fixed-dim transition-all duration-300"
          >
            Discover the Story
          </Link>
        </motion.div>
      </section>

      {/* Chapter One: The Butterfly & The Crown */}
      <section id="story" className="py-section">
        <div className="max-w-container mx-auto px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-label-caps text-secondary uppercase tracking-[0.3em] mb-4 block font-body">
                Chapter One
              </span>
              <h2 className="font-display text-headline-lg text-primary mb-8">
                The Butterfly & The Crown
              </h2>
              <div className="space-y-6 text-on-surface-variant text-body-lg font-body">
                <p>
                  The TAREÉ identity is a profound dialogue between the ancestral and the ephemeral. Our design philosophy draws from the formidable geometry of Benin royal ivory masks — symbols of authority and wisdom that have graced the courts of West Africa for centuries.
                </p>
                <p>
                  This regal foundation is softened by the graceful arc of the savanna butterfly. Like the butterfly, TAREÉ represents transformation, taking the raw, storied elements of African earth and evolving them into wearable masterpieces of modern high-jewelry.
                </p>
              </div>
              <img
                src="/images/butterfly-pendant-cushion.png"
                alt="Benin Mask Inspiration"
                className="mt-10 w-32 h-32 object-contain opacity-60"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="/images/butterfly-pendant-cushion.png"
                alt="Butterfly Pendant"
                className="w-full aspect-square object-cover shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chapter Two: Lagos Artistry */}
      <section className="py-section bg-primary-container text-white">
        <div className="max-w-container mx-auto px-margin">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <img
                src="/images/gold-rings-dark.png"
                alt="Lagos Artistry"
                className="w-full aspect-[4/3] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <span className="text-label-caps text-champagne-gold uppercase tracking-[0.3em] mb-4 block font-body">
                Chapter Two
              </span>
              <h2 className="font-display text-headline-lg text-white mb-10">
                Lagos Artistry
              </h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <Gem className="w-6 h-6 text-champagne-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-display text-body-lg text-white mb-2">Hand-Finished</h3>
                    <p className="text-white/70 text-sm font-body leading-relaxed">
                      Each curve and contour is meticulously shaped by master bench jewellers in the heart of Lagos, Nigeria.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Leaf className="w-6 h-6 text-champagne-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-display text-body-lg text-white mb-2">Ethically Sourced</h3>
                    <p className="text-white/70 text-sm font-body leading-relaxed">
                      We use only conflict-free diamonds and sustainably extracted stones from across the African continent.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Award className="w-6 h-6 text-champagne-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-display text-body-lg text-white mb-2">Fine Gold</h3>
                    <p className="text-white/70 text-sm font-body leading-relaxed">
                      A commitment to purity and permanence, using recycled 18k solid gold to ensure heirloom quality.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-section bg-surface-container-low">
        <div className="max-w-container mx-auto px-margin text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-headline-lg text-primary mb-16">
              Our Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {[
                {
                  icon: Gem,
                  title: "Heritage",
                  desc: "Honoring the artistic traditions of our ancestors by weaving ancient motifs into modern, wearable sculpture.",
                },
                {
                  icon: Award,
                  title: "Excellence",
                  desc: "Upholding the highest global standards of jewelry craft, from conceptual precision to concierge-level service.",
                },
                {
                  icon: Leaf,
                  title: "Empowerment",
                  desc: "Investing in local talent and supporting female-led initiatives across the creative landscapes of Africa.",
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="bg-white p-10 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border border-outline-variant rounded-full">
                    <value.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="font-display text-body-lg text-primary mb-4">
                    {value.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm font-body leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 butterfly-bg" />
        <div className="max-w-container mx-auto px-margin text-center relative z-10">
          <h2 className="font-display text-headline-lg text-primary mb-8">
            Write Your Own Legacy
          </h2>
          <Link
            to="/products"
            className="inline-block border border-primary text-primary px-10 py-4 text-label-caps uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300"
          >
            Experience the Collections
          </Link>
        </div>
      </section>
    </div>
  );
}
