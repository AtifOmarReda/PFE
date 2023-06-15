import { combineReducers, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const getAuthTokens = () => {
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    return authTokens;
};

const fetchFavoriteItemsFromLocalStorage = () => {
    const favoriteItems = JSON.parse(localStorage.getItem("favoriteItems"));
    return favoriteItems;
};

const fetchItemsFromBackend = async (authTokens) => {

    const response = await fetch("http://127.0.0.1:8000/api/favorites/", {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `JWT ${authTokens.access}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch favorite items");
    }

    const data = await response.json();
    return data;
};

export const fetchFavoriteItems = createAsyncThunk(
  "favorites/fetchFavoriteItems",
  async (_, { rejectWithValue }) => {
    try {
      const authTokens = getAuthTokens();

      if (authTokens) {
        const response = fetchFavoriteItemsFromLocalStorage();

        if (response !== null) {
          return response;
        } else {
          const backendResponse = await fetchItemsFromBackend(authTokens);
          localStorage.setItem("favoriteItems", JSON.stringify(backendResponse));
          return backendResponse;
        }
      } else {
        throw new Error("User not authenticated");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialCart = JSON.parse(localStorage.getItem("cart"));

const initialState = {
    isCartOpen: false,
    cart: Array.isArray(initialCart) ? initialCart : [],
    items: []
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },

        addToCart: (state, action) => {
            const existingItemIndex = state.cart.findIndex(item => item.id === action.payload.item.id);
            if (existingItemIndex !== -1) {
              state.cart[existingItemIndex].count += action.payload.item.count;
            } else {
              state.cart.push({...action.payload.item, count: action.payload.item.count});
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },

        removeFromCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload.id);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },

        increaseCount: (state, action) => {
            const itemIndex = state.cart.findIndex(item => item.id === action.payload.id);
            if (itemIndex !== -1) {
              state.cart = [
                ...state.cart.slice(0, itemIndex),
                {
                  ...state.cart[itemIndex],
                  count: state.cart[itemIndex].count + 1,
                },
                ...state.cart.slice(itemIndex + 1),
              ];
              localStorage.setItem("cart", JSON.stringify(state.cart));
            }
        },

        decreaseCount: (state, action) => {
            state.cart = state.cart.map((item) => {
              if (item.id === action.payload.id) {
                if (item.count > 1) {
                  item.count--;
                } else {
                  return null;
                }
              }
              return item;
            }).filter(item => item !== null);
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },

        resetCart: (state) => {
          state.cart = [];
          localStorage.removeItem("cart");
      },

        setIsCartOpen: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },

    }
})

export const {
    setItems,
    addToCart,
    removeFromCart,
    increaseCount,
    decreaseCount,
    setIsCartOpen,
    resetCart,
} = cartSlice.actions

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    isFavoriteOpen: false,
    favoriteItems: getAuthTokens()
      ? fetchFavoriteItemsFromLocalStorage() || []
      : [],
    loading: false,
    error: null,
  },
  reducers: {
    toggleFavoriteOpen: (state) => {
      state.isFavoriteOpen = !state.isFavoriteOpen;
    },
    addToFavorites: (state, action) => {
      state.favoriteItems.push(action.payload);
      localStorage.setItem("favoriteItems", JSON.stringify(state.favoriteItems));
    },
    removeFromFavorites: (state, action) => {
      state.favoriteItems = state.favoriteItems.filter(
        (item) => item.id !== action.payload.id
      );
      localStorage.setItem("favoriteItems", JSON.stringify(state.favoriteItems));
    },
    resetFavorites: (state) => {
      state.favoriteItems = [];
      localStorage.setItem("favoriteItems", JSON.stringify(state.favoriteItems));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteItems.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteItems = action.payload;
        localStorage.setItem("favoriteItems", JSON.stringify(state.favoriteItems));
      })
      .addCase(fetchFavoriteItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  toggleFavoriteOpen,
  addToFavorites,
  removeFromFavorites,
  resetFavorites,
} = favoriteSlice.actions;

export default combineReducers({
  cart: cartSlice.reducer,
  favorites: favoriteSlice.reducer,
});