import { Link } from "react-router-dom";
import { Heart, X } from "lucide-react";
import { formatNaira } from "../lib/utils";

const wishlistItems = [
  {
    id: "1",
    name: "Ethereal Wings Diamond Choker",
    price: 280000,
    image: "/images/ethereal-wings-choker.png",
    slug: "ethereal-wings-diamond-choker",
  },
];

export default function WishlistPage() {
  return (
    <div className="pt-[160px] pb-section">
      <div className="max-w-container mx-auto px-margin">
        <h1 className="font-display text-headline-lg text-primary mb-12">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-outline-variant mx-auto mb-4" />
            <p className="text-on-surface-variant text-body-lg mb-8">Your wishlist is empty</p>
            <Link
              to="/products"
              className="bg-secondary text-on-secondary px-10 py-4 text-label-caps uppercase tracking-widest hover:bg-secondary-container transition-colors inline-block"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group">
                <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden mb-6">
                  <Link to={`/products/${item.slug}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-error hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-display text-body-lg text-primary mb-1">{item.name}</h3>
                <p className="text-secondary font-bold font-body">{formatNaira(item.price)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
