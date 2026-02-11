import { type Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/30">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        <Button
          onClick={() => addToCart(product)}
          size="icon"
          className="absolute bottom-4 right-4 h-12 w-12 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-white text-primary hover:bg-primary hover:text-white border-none"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-display font-bold text-xl text-primary leading-tight">{product.name}</h3>
          </div>
          <p className="font-sans font-bold text-lg text-primary">${product.price}</p>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {product.description}
        </p>

        <Button 
          onClick={() => addToCart(product)}
          variant="outline" 
          className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white group-hover:border-primary/50"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}
