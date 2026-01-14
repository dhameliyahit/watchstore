const Card = ({ children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6">{children}</div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
);

const TextArea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
      {label}
    </label>
    <textarea
      rows={4}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
);

const Select = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ActionButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1 rounded-full border text-xs uppercase tracking-widest"
  >
    {children}
  </button>
);

export { Card, Input, TextArea, Select, ActionButton };
