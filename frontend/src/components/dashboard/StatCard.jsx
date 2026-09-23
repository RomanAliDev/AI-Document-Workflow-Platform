const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  cardColor,
  iconColor,
}) => {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition hover:shadow-md ${cardColor}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>

          <p className="mt-2 text-xs text-gray-500">{description}</p>
        </div>

        {Icon && (
          <div className={`rounded-lg p-2 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
