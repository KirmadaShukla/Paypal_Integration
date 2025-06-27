import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0
  },
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existingItem = state?.items?.find(i => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(item => item.productId !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i.productId === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.productId !== productId);
        } else {
          item.quantity = quantity;
        }
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    },
    syncCart(state, action) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, syncCart } = cartSlice.actions;
export default cartSlice.reducer;