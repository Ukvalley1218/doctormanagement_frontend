import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../apiclient";

export default function CheckoutSuccess() {
  const query = new URLSearchParams(useLocation().search);
  const session_id = query.get("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (!session_id) return;

    const completeOrder = async () => {
      try {
        // 1. Fetch Stripe Session Details
        const stripeRes = await apiClient.get(`/payment/session/${session_id}`);
        const session = stripeRes.data;

        const metadata = session.metadata;

        // 2. Convert metadata back to objects
        const items = JSON.parse(metadata.items || "[]");
        const shippingDetails = JSON.parse(metadata.shippingDetails || "{}");

        // 3. Build final order
        const orderPayload = {
          promoCode: metadata.promoCode || null,
          productValue: Number(metadata.productValue),
          discountAmount: Number(metadata.discountAmount),
          deliverfee: Number(metadata.deliverfee),
          taxAmount: Number(metadata.taxAmount),
          totalPrice: Number(metadata.totalPrice),
          items,
          shippingDetails,

          paymentMode: "ONLINE",
          stripeSessionId: session_id,
          stripePaymentStatus: session.payment_status,
        };

        // 4. Place backend order
        await apiClient.post("/orders", orderPayload);

        navigate("/order-confirmation");
      } catch (err) {
        console.error("Checkout success error:", err);
        navigate("/checkout-failed");
      }
    };

    completeOrder();
  }, [session_id]);

  return (
    <div className="min-h-screen flex justify-center items-center text-lg">
      Processing your order...
    </div>
  );
}
