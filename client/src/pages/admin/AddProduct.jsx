import { ImagePlus, Loader2, Package, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Card, Input } from "./AdminControls";

const AddProductSection = ({
  productRows = [],
  productForm,
  setProductForm,
  editingProduct,
  setEditingProduct,
  setProductImages,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  loading,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const isEditing = Boolean(editingProduct);

  const openAdd = () => {
    setEditingProduct(null);
    setDrawerOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct({
      ...product,
      categories: product.categories?.join(", ") || "",
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const source = editingProduct || productForm;
  const setValue = (key, value) =>
    editingProduct
      ? setEditingProduct({ ...editingProduct, [key]: value })
      : setProductForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="space-y-6 relative">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Package size={20} />
          Products
        </h1>

        <button
          onClick={openAdd}
          className="flex cursor-pointer items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productRows.map((product) => (
          <Card key={product._id} className="p-4 space-y-3">
            <div className="aspect-4/3 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-xs text-gray-500">{product.brand}</p>
            </div>

            <div className="flex justify-between text-sm">
              <span>
                {product.currency} {product.price}
              </span>
              <span className="text-gray-400">Stock: {product.stock}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => openEdit(product)}
                className="flex-1 cursor-pointer flex items-center justify-center gap-1 border rounded-lg py-2 text-sm"
              >
                <Pencil size={14} />
                Edit
              </button>

              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="flex-1 cursor-pointer flex items-center justify-center gap-1 border border-red-200 text-red-600 rounded-lg py-2 text-sm"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={closeDrawer} />
          <div className="w-full max-w-md bg-white h-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                {isEditing ? "Update Product" : "Add Product"}
              </h2>
              <button className="cursor-pointer" onClick={closeDrawer}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={isEditing ? handleUpdateProduct : handleCreateProduct}
              className="space-y-3"
            >
              {[
                "name",
                "brand",
                "price",
                "stock",
                "caseSize",
                "movement",
                "strapMaterial",
                "caseMaterial",
                "waterResistance",
                "gender",
                "categories",
                "description",
              ].map((field) => (
                <Input
                  key={field}
                  label={field.replace(/([A-Z])/g, " $1")}
                  value={source[field] || ""}
                  onChange={(v) => setValue(field, v)}
                />
              ))}

              {!isEditing && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Product Images
                  </label>

                  {/* Upload box */}
                  <label className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition">
                    <ImagePlus size={26} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload images
                    </span>
                    <span className="text-xs text-gray-400">
                      JPG, PNG, WEBP
                    </span>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setImageFiles(files);
                        setProductImages(files);
                      }}
                    />
                  </label>

                  {/* Preview */}
                  {imageFiles.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {imageFiles.map((file, index) => {
                        const previewUrl = URL.createObjectURL(file);

                        return (
                          <div
                            key={index}
                            className="relative border rounded-lg overflow-hidden"
                          >
                            <img
                              src={previewUrl}
                              alt="preview"
                              className="w-full h-24 object-cover"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                const updated = imageFiles.filter(
                                  (_, i) => i !== index
                                );
                                setImageFiles(updated);
                                setProductImages(updated);
                              }}
                              className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <button className="w-full cursor-pointer bg-black text-white py-3 rounded-lg">
                {isEditing ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
          <Loader2 className="animate-spin" size={32} />
        </div>
      )}
    </div>
  );
};

export default AddProductSection;
