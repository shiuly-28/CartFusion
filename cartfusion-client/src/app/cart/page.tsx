"use client"

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true);

  const getCart = useCallback(async () => {
    try {
      const result = await axios.get("/api/user/cart/get");
      const cleanCart = (result.data.cart || []).filter((item: any) => item && item.product);
      setCart(cleanCart);
    } catch (error) {
      console.error("Cart Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const handleUpdateCart = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product?._id === productId ? { ...item, quantity } : item
      )
    );

    try {
      await axios.post("/api/user/cart/update", { productId, quantity });
      getCart();
    } catch (error) {
      console.error("Cart Update Error:", error);
      getCart();
    }
  };

  const handleRemove = async (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product?._id !== productId));

    try {
      await axios.post("/api/user/cart/remove", { productId });
    } catch (error) {
      console.error("Remove from cart error:", error);
      getCart();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-xl font-semibold">
        Loading Cart...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6 text-3xl font-bold">
        Cart is Empty
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {cart.map((item) => {
          if (!item.product) return null; // Safety check

          return (
            <div
              key={item.product._id || item._id}
              className="bg-white/10 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between border border-white/10"
            >
              <div className="relative w-24 h-24 shrink-0 rounded overflow-hidden bg-black/20">
                <Image
                  src={item.product.image1 || "/placeholder.png"}
                  alt={item.product.title || "Product"}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex-1 space-y-1 w-full">
                <h3 className="font-bold text-xl">{item.product.title}</h3>
                <p className="text-[#00684D] font-semibold text-lg">
                  ৳ {item.product.price}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() =>
                      handleUpdateCart(item.product._id, item.quantity - 1)
                    }
                    className="border border-gray-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition text-lg"
                  >
                    -
                  </button>
                  <span className="font-semibold text-lg">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateCart(item.product._id, item.quantity + 1)
                    }
                    className="border border-gray-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition text-lg"
                  >
                    +
                  </button>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center justify-start gap-2 md:gap-4 pt-3 text-sm font-medium">
                  <button
                  onClick={()=>router.push(`/checkout/${item.product._id}`)}
                  className="bg-[#00684D] hover:bg-[#045f47] px-4 py-2 rounded text-white transition mt-3 text-nowrap">
                    Checkout This Product
                  </button>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded text-red-400 border border-red-500/30 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="font-bold text-xl  md:self-start">
                ৳ {(item.product.price || 0) * item.quantity}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CartPage;