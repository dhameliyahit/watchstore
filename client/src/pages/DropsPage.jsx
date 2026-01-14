import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedDrops } from "../api/featuredDrops";
import Layout from "../layout/Layout";

const DropsPage = () => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDrops = async () => {
      const data = await getFeaturedDrops();
      setDrops(data || []);
      setLoading(false);
    };
    loadDrops();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-6">Featured Drops</h1>
        {loading ? (
          <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        ) : drops.length === 0 ? (
          <p className="text-gray-500">No active drops right now.</p>
        ) : (
          <div className="space-y-6">
            {drops.map((drop) => (
              <div
                key={drop._id}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <h2 className="text-xl font-semibold">{drop.title}</h2>
                <p className="text-sm text-gray-600 mt-2">
                  {drop.description}
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {(drop.products || []).map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="border rounded-xl overflow-hidden"
                    >
                      <img
                        src={product.images?.[0] || "/asset/heo.png"}
                        alt={product.name}
                        className="h-40 w-full object-cover"
                      />
                      <div className="p-3">
                        <p className="text-xs uppercase tracking-widest text-gray-400">
                          {product.brand}
                        </p>
                        <p className="font-medium">{product.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DropsPage;
