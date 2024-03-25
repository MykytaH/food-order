import { useContext, useState } from "react";

import { CartContext } from "../store/cart-context";

export default function OrderForm({ onCloseOrder }) {
  const [orderState, setOrderState] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const cartCxt = useContext(CartContext);
  let total = cartCxt.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );
  total = total.toFixed(2);

  async function handleSubmit(event) {
    setOrderState();
    event.preventDefault();

    const fd = new FormData(event.target);
    const customer = Object.fromEntries(fd.entries());

    const order = {
      items: cartCxt.items,
      customer,
    };
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/Orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(
          resData.message || "Something went wrong, failed to send request."
        );
      }
      setOrderState(resData.message);
      setIsLoading(false);
    } catch (error) {
      setOrderState(error.message || "Something is wrong");
      setIsLoading(false);
    }
  }

  function handleCloseOrder(event) {
    event.preventDefault();
    onCloseOrder();
  }

  return (
    <>
      {orderState === "Order created!" ? (
        <>
          <h2>Success!</h2>
          <p>Your order was submitted successfully.</p>
          <p>
            We will get back to you with more details via email within the next
            few minutes.
          </p>
          <p className="modal-actions">
            <button
              onClick={() => onCloseOrder("done")}
              className="text-button"
            >
              Okay
            </button>
          </p>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total Amount: ${total}</p>
            <p className="control">
              <label htmlFor="name">Name</label>
              <input required id="name" type="text" name="name" />
            </p>
            <p className="control">
              <label htmlFor="email">Email</label>
              <input required id="email" type="email" name="email" />
            </p>
            <p className="control">
              <label htmlFor="address">Address</label>
              <input required id="address" type="text" name="address" />
            </p>
            {orderState && (
              <>
                <div className="error">
                  <h2>{orderState}</h2>
                  <p>Something went wrong!</p>
                  <p>Please try again! Or press button if backend is dead ))</p>
                  <button
                    onClick={() => setOrderState("Order created!")}
                    className="button"
                  >
                    CLICK !!!
                  </button>
                </div>
              </>
            )}

            <p className="modal-actions">
              {isLoading ? (
                <span>Processing the order...</span>
              ) : (
                <>
                  <button onClick={handleCloseOrder} className="text-button">
                    Close
                  </button>
                  <button className="button">Order</button>
                </>
              )}
            </p>
          </form>
        </>
      )}
    </>
  );
}
