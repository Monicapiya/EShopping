// Function to update query parameters based on key-value pairs
export const getPriceQueryParams = (searchParams, key, value) => {
  const hasValueInParam = searchParams.has(key);

  if (value && hasValueInParam) {
    searchParams.set(key, value);
  } else if (value) {
    searchParams.append(key, value);
  } else if (hasValueInParam) {
    searchParams.delete(key);
  }

  return searchParams;
};

// Function to calculate order cost based on cart items
export const calculateOrderCost = (cartItems) => {
  const itemsPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  return {
    itemsPrice: Number(itemsPrice).toFixed(2),
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};
