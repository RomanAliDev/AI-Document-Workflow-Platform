const StatCard = ({ title, value, description }) => {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>

      <p className="mt-2 text-xs text-gray-500">{description}</p>
    </div>
  );
};

export default StatCard;
