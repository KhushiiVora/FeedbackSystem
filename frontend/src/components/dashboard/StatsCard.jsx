function StatsCard({ title, value, icon: Icon, className = "" }) {
  return (
    <div className={`stats-card ${className}`}>
      <div className="stats-card-content">
        <div className="stats-card-header">
          <h3 className="stats-card-title">{title}</h3>
          <Icon className="stats-card-icon" size={24} />
        </div>
        <p className="stats-card-value">{value}</p>
      </div>
    </div>
  );
}

export default StatsCard;
