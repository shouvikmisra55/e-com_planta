import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="font-display text-3xl font-bold text-primary mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Looks like you haven't added any green friends to your cart yet.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page min-h-screen">
      <h1 className="font-display text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl border border-border shadow-sm">
              <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-xl overflow-hidden bg-secondary">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-xl font-bold text-primary">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-bold text-lg">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-md sticky top-24">
            <h2 className="font-display text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (Estimated)</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
            </div>
            
            <Separator className="mb-6" />
            
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg">Total</span>
              <span className="font-display font-bold text-3xl text-primary">${(total * 1.08).toFixed(2)}</span>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full rounded-xl text-lg h-12 shadow-lg shadow-primary/20">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
