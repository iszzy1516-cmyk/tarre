import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const posts = [
  {
    id: "1",
    title: "The Art of Metamorphosis: How the Butterfly Became Our Muse",
    excerpt: "Discover the story behind TAREÉ's signature butterfly motif and its deep roots in Benin royal heritage and savanna folklore.",
    image: "/images/butterfly-pendant-cushion.png",
    date: "May 5, 2026",
    category: "Heritage",
    slug: "butterfly-muse",
  },
  {
    id: "2",
    title: "A Guide to Caring for Your 18K Gold Jewelry",
    excerpt: "Learn the essential tips and techniques to keep your TAREÉ pieces gleaming for generations to come.",
    image: "/images/gold-rings-dark.png",
    date: "April 28, 2026",
    category: "Jewelry Care",
    slug: "gold-care-guide",
  },
  {
    id: "3",
    title: "Behind the Bench: A Day in the Life of a Lagos Goldsmith",
    excerpt: "Step inside our atelier and witness the meticulous craftsmanship that goes into every TAREÉ creation.",
    image: "/images/gold-bracelets.png",
    date: "April 15, 2026",
    category: "Craftsmanship",
    slug: "lagos-goldsmith",
  },
  {
    id: "4",
    title: "Bridal Trends 2026: Timeless Gold for the Modern Bride",
    excerpt: "From statement chokers to delicate hairpieces, explore the bridal jewelry trends defining African weddings this year.",
    image: "/images/bridal-necklace.png",
    date: "April 2, 2026",
    category: "Bridal",
    slug: "bridal-trends-2026",
  },
];

export default function BlogPage() {
  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-headline-lg text-primary mb-4">
            The Journal
          </h1>
          <p className="text-on-surface-variant text-body-lg max-w-xl mx-auto font-body">
            Stories of heritage, craftsmanship, and the modern African woman.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`#`} className="group block">
                <div className="aspect-[16/10] overflow-hidden mb-6">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-label-caps text-[10px] uppercase tracking-widest text-secondary font-body">
                    {post.category}
                  </span>
                  <span className="text-on-surface-variant text-xs font-body">{post.date}</span>
                </div>
                <h2 className="font-display text-headline-md text-primary mb-3 group-hover:text-secondary transition-colors">
                  {post.title}
                </h2>
                <p className="text-on-surface-variant text-sm font-body leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
