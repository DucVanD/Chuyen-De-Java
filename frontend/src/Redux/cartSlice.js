import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiCart from "../api/user/apiCart";

// Helper to check auth
const isAuthenticated = () => !!localStorage.getItem("user");

// --- Async Thunks ---

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    if (isAuthenticated()) {
      const response = await apiCart.getMyCart();
      return response.data; // Expecting Cart entity
    }
    return null;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (product, { getState, dispatch, rejectWithValue }) => {
    if (isAuthenticated()) {
      try {
        // Backend: productId & quantity
        await apiCart.addToCart(product.id, product.qty);
        // After adding, re-fetch to sync
        dispatch(fetchCart());
        return null; // State update handled by fetchCart
      } catch (error) {
        return rejectWithValue(error.response?.data);
      }
    } else {
      // Guest: Return product to be handled by local reducer
      return product;
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ id, qty, cartItemId }, { dispatch, rejectWithValue }) => {
    if (isAuthenticated() && cartItemId) {
      try {
        await apiCart.updateItem(cartItemId, qty);
        dispatch(fetchCart());
        return null;
      } catch (error) {
        return rejectWithValue(error.response?.data);
      }
    } else {
      return { id, qty };
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ id, cartItemId }, { dispatch, rejectWithValue }) => {
    if (isAuthenticated() && cartItemId) {
      try {
        await apiCart.removeItem(cartItemId);
        dispatch(fetchCart());
        return null;
      } catch (error) {
        return rejectWithValue(error.response?.data);
      }
    } else {
      return id;
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { dispatch, rejectWithValue }) => {
    if (isAuthenticated()) {
      try {
        await apiCart.clearCart();
        dispatch(fetchCart());
      } catch (error) {
        return rejectWithValue(error.response?.data);
      }
    }
    return; // Local clear handled in extraReducers or reducers
  }
);


const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: savedCart,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    // Fallback for purely local operations if needed
    localClearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
    removeItems: (state, action) => {
      const idsToRemove = action.payload; // Array of IDs
      state.items = state.items.filter((item) => !idsToRemove.includes(item.id));
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    }
  },
  extraReducers: (builder) => {
    // --- Fetch Cart ---
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      if (action.payload) {
        // Replace local state with backend state
        // Transform Backend CartItem -> Frontend Product Format
        const backendItems = action.payload.items || [];
        state.items = backendItems.map(item => ({
          ...item.product,
          cartItemId: item.id, // Important for updates
          qty: item.quantity,
          product_qty: item.product.qty // Assuming product entity has qty field for stock
        }));
        // Sync to local storage for persistence (optional, but good for offline view)
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    });

    // --- Add To Cart ---
    builder.addCase(addToCart.fulfilled, (state, action) => {
      if (action.payload) {
        // Guest Logic
        const product = action.payload;
        const exist = state.items.find((item) => item.id === product.id);
        if (exist) {
          const newQty = exist.qty + product.qty;
          // Simple check, real stock check should be robust
          exist.qty = newQty;
        } else {
          state.items.push(product);
        }
        localStorage.setItem("cartItems", JSON.stringify(state.items));
        toast.success("Đã thêm vào giỏ hàng!");
      } else {
        // Logged in success (toast handled here or by re-fetch)
        toast.success("Đã thêm vào giỏ hàng!");
      }
    });

    // --- Update Quantity ---
    builder.addCase(updateQuantity.fulfilled, (state, action) => {
      if (action.payload) {
        // Guest Logic
        const { id, qty } = action.payload;
        const item = state.items.find((i) => i.id === id);
        if (item && qty >= 1) {
          item.qty = qty;
        }
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    });

    // --- Remove Item ---
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      if (action.payload) {
        // Guest Logic (payload is ID)
        state.items = state.items.filter((item) => item.id !== action.payload);
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    });

    // --- Clear Cart ---
    builder.addCase(clearCart.fulfilled, (state) => {
      if (!isAuthenticated()) {
        state.items = [];
        localStorage.removeItem("cartItems");
      }
    });
  },
});

export const { localClearCart, removeItems } = cartSlice.actions;
export default cartSlice.reducer;
