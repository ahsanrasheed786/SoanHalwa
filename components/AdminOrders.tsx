"use client";

 
import React, { useEffect, useState } from "react";
import Link from "next/link";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch("http://localhost:3000/api/customer_order_product");
      const data = await response.json();
      setOrders(data);
      // console.log(data[0].customerOrderId)
      console.log(data)

    };
    fetchOrders();
  }, []);

  return (
    <div className="xl:ml-5 w-full max-xl:mt-5 ">
      <h1 className="text-3xl font-semibold text-center mb-5">All orders</h1>
      <div className="overflow-x-auto">
        <table className="table table-md table-pin-cols">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Order ID</th>
              <th>Name    </th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {orders &&
              orders.map((order) => (
                // console.log(customerOrderId)
                <tr key={order?.customerOrderId}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>

                  <td>
                    <div>
                      <p className="font-bold">#{order?.customerOrderId}</p>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-5">
                      <div>
                        <div className="font-bold">{order?.customerOrder?.name } {order?.customerOrder?.lastname }</div>
                        {/* <div className="text-sm opacity-50">{order?.customerOrder?.country}</div> */}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-success text-white badge-sm">
                      {order?.customerOrder?.status}
                    </span>
                  </td>

                  <td>
                    <p>${order?.customerOrder?.total}</p>
                  </td>

                  <td>{ new Date(Date.parse(order?.customerOrder?.dateTime)).toDateString() }</td>
                  <th>
                    <Link
                      href={`/admin/orders/${order?.customerOrderId}`}
                      className="btn btn-ghost btn-xs">
                      details
                    </Link>
                  </th>
                </tr>
              ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Order ID</th>
              <th>Name and country</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
