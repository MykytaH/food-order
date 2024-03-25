import { useContext } from "react";

import { CartContext } from "../store/cart-context";

export default function Cart({ onCloseCart, onOrderOpen }) {
  const cartCxt = useContext(CartContext);
  let total = 0;
  return (
    <div className="cart">
      <h2>Your cart</h2>
      {cartCxt.items.length === 0 && <p>No meals in your cart yet!</p>}
      {cartCxt.items.length > 0 && (
        <>
          <ul>
            {cartCxt.items.map((item) => {
              const itemPrice = (+item.price * +item.quantity).toFixed(2);

              total += +itemPrice;
              return (
                <li key={item.name} className="cart-item">
                  <p>
                    {item.name + " x " + item.quantity + " - $" + itemPrice}
                  </p>
                  <div className="cart-item-actions">
                    <button onClick={() => cartCxt.updateQuantity(item.id, -1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => cartCxt.updateQuantity(item.id, +1)}>
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <span className="cart-total">{"Total: $" + total.toFixed(2)}</span>
        </>
      )}

      <div className="modal-actions">
        <button className="text-button" onClick={onCloseCart}>
          Close
        </button>
        {cartCxt.items.length > 0 && (
          <button className="button" onClick={onOrderOpen}>
            Buy
          </button>
        )}
      </div>
    </div>
  );
}
