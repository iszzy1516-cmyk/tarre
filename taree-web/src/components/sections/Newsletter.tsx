import { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic will go here
    setEmail("");
  };

  return (
    <section className="bg-primary py-24 relative overflow-hidden">
      {/* Subtle butterfly pattern overlay */}
      <div className="absolute inset-0 opacity-10 butterfly-bg" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-container mx-auto px-margin text-center relative z-10"
      >
        <h2 className="font-display text-headline-lg text-white mb-4">
          Join the TAREÉ Circle
        </h2>
        <p className="text-secondary-fixed text-body-lg mb-10">
          Be the first to experience our new collections and exclusive events.
        </p>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOUR EMAIL ADDRESS"
            className="flex-1 bg-transparent border-b-2 border-white/30 text-white text-label-caps tracking-widest py-4 px-0 focus:border-secondary transition-colors outline-none placeholder:text-white/40"
            required
          />
          <button
            type="submit"
            className="bg-secondary text-on-secondary px-8 py-4 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors"
          >
            Subscribe
          </button>
        </form>
      </motion.div>
    </section>
  );
}
