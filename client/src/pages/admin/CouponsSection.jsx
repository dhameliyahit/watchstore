import { Card, Input, Select } from "./AdminControls";

const CouponsSection = ({
  coupons = [],
  couponForm = {},
  editingCoupon = null,
  onCouponFieldChange = () => {},
  onCouponSubmit = () => {},
  onStartEditCoupon = () => {},
  onCancelEditCoupon = () => {},
  onDeleteCoupon = () => {},
}) => (
  <div className="space-y-6">
    <Card>
      <h2 className="text-lg font-semibold mb-4">Coupon</h2>
      <form onSubmit={onCouponSubmit} className="grid md:grid-cols-2 gap-4">
        <Input
          label="Code"
          value={couponForm.code || ""}
          onChange={(v) => onCouponFieldChange("code", v)}
        />
        <Select
          label="Type"
          value={couponForm.discountType || "percent"}
          options={[
            { label: "Percent", value: "percent" },
            { label: "Fixed", value: "fixed" },
          ]}
          onChange={(v) => onCouponFieldChange("discountType", v)}
        />
        <Input
          label="Value"
          type="number"
          value={couponForm.value || ""}
          onChange={(v) => onCouponFieldChange("value", v)}
        />
        <Input
          label="Min Order"
          type="number"
          value={couponForm.minOrder || ""}
          onChange={(v) => onCouponFieldChange("minOrder", v)}
        />
        <Input
          label="Max Discount"
          type="number"
          value={couponForm.maxDiscount || ""}
          onChange={(v) => onCouponFieldChange("maxDiscount", v)}
        />
        <Input
          label="Expires At"
          type="date"
          value={couponForm.expiresAt || ""}
          onChange={(v) => onCouponFieldChange("expiresAt", v)}
        />
        <div className="md:col-span-2 flex gap-3">
          <button className="bg-black text-white px-6 py-3 rounded-xl font-medium">
            {editingCoupon ? "Update Coupon" : "Create Coupon"}
          </button>
          {editingCoupon && (
            <button
              type="button"
              onClick={onCancelEditCoupon}
              className="px-6 py-3 rounded-xl border"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </Card>

    <Card>
      <h2 className="text-lg font-semibold mb-4">Coupons List</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 uppercase text-xs tracking-widest">
            <th className="py-2">Code</th>
            <th className="py-2">Type</th>
            <th className="py-2">Value</th>
            <th className="py-2">Active</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon._id} className="border-t">
              <td className="py-3">{coupon.code}</td>
              <td className="py-3">{coupon.discountType}</td>
              <td className="py-3">{coupon.value}</td>
              <td className="py-3">{coupon.isActive ? "Yes" : "No"}</td>
              <td className="py-3 flex gap-2">
                <button
                  type="button"
                  className="text-xs uppercase tracking-widest text-blue-500"
                  onClick={() => onStartEditCoupon(coupon)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-xs uppercase tracking-widest text-red-500"
                  onClick={() => onDeleteCoupon(coupon._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

export default CouponsSection;
