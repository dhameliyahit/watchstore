import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { Card, Input, Select } from "./AdminControls";
import { getProducts } from "../../api/products";
import {
  createFeaturedDrop,
  deleteFeaturedDrop,
  getFeaturedDropsAdmin,
  updateFeaturedDrop,
} from "../../api/admin";

const createEmptyDropForm = () => ({
  title: "",
  description: "",
  products: [],
  startsAt: "",
  endsAt: "",
  isActive: true,
});

const normalizeProductIds = (values = []) =>
  values
    .map((value) => (typeof value === "object" ? value._id : value))
    .filter(Boolean);

const DropsSection = () => {
  const [drops, setDrops] = useState([]);
  const [dropForm, setDropForm] = useState(createEmptyDropForm);
  const [editingDrop, setEditingDrop] = useState(null);
  const [products, setProducts] = useState([]);
  const [productSelect, setProductSelect] = useState("");
  const [loadingDrops, setLoadingDrops] = useState(false);
  const [saving, setSaving] = useState(false);

  const productOptions = useMemo(
    () => [
      { label: "Select product", value: "" },
      ...products.map((product) => ({
        label: product.name,
        value: product._id,
      })),
    ],
    [products]
  );

  const selectedProductIds = normalizeProductIds(dropForm.products);

  const productNameForId = (candidate) => {
    if (!candidate) return "Unknown";
    if (typeof candidate === "object") {
      return candidate.name || candidate.title || "Unknown";
    }
    const product = products.find((item) => item._id === candidate);
    return product?.name || "Unknown";
  };

  const formatProductNames = (list = []) => {
    const normalized = normalizeProductIds(list);
    if (!normalized.length) return "None";
    return normalized
      .map((id) => productNameForId(id))
      .filter(Boolean)
      .join(", ");
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ limit: 1000 });
      setProducts(response.items || []);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  const loadDrops = async () => {
    setLoadingDrops(true);
    try {
      const response = await getFeaturedDropsAdmin();
      setDrops(response || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load drops");
    } finally {
      setLoadingDrops(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    loadDrops();
  }, []);

  const resetForm = () => {
    setDropForm(createEmptyDropForm());
    setEditingDrop(null);
    setProductSelect("");
  };

  const handleFieldChange = (field, value) =>
    setDropForm((prev) => ({ ...prev, [field]: value }));

  const addProduct = (id) => {
    if (!id) return;
    if (selectedProductIds.includes(id)) return;
    setDropForm((prev) => ({
      ...prev,
      products: [...selectedProductIds, id],
    }));
    setProductSelect("");
  };

  const removeProduct = (id) => {
    setDropForm((prev) => ({
      ...prev,
      products: selectedProductIds.filter((productId) => productId !== id),
    }));
  };

  const handleStartEditDrop = (drop) => {
    setEditingDrop(drop);
    setDropForm({
      title: drop.title,
      description: drop.description || "",
      products: normalizeProductIds(drop.products),
      startsAt: drop.startsAt?.slice(0, 10) || "",
      endsAt: drop.endsAt?.slice(0, 10) || "",
      isActive: drop.isActive,
    });
    setProductSelect("");
  };

  const handleDeleteDrop = async (id) => {
    try {
      await deleteFeaturedDrop(id);
      toast.success("Drop deleted");
      loadDrops();
      if (editingDrop?._id === id) {
        resetForm();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!dropForm.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const payload = {
      ...dropForm,
      products: normalizeProductIds(dropForm.products),
    };
    try {
      if (editingDrop) {
        await updateFeaturedDrop(editingDrop._id, payload);
        toast.success("Drop updated");
      } else {
        await createFeaturedDrop(payload);
        toast.success("Drop created");
      }
      resetForm();
      loadDrops();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editingDrop ? "Update Drop" : "Create Drop"}
          </h2>
          <button
            type="button"
            className="text-xs uppercase tracking-widest text-gray-500"
            onClick={loadDrops}
          >
            Refresh
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mt-4">
          <Input
            label="Title"
            value={dropForm.title || ""}
            onChange={(value) => handleFieldChange("title", value)}
          />
          <Input
            label="Description"
            value={dropForm.description || ""}
            onChange={(value) => handleFieldChange("description", value)}
          />

          <Input
            label="Start Date"
            type="date"
            value={dropForm.startsAt || ""}
            onChange={(value) => handleFieldChange("startsAt", value)}
          />
          <Input
            label="End Date"
            type="date"
            value={dropForm.endsAt || ""}
            onChange={(value) => handleFieldChange("endsAt", value)}
          />

          <div className="md:col-span-2 space-y-2">
            <Select
              label="Add Products"
              value={productSelect}
              options={productOptions}
              onChange={addProduct}
            />

            {selectedProductIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedProductIds.map((id) => (
                  <span
                    key={id}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {productNameForId(id)}
                    <button
                      type="button"
                      aria-label={`Remove ${productNameForId(id)}`}
                      onClick={() => removeProduct(id)}
                      className="text-gray-500 hover:text-black"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                Choose products to feature in this drop.
              </p>
            )}
          </div>

          <Select
            label="Active"
            value={dropForm.isActive ? "true" : "false"}
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
            onChange={(value) => handleFieldChange("isActive", value === "true")}
          />

          <div className="md:col-span-2 flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-xl"
              disabled={saving}
            >
              {editingDrop ? "Update Drop" : "Create Drop"}
            </button>
            {editingDrop && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl border"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Drops</h2>
          <span className="text-xs uppercase tracking-widest text-gray-400">
            {drops.length} saved
          </span>
        </div>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 uppercase text-xs tracking-widest">
              <th className="py-2">Title</th>
              <th className="py-2">Products</th>
              <th className="py-2">Active</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingDrops ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">
                  Loading featured drops…
                </td>
              </tr>
            ) : drops.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">
                  No drops created yet.
                </td>
              </tr>
            ) : (
              drops.map((drop) => (
                <tr key={drop._id} className="border-t">
                  <td className="py-3 font-medium">{drop.title}</td>
                  <td className="py-3 text-gray-500">
                    {formatProductNames(drop.products)}
                  </td>
                  <td className="py-3">{drop.isActive ? "Yes" : "No"}</td>
                  <td className="py-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStartEditDrop(drop)}
                      className="text-blue-500 text-xs uppercase tracking-widest"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDrop(drop._id)}
                      className="text-red-500 text-xs uppercase tracking-widest"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default DropsSection;
