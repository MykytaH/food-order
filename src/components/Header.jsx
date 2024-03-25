import { useContext } from "react";

import { CartContext } from "../store/cart-context";

export default function Header({ onOpenCart }) {
  const cartCxt = useContext(CartContext);

  let totalQuantity = cartCxt.items.length;
  return (
    <header id="main-header">
      <div id="title">
        <img src="./logo.jpg" alt="stylized image of meal" />
        <h1>ReactFood</h1>
      </div>
      <button className="button" onClick={onOpenCart}>
        Cart ({totalQuantity})
      </button>
    </header>
  );
}
