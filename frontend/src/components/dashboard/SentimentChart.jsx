import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function SentimentChart({ data, type = "bar" }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    sentiment: key.charAt(0).toUpperCase() + key.slice(1),
    count: value,
  }));

  const colors = {
    Positive: "#10B981",
    Neutral: "#F59E0B",
    Negative: "#EF4444",
  };

  if (type === "pie") {
    return (
      <div className="chart-container">
        <h3 className="chart-title">Sentiment Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              label={({ sentiment, count }) => `${sentiment}: ${count}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[entry.sentiment]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">Feedback Sentiment Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sentiment" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SentimentChart;
