import React, { useEffect } from "react";
import { useMyOrdersQuery } from "../../redux/api/OrderApi";
import toast from "react-hot-toast";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../features/cartSlice";

const MyOrders = () => {
  const { data, isLoading, error } = useMyOrdersQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderSuccess = searchParams.get("order_success");

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (orderSuccess) {
      dispatch(clearCart());
      navigate("/me/orders");
    }
  }, [error, orderSuccess]);

  const setOrders = () => {
    const orders = {
      columns: [
        { label: "ID", field: "id", sort: "asc" },
        // {label: "Order Items", field: "orderItems", sort: "asc"},
        { label: "Amount Paid", field: "amount", sort: "asc" },
        { label: "Payment Status", field: "status", sort: "asc" },
        // { label: "Order Status", field: "orderStatus", sort: "asc" },
        { label: "Actions", field: "actions", sort: "asc" },
      ],
      rows: [],
    };

    data?.orders?.forEach((order) => {
      orders.rows.push({
        id: order?._id,
        amount: `Rs ${order?.totalAmount}`,
        status: order?.paymentInfo?.status?.toUpperCase(),
        orderStaus: order?.orderStatus,
        actions: (
          <>
            <Link to={`/me/order/${order?._id}`} className="btn btn-primary">
              <i className="fa fa-eye"></i>
            </Link>
          </>
        ),
      });
    });

    return orders;
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="my-5">{data?.orders?.length} Orders</h1>

      <MDBDataTable
        data={setOrders()}
        className="px-3"
        bordered
        striped
        hover
      />
    </div>
  );
};

export default MyOrders;
