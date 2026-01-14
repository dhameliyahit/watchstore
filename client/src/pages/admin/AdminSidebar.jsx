import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ sections, active, onSectionChange }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/");
    window.location.reload();
  };

  return (
    <aside className="bg-white border border-gray-100 rounded-2xl p-4 h-fit">
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onSectionChange(section.id)}
            className={`w-full cursor-pointer text-left px-4 py-2 rounded-xl text-sm font-semibold transition ${
              active === section.id
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="my-4 border-t border-gray-200" />

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full cursor-pointer text-left px-4 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
