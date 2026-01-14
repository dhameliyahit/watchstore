import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateProfile } from "../api/auth";
import { getMyOrders } from "../api/orders";
import { getWishlist } from "../api/wishlist";
import { useAuth } from "../context/AuthContext.jsx";
import Layout from "../layout/Layout";

const Account = () => {
  const { user, login, register, logout } = useAuth();
  const [tab, setTab] = useState("profile");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlist([]);
        return;
      }
      const data = await getWishlist();
      setWishlist(data.items || []);
    };
    loadWishlist();
  }, [user]);

  return (
    <Layout>
      <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 py-10 px-4">
        {!user ? (
          <AuthPage onLogin={login} onRegister={register} />
        ) : (
          <ProfileDashboard
            user={user}
            wishlist={wishlist}
            tab={tab}
            setTab={setTab}
            onLogout={logout}
          />
        )}
      </div>
    </Layout>
  );
};

export default Account;

/* ================= AUTH PAGE ================= */

const AuthPage = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin
              ? "Login to access your dashboard"
              : "Register and start shopping today"}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 cursor-pointer py-2 rounded-full text-sm font-medium transition ${
                isLogin ? "bg-black text-white" : "text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 cursor-pointer py-2 rounded-full text-sm font-medium transition ${
                !isLogin ? "bg-black text-white" : "text-gray-600"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {isLogin ? (
          <LoginForm onLogin={onLogin} />
        ) : (
          <RegisterForm onRegister={onRegister} />
        )}
      </div>
    </div>
  );
};

/* ================= LOGIN ================= */

const LoginForm = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await onLogin(values);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email Address"
        type="email"
        registration={register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address",
          },
        })}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        registration={register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        error={errors.password?.message}
      />

      <button
        disabled={isSubmitting}
        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
      >
        Login
      </button>

      <p className="text-xs text-center text-gray-500">
        Forgot password? Contact support
      </p>
    </form>
  );
};

/* ================= REGISTER ================= */

const RegisterForm = ({ onRegister }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (values) => {
    try {
      await onRegister({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        streetAddr: values.street,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
      });
      toast.success("Account created");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          registration={register("firstName", {
            required: "First name is required",
          })}
          error={errors.firstName?.message}
        />
        <Input
          label="Last Name"
          registration={register("lastName", {
            required: "Last name is required",
          })}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        registration={register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address",
          },
        })}
        error={errors.email?.message}
      />

      <Input
        label="Street Address"
        registration={register("street", {
          required: "Street address is required",
        })}
        error={errors.street?.message}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="City"
          registration={register("city", { required: "City is required" })}
          error={errors.city?.message}
        />
        <Input
          label="State"
          registration={register("state", { required: "State is required" })}
          error={errors.state?.message}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Postal Code"
          registration={register("postalCode", {
            required: "Postal code is required",
          })}
          error={errors.postalCode?.message}
        />
        <Input
          label="Country"
          registration={register("country", {
            required: "Country is required",
          })}
          error={errors.country?.message}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Password"
          type="password"
          registration={register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={errors.password?.message}
        />
        <Input
          label="Confirm Password"
          type="password"
          registration={register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />
      </div>

      <button
        disabled={isSubmitting}
        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
      >
        Create Account
      </button>

      <p className="text-xs text-center text-gray-500">
        By creating an account, you agree to our Terms & Privacy Policy
      </p>
    </form>
  );
};

/* ================= INPUT ================= */

const Input = ({ label, type = "text", registration, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        required
        {...registration}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

/* ================= DASHBOARD ================= */

const ProfileDashboard = ({ user, wishlist, tab, setTab, onLogout }) => {
  return (
    <div className="max-w-6xl mx-auto min-h-[80vh] grid md:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold mb-6 text-lg">My Account</h3>
        <ul className="space-y-3 text-sm">
          <SidebarItem
            label="Profile"
            active={tab === "profile"}
            onClick={() => setTab("profile")}
          />
          <SidebarItem
            label="Orders"
            active={tab === "orders"}
            onClick={() => setTab("orders")}
          />
          <SidebarItem
            label="Update Profile"
            active={tab === "update"}
            onClick={() => setTab("update")}
          />
          <li
            onClick={onLogout}
            className="cursor-pointer text-red-500 font-medium mt-6"
          >
            Logout
          </li>
        </ul>
      </div>

      <div className="md:col-span-3 bg-white rounded-2xl shadow p-8">
        {tab === "profile" && <ProfileInfo user={user} wishlist={wishlist} />}
        {tab === "orders" && <Orders />}
        {tab === "update" && <UpdateProfile user={user} />}
      </div>
    </div>
  );
};

const SidebarItem = ({ label, active, onClick }) => (
  <li
    onClick={onClick}
    className={`cursor-pointer px-4 py-2 rounded-lg transition ${
      active ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {label}
  </li>
);

/* ================= CONTENT ================= */

const ProfileInfo = ({ user, wishlist }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
    <div className="space-y-2 text-gray-600">
      <p>
        <span className="font-medium">Name:</span>{" "}
        {user.firstName} {user.lastName}
      </p>
      <p>
        <span className="font-medium">Email:</span> {user.email}
      </p>
    </div>
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Wishlist</h3>
        <Link
          to="/wishlist"
          className="text-xs uppercase tracking-[0.4em] text-gray-500 hover:text-black cursor-pointer"
        >
          View all
        </Link>
      </div>
      {wishlist?.length ? (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          {wishlist.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-gray-100 p-3 text-xs text-gray-600"
            >
              {item.name}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-2">
          Save products to your wishlist to see them here.
        </p>
      )}
    </div>
  </div>
);


const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading orders...</p>;
  }

  if (!orders.length) {
    return <p className="text-gray-500">You haven't placed any orders yet.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-8">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">
                  Order ID
                </p>
                <p className="font-medium text-gray-900">
                  #{order._id}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    statusStyles[order.status] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>

                <span className="text-xs uppercase tracking-widest text-gray-400">
                  {order.paymentMethod}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="mt-6 space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 border-t pt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium">Shipping:</span>{" "}
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName},{" "}
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.country}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{order.totalPrice}
                </p>

                {!order.isPaid &&
                  order.paymentMethod === "cashfree" &&
                  order.paymentResult?.raw?.payment_link && (
                    <a
                      href={order.paymentResult.raw.payment_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-2 text-xs uppercase tracking-widest bg-black text-white px-4 py-2 rounded-xl hover:opacity-90"
                    >
                      Pay Now
                    </a>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const UpdateProfile = ({ user }) => {
  const { refreshProfile } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      streetAddr: user.streetAddr || "",
      city: user.city || "",
      state: user.state || "",
      postalCode: user.postalCode || "",
      country: user.country || "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await updateProfile(values);
      await refreshProfile();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Update Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <Input
          label="First Name"
          registration={register("firstName", {
            required: "First name is required",
          })}
          error={errors.firstName?.message}
        />
        <Input
          label="Last Name"
          registration={register("lastName", {
            required: "Last name is required",
          })}
          error={errors.lastName?.message}
        />
        <Input
          label="Email"
          type="email"
          registration={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
          error={errors.email?.message}
        />
        <Input label="Street" registration={register("streetAddr")} />
        <Input label="City" registration={register("city")} />
        <Input label="State" registration={register("state")} />
        <Input label="Postal Code" registration={register("postalCode")} />
        <Input label="Country" registration={register("country")} />
        <button
          disabled={isSubmitting}
          className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-60"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};
