import { useState } from "react";
import {
  Package,
  MoreVertical,
  CreditCard,
  Truck,
  XCircle,
  RotateCcw,
  MapPin,
  User,
  Calendar,
} from "lucide-react";
import { Card } from "./AdminControls";

/* ------------------ */
/* CONFIG */
/* ------------------ */
const ORDERS_PER_PAGE = 3;

/* ------------------ */
/* STATUS STYLES */
/* ------------------ */
const statusMap = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};


const OrdersSection = ({ orders = [], onOrderAction }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  return (
    <Card className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Package size={18} />
          Orders
        </h2>
        <span className="text-sm text-gray-500">
          Total Orders: {orders.length}
        </span>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-6">
        {paginatedOrders.map((order) => (
          <div
            key={order._id}
            className="border rounded-2xl p-5 space-y-4 relative"
          >
            {/* TOP ROW */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Order ID</p>
                <p className="text-sm font-semibold">#{order._id}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <User size={12} />
                  {order.user?.email || "Guest User"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusMap[order.status] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>

                {/* ACTION MENU */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === order._id ? null : order._id
                      )
                    }
                    className="p-2 cursor-pointer rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openMenu === order._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-20">
                      {!order.isPaid && (
                        <ActionItem
                          icon={CreditCard}
                          label="Mark as Paid"
                          onClick={() => onOrderAction("pay", order)}
                        />
                      )}

                      {order.isPaid && !order.isDelivered && (
                        <ActionItem
                          icon={Truck}
                          label="Mark as Delivered"
                          onClick={() =>
                            onOrderAction("deliver", order)
                          }
                        />
                      )}

                      {order.isPaid && !order.isRefunded && (
                        <ActionItem
                          icon={RotateCcw}
                          label="Refund Order"
                          onClick={() =>
                            onOrderAction("refund", order)
                          }
                        />
                      )}

                      {order.status !== "cancelled" &&
                        order.status !== "refunded" && (
                          <ActionItem
                            icon={XCircle}
                            label="Cancel Order"
                            danger
                            onClick={() =>
                              onOrderAction("cancel", order)
                            }
                          />
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border rounded-xl p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover border"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-semibold">
                    INR {item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* SHIPPING */}
            <div className="border rounded-xl p-3 text-sm space-y-1">
              <p className="font-medium flex items-center gap-1">
                <MapPin size={14} />
                Shipping Address
              </p>
              <p className="text-gray-600">
                {order.shippingAddress?.firstName}{" "}
                {order.shippingAddress?.lastName},{" "}
                {order.shippingAddress?.streetAddr},{" "}
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.postalCode},{" "}
                {order.shippingAddress?.country}
              </p>
              {order.shippingAddress?.phone && (
                <p className="text-xs text-gray-500">
                  Phone: {order.shippingAddress.phone}
                </p>
              )}
            </div>

            {/* PAYMENT INFO */}
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Info label="Payment Method" value={order.paymentMethod} />
              <Info label="Items Price" value={`INR ${order.itemsPrice}`} />
              <Info label="Tax" value={`INR ${order.taxPrice}`} />
              <Info label="Shipping" value={`INR ${order.shippingPrice}`} />
            </div>

            {/* REFUND INFO */}
            {order.isRefunded && (
              <div className="border border-purple-200 bg-purple-50 rounded-xl p-3 text-sm space-y-1">
                <p className="font-medium text-purple-700 flex items-center gap-1">
                  <RotateCcw size={14} />
                  Refund Details
                </p>
                <p>Amount: INR {order.refundAmount}</p>
                <p>Reason: {order.refundReason || "—"}</p>
              </div>
            )}

            {/* FOOTER */}
            <div className="flex justify-between items-center border-t pt-3">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                {new Date(order.createdAt).toLocaleString()}
              </div>
              <div className="text-base font-semibold">
                Total: INR {order.totalPrice}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 cursor-pointer border rounded-lg disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 cursor-pointer py-1 border rounded-lg ${
                currentPage === i + 1
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 cursor-pointer border rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </Card>
  );
};

export default OrdersSection;

/* ------------------ */
/* SMALL COMPONENTS */
/* ------------------ */

// eslint-disable-next-line no-unused-vars
const ActionItem = ({ icon: Icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full cursor-pointer flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${
      danger ? "text-red-600" : "text-gray-700"
    }`}
  >
    <Icon size={14} />
    {label}
  </button>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between border rounded-lg px-3 py-2">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);
