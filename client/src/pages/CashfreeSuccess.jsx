import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../layout/Layout";
import toast from "react-hot-toast";

const CashfreeSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const status = searchParams.get("txStatus");
    if (status && status !== "SUCCESS") {
      toast.error("Payment was not successful.");
    } else if (status === "SUCCESS") {
      toast.success("Payment successful! Your order will be processed.");
    }
  }, [searchParams]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold mb-6">Thank you!</h1>
        <p className="text-gray-600 mb-4">
          <strong>Status:</strong>{" "}
          {searchParams.get("txStatus") || "Unknown"}
        </p>
        <p className="text-gray-500 mb-8">
          Cashfree redirected you here after payment. You can go back to the
          shop or view your orders via your account.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/account")}
            className="px-6 py-3 bg-black text-white rounded-full"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 border border-gray-300 rounded-full"
          >
            Back to Shop
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CashfreeSuccess;
