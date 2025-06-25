const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSentimentColorClass = (sentiment) => {
  switch (sentiment) {
    case "positive":
      return "sentiment-positive";
    case "negative":
      return "sentiment-negative";
    default:
      return "sentiment-neutral";
  }
};

export { formatDate, getSentimentColorClass };
