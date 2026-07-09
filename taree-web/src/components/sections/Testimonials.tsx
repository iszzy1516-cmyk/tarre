import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <section className="py-section bg-surface-container-low">
      <div className="max-w-container mx-auto px-margin text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-headline-md mb-16 italic">
            Words from Our Circle
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="font-display text-headline-lg text-primary italic mb-8">
              "The craftsmanship is beyond compare. Every time I wear my TAREÉ earrings, I feel connected to my roots while standing tall in any room in the world."
            </p>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mb-4 bg-primary-container">
                <img
                  src="/images/real/heart-pendant-bust.jpg"
                  alt="Amara, Lagos"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-label-caps text-primary uppercase tracking-widest">
                Amara, Lagos
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
