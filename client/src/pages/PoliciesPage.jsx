import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { getPolicy } from "../api/policies";

const PolicySection = ({ title, points = [] }) => {
  if (!points.length) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">
        {title}
      </h2>

      <ul className="space-y-4">
        {points.map((point, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed"
          >
            <span className="mt-2 h-2 w-2 rounded-full bg-black shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const textToPoints = (text = "") =>
  text
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

const PoliciesPage = () => {
  const [loading, setLoading] = useState(true);
  const [policyData, setPolicyData] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await getPolicy("store");
        setPolicyData(res);
      } catch (err) {
        console.error("Failed to load policies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  return (
    <Layout>
      <section className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Store Policies
            </h1>
            <p className="mt-3 text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
              Please review our policies carefully before making a purchase.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading policies...</p>
          ) : (
            <div className="space-y-8">
              <PolicySection
                title="Warranty Policy"
                points={textToPoints(policyData?.warrantyInfo)}
              />

              <PolicySection
                title="Authenticity Guarantee"
                points={textToPoints(policyData?.authenticityInfo)}
              />

              <PolicySection
                title="Returns & Refund Policy"
                points={textToPoints(policyData?.returnsPolicy)}
              />
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default PoliciesPage;
