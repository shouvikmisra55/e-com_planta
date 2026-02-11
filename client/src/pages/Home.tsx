import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Leaf } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Indoor", "Outdoor", "Succulents"];

  const filteredProducts = products?.filter((p) => 
    filter === "All" ? true : p.category === filter
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative bg-primary/5 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="container-page relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-6">
            Spring Collection 2024
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
            Bring Nature <br /> <span className="text-accent italic">Indoors</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Curated plants for your home and office. Ethically sourced, carefully delivered, and guaranteed to thrive.
          </p>
          <Button size="lg" className="rounded-full px-8 text-lg h-14 shadow-xl shadow-primary/20" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
            Shop Collection
          </Button>
        </div>
      </section>

      {/* Shop Section */}
      <div id="shop" className="container-page">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h2 className="text-3xl font-bold">Featured Plants</h2>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === cat
                    ? "bg-primary text-white shadow-md transform scale-105"
                    : "bg-secondary/50 text-foreground hover:bg-secondary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/20 rounded-3xl">
            <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary">No plants found</h3>
            <p className="text-muted-foreground">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
