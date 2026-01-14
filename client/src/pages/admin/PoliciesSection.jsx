import { Card } from "./AdminControls";

const PolicyField = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-800">
        {label}
      </label>

      <textarea
        rows={5}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
      />
    </div>
  );
};

const PoliciesSection = ({
  policyForm = {},
  onPolicyChange = () => {},
  onSavePolicy = () => {},
}) => {
  return (
    <Card>
      <h2 className="text-lg font-semibold mb-6">
        Store Policies
      </h2>

      <div className="space-y-6">
        <PolicyField
          label="Warranty Policy"
          value={policyForm.warrantyInfo}
          placeholder="Example:
• All watches include manufacturer warranty
• Warranty does not cover physical damage"
          onChange={(value) =>
            onPolicyChange("warrantyInfo", value)
          }
        />

        <PolicyField
          label="Authenticity Guarantee"
          value={policyForm.authenticityInfo}
          placeholder="Example:
• 100% genuine and authentic products
• Each item is verified before dispatch"
          onChange={(value) =>
            onPolicyChange("authenticityInfo", value)
          }
        />

        <PolicyField
          label="Returns & Refund Policy"
          value={policyForm.returnsPolicy}
          placeholder="Example:
• Returns accepted within 7 days
• Product must be unused and sealed"
          onChange={(value) =>
            onPolicyChange("returnsPolicy", value)
          }
        />

        <button
          onClick={onSavePolicy}
          className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:opacity-90"
        >
          Save Policies
        </button>
      </div>
    </Card>
  );
};

export default PoliciesSection;
