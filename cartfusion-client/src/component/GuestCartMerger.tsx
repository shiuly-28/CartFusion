"use client"
import axios from "axios"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { getGuestCart } from "@/lib/guestCart"

export default function GuestCartMerger() {
  const { status } = useSession()

  useEffect(() => {
    if (status !== "authenticated") return
    const guest = getGuestCart()
    if (guest.length === 0) return

    axios
      .post("/api/user/cart/merge", {
        items: guest.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
      })
      .then(() => localStorage.removeItem("guest_cart"))
      .catch(console.error)
  }, [status])

  return null
}