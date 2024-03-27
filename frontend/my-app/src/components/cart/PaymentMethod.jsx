import React, { useEffect, useState } from "react";
import MetaData from "../layouts/MetaData";
import { useSelector } from "react-redux";
import CheckOutSteps from "./CheckOutSteps";
import { calculateOrderCost } from "../../helpers/helpers";
import { useCreateNewOrderMutation } from "../../redux/api/OrderApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const [createNewOrder, { error, isSuccess, isLoading }] = useCreateNewOrderMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data.message);
    }
    if (isSuccess) {
      navigate("/me/orders?order_success=true");
    }
  }, [error, isSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateOrderCost(cartItems);

    if (method === "COD") {
      // Create COD order
      const orderData = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
        paymentInfo: {
          status: "Not Paid",
        },
        paymentMethod: "COD",
      };

      createNewOrder(orderData);
    }
  };

  return (
    <>
      <MetaData title={"Payment Method"} />
      <CheckOutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={handleSubmit}>
            <h2 className="mb-4">Select Payment Method</h2>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setMethod("COD")}
              />
              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>
           
            <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isLoading}>
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
