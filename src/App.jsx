import { useEffect, useState } from "react";
import Header from "./components/Header";
import Meals from "./components/Meals";
import Modal from "./components/Modal";
import Cart from "./components/Cart";
import OrderForm from "./components/OrderForm";
import { CartContext } from "./store/cart-context";
import { MEALS } from "./meals";

let errorFallbackText = false;

function App() {
  const [meals, setMeals] = useState([]);
  const [userMeals, setUserMeals] = useState({ items: [] });
  const [showModal, setShowModal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMeals() {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:3000/meals");
        const resData = await response.json();
        const fetchedMeals = resData || [];
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }

        setMeals(fetchedMeals);
        setLoading(false);
      } catch (error) {
        errorFallbackText = true;
        setTimeout(() => {
          setMeals(MEALS);
        }, 5000);
        setLoading(false);
      }
    }

    fetchMeals();
  }, []);

  function handleSelectMeal({ id, name, price }) {
    setUserMeals((prevState) => {
      let userCart = [...prevState.items];
      const existingCartItemIndex = userCart.findIndex(
        (cartItem) => cartItem.id === id
      );
      let quantity = 1;
      if (existingCartItemIndex !== -1) {
        quantity = userCart[existingCartItemIndex].quantity;
        let itemToUpdate = userCart[existingCartItemIndex];
        itemToUpdate = { ...itemToUpdate, quantity: +quantity + 1 };
        userCart[existingCartItemIndex] = itemToUpdate;
      } else {
        userCart = [...userCart, { id, name, price, quantity }];
      }

      return {
        items: [...userCart],
      };
    });
  }

  function handleUpdateQuantity(id, modifier) {
    setUserMeals((prevState) => {
      let userCart = [...prevState.items];
      const existingCartItemIndex = userCart.findIndex(
        (cartItem) => cartItem.id === id
      );
      let itemToUpdate = userCart[existingCartItemIndex];
      itemToUpdate = {
        ...itemToUpdate,
        quantity: +itemToUpdate.quantity + modifier,
      };
      if (itemToUpdate.quantity === 0) {
        userCart.splice(existingCartItemIndex, 1);
      } else {
        userCart[existingCartItemIndex] = itemToUpdate;
      }

      return {
        items: [...userCart],
      };
    });
  }

  function handleCartOpen() {
    setShowModal("cart");
  }

  function handleCartClose() {
    setShowModal("");
  }

  function handleOrderOpen() {
    setShowModal("order");
  }

  function handleOrderClose(done) {
    setShowModal("");
    if (done === "done") {
      setUserMeals({ items: [] });
    }
  }

  const ctxValue = {
    items: userMeals.items,
    addMealToCart: handleSelectMeal,
    updateQuantity: handleUpdateQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>
      <Modal
        open={showModal === "cart"}
        currentModal={showModal}
        onClose={handleCartClose}
      >
        <Cart onCloseCart={handleCartClose} onOrderOpen={handleOrderOpen} />
      </Modal>
      <Modal open={showModal === "order"} onClose={handleOrderClose}>
        <OrderForm onCloseOrder={handleOrderClose} />
      </Modal>
      <Header onOpenCart={handleCartOpen} />
      <section>
        <Meals meals={meals} fallback={errorFallbackText} isLoading={loading} />
      </section>
    </CartContext.Provider>
  );
}

export default App;
