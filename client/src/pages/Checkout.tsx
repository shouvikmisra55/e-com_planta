import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, CreditCard, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "Name too short"),
  lastName: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  zip: z.string().min(5, "Valid ZIP required"),
  cardNumber: z.string().min(16, "Invalid card number").max(19),
  expiry: z.string().min(4, "MM/YY"),
  cvc: z.string().min(3, "CVC required").max(4),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { clearCart, total } = useCart();
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [orderId, setOrderId] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    setStep("processing");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOrderId(Math.random().toString(36).substr(2, 9).toUpperCase());
    setStep("success");
    clearCart();
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/20 p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center"
        >
          <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary mb-4">Order Confirmed!</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order <span className="font-mono font-bold text-primary">#{orderId}</span> has been received and is being prepared with care.
          </p>
          <Link href="/">
            <Button size="lg" className="rounded-full px-8 w-full">Continue Shopping</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-page max-w-4xl min-h-screen">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8 text-center">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        {/* Order Summary Sidebar */}
        <div className="md:col-span-1 md:order-2">
          <div className="bg-secondary/30 p-6 rounded-2xl sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-muted-foreground">Tax</span>
              <span>${(total * 0.08).toFixed(2)}</span>
            </div>
            <div className="border-t border-border/50 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">${(total * 1.08).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="md:col-span-2 md:order-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Shipping Info */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 space-y-2">
                  <Label>First Name</Label>
                  <Input {...register("firstName")} className="rounded-xl" placeholder="John" />
                  {errors.firstName && <span className="text-xs text-destructive">{errors.firstName.message}</span>}
                </div>
                <div className="col-span-1 space-y-2">
                  <Label>Last Name</Label>
                  <Input {...register("lastName")} className="rounded-xl" placeholder="Doe" />
                  {errors.lastName && <span className="text-xs text-destructive">{errors.lastName.message}</span>}
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Email</Label>
                  <Input {...register("email")} className="rounded-xl" placeholder="john@example.com" />
                  {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Address</Label>
                  <Input {...register("address")} className="rounded-xl" placeholder="123 Green St" />
                  {errors.address && <span className="text-xs text-destructive">{errors.address.message}</span>}
                </div>
                <div className="col-span-1 space-y-2">
                  <Label>City</Label>
                  <Input {...register("city")} className="rounded-xl" placeholder="New York" />
                  {errors.city && <span className="text-xs text-destructive">{errors.city.message}</span>}
                </div>
                <div className="col-span-1 space-y-2">
                  <Label>ZIP Code</Label>
                  <Input {...register("zip")} className="rounded-xl" placeholder="10001" />
                  {errors.zip && <span className="text-xs text-destructive">{errors.zip.message}</span>}
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Payment Details</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Card Number</Label>
                  <Input {...register("cardNumber")} className="rounded-xl" placeholder="0000 0000 0000 0000" />
                  {errors.cardNumber && <span className="text-xs text-destructive">{errors.cardNumber.message}</span>}
                </div>
                <div className="col-span-1 space-y-2">
                  <Label>Expiry Date</Label>
                  <Input {...register("expiry")} className="rounded-xl" placeholder="MM/YY" />
                  {errors.expiry && <span className="text-xs text-destructive">{errors.expiry.message}</span>}
                </div>
                <div className="col-span-1 space-y-2">
                  <Label>CVC</Label>
                  <Input {...register("cvc")} className="rounded-xl" placeholder="123" />
                  {errors.cvc && <span className="text-xs text-destructive">{errors.cvc.message}</span>}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={step === "processing"} 
              className="w-full rounded-xl h-14 text-lg shadow-lg shadow-primary/25"
            >
              {step === "processing" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                </>
              ) : (
                `Pay $${(total * 1.08).toFixed(2)}`
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
