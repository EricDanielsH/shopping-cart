import { ReactNode, createContext, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const cartQuantity = cartItems.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  function openCart() {
    setIsOpen(true);
  }

  function closeCart() {
    setIsOpen(false);
  }

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function increaseCartQuantity(id: number) {
    setCartItems((prevCartItems) => {
      if (prevCartItems.find((item) => item.id === id) == null) {
        return [...prevCartItems, { id, quantity: 1 }];
      }

      return prevCartItems.map((prevCarItem) => {
        return prevCarItem.id === id
          ? { ...prevCarItem, quantity: prevCarItem.quantity + 1 }
          : prevCarItem;
      });
    });
  }

  function decreaseCartQuantity(id: number) {
    setCartItems((prevCartItems) => {
      if (prevCartItems.find((item) => item.id === id)?.quantity === 1) {
        return prevCartItems.filter((item) => item.id !== id);
      }

      return prevCartItems.map((prevCarItem) => {
        return prevCarItem.id === id
          ? { ...prevCarItem, quantity: prevCarItem.quantity - 1 }
          : prevCarItem;
      });
    });
  }

  function removeFromCart(id: number) {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== id)
    );
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        openCart,
        closeCart,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartQuantity,
        cartItems,
      }}
    >
      <ShoppingCart isOpen={isOpen} />
      {children}
    </ShoppingCartContext.Provider>
  );
}
