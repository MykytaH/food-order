import { useContext, useEffect, useRef, useState } from "react";

import { CartContext } from "../store/cart-context";

export default function Meals({ meals, fallback, isLoading }) {
  const [timeRemaining, setTimeRemaining] = useState(5);
  const cartCxt = useContext(CartContext);

  const timer = useRef();
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleStop();
    }
    if (fallback) {
      timer.current = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    }

    function handleStop() {
      clearInterval(timer.current);
    }
  }, [fallback]);

  return (
    <>
      <h2 className="meals-title">Available meals</h2>
      {isLoading && <p className="fallback">Loading...</p>}
      {!isLoading && meals.length === 0 && (
        <>
          <p className="fallback">
            {"Wasnt able to load meals data from backend."}
          </p>
          <p className="fallback">
            {"Loading from frontend in " + timeRemaining + " sec."}
          </p>
        </>
      )}
      <ul id="meals">
        {!isLoading &&
          meals.length > 0 &&
          meals.map((meal) => (
            <li key={meal.id} className="meal-item">
              <article>
                <img src={"" + meal.image} alt="" />
                <div>
                  <h3>{meal.name}</h3>
                  <p className="meal-item-price">{"$" + meal.price}</p>
                  <p className="meal-item-description">{meal.description}</p>
                </div>
                <p className="meal-item-actions">
                  <button
                    className="button"
                    onClick={() =>
                      cartCxt.addMealToCart({
                        id: meal.id,
                        name: meal.name,
                        price: meal.price,
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </p>
              </article>
            </li>
          ))}
      </ul>
    </>
  );
}
