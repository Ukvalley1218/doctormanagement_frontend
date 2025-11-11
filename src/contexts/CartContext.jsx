import React, { createContext, useContext, useReducer, useEffect } from "react";
import apiClient from "../../apiclient";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "RESTORE_CART":
      return {
        ...state,
        ...action.payload,
      };
    case "ADD_TO_CART":
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item._id === action.payload.id
              ? { ...item, quantity: Math.max(0, action.payload.quantity) }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    case "APPLY_PROMO_CODE": {
      // Support both legacy string payloads and new object payloads { code, discount }
      const payload = action.payload;
      const code = typeof payload === "string" ? payload : payload?.code || "";
      const discount =
        typeof payload === "string"
          ? code === "SAVE10"
            ? 10
            : code === "SAVE20"
            ? 20
            : 0
          : Number(payload?.discount) || 0;
      return {
        ...state,
        promoCode: code,
        discount,
      };
    }

    case "SET_DELIVERY_OPTION":
      return {
        ...state,
        deliveryOption: action.payload,
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    promoCode: "",
    discount: 0,
    deliveryOption: "standard",
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const existingSessionId = localStorage.getItem("sessionId");
    console.log(existingSessionId);
    if (!existingSessionId) {
      const newSessionId = `sess_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`;
      localStorage.setItem("sessionId", newSessionId);
    }

    const savedCart = localStorage.getItem("cart");
    let savedItems = [];
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items) {
          savedItems = parsedCart.items;
          dispatch({ type: "RESTORE_CART", payload: parsedCart });
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }

    const sessionIdToUse = localStorage.getItem("sessionId");
    if (sessionIdToUse) {
      (async () => {
        try {
          const response = await apiClient.get("/cart", {
            params: { session_id: sessionIdToUse },
          });

          const serverCart = response?.data;
          if (serverCart && Array.isArray(serverCart.items)) {
            const mappedItems = serverCart.items.map((entry) => {
              const productFromServer =
                entry.product || entry.productDetails || entry.productId;
              const productId = productFromServer?._id || entry._id;
              const quantity = entry.quantity ?? 1;

              if (productFromServer) {
                return { ...productFromServer, quantity, _id: productId };
              }

              const localMatch = savedItems.find((si) => si._id === productId);
              if (localMatch) {
                return { ...localMatch, quantity };
              }

              return {
                _id: productId,
                name: entry.name || "Item",
                sellingPrice: entry.sellingPrice || 0,
                image: entry.image || "",
                quantity,
              };
            });

            dispatch({
              type: "RESTORE_CART",
              payload: {
                ...state,
                items: mappedItems,
              },
            });
          }
        } catch (error) {
          console.error(
            "Failed to fetch cart from server:",
            error.response?.data || error.message
          );
        }
      })();
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  // Add item or increase quantity (+1)
  const addToCart = async (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });

    try {
      const sessionId = localStorage.getItem("sessionId");
      let newSessionId;
      if (!sessionId) {
        newSessionId = `sess_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 10)}`;
        localStorage.setItem("sessionId", newSessionId);
      }
      await apiClient.post("/cart", {
        session_id: sessionId || newSessionId,
        items: [
          {
            productId: product._id,
            quantity: 1, // server should increment
          },
        ],
      });
    } catch (error) {
      console.error(
        "Failed to sync cart with server:",
        error.response?.data || error.message
      );
    }
  };

  // Decrease quantity (-1)
  const decreaseQuantity = async (productId) => {
    const item = state.items.find((i) => i._id === productId);
    if (!item) return;

    const newQuantity = item.quantity - 1;

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id: productId, quantity: newQuantity },
    });
    console.log(newQuantity);
    try {
      const sessionId = localStorage.getItem("sessionId");
      await apiClient.post("/cart", {
        session_id: sessionId,
        items: [
          {
            productId,
            quantity: newQuantity,
          },
        ],
      });
    } catch (error) {
      console.error(
        "Failed to update cart on server:",
        error.response?.data || error.message
      );
    }
  };

  // Update quantity directly
  const updateQuantity = async (productId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } });
    console.log(quantity);

    try {
      const sessionId = localStorage.getItem("sessionId");
      await apiClient.post("/cart", {
        session_id: sessionId,
        items: [
          {
            productId,
            quantity,
          },
        ],
      });
    } catch (error) {
      console.error(
        "Failed to update cart on server:",
        error.response?.data || error.message
      );
    }
  };

  
  // Remove item (set quantity = 0)
  const removeFromCart = async (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });

    try {
      const sessionId = localStorage.getItem("sessionId");
      // Use POST instead of PUT and set quantity to 0
      await apiClient.post("/cart", {
        session_id: sessionId,
        items: [
          {
            productId,
            quantity: 0, // Set quantity to 0 to remove item
          },
        ],
      });
    } catch (error) {
      console.error(
        "Failed to remove item from server cart:",
        error.response?.data || error.message
      );
      
      // If server returns 404, try alternative approach
      if (error.response?.status === 404) {
        console.log("Trying alternative removal approach...");
        await syncWithServer(); // Sync entire current state
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });

    try {
      const sessionId = localStorage.getItem("sessionId");

      if (sessionId) {
        // Call DELETE /cart with session_id
        await apiClient.delete("/cart", {
          data: { session_id: sessionId }, // DELETE needs data inside config
        });
      }

      // Remove from localStorage after API call
      localStorage.removeItem("cart");
      localStorage.removeItem("sessionId");
    } catch (error) {
      console.error(
        "Failed to clear cart on server:",
        error.response?.data || error.message
      );
    }
  };

  const applyPromoCode = async (code) => {
  // 🧼 If code is falsy, clear promo instead of calling API
  if (!code) {
    dispatch({
      type: "APPLY_PROMO_CODE",
      payload: { code: "", discount: 0 },
    });
    return 0;
  }

  try {
    const response = await apiClient.post("/promocode/apply", { code });
    console.log(response.data);

    dispatch({
      type: "APPLY_PROMO_CODE",
      payload: {
        code,
        discount: response.data.discountPercentage || 0,
      },
    });

    return response.data.discountPercentage;
  } catch (error) {
    console.error(
      "Failed to apply promo code:",
      error.response?.data || error.message
    );
    alert(error.response?.data?.message || "Invalid promo code");
    dispatch({
      type: "APPLY_PROMO_CODE",
      payload: { code: "", discount: 0 },
    });
    return 0;
  }
};


  const setDeliveryOption = (option) => {
    dispatch({ type: "SET_DELIVERY_OPTION", payload: option });
  };

  // Totals
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );
  const discountAmount = (subtotal * state.discount) / 100;
  const deliveryFee = state.deliveryOption === "standard" ? 5.99 : 12.99;
  const total = subtotal - discountAmount + deliveryFee;

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    ...state,
    addToCart,
    decreaseQuantity,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    setDeliveryOption,
    subtotal,
    discountAmount,
    deliveryFee,
    total,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
