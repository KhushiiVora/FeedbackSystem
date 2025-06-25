import { useState } from "react";
import { CheckCircle, Edit3, Eye, Calendar } from "lucide-react";
import { formatDate, getSentimentColorClass } from "../../utils/dashboardUtils";
function FeedbackCard({ feedback, isManager, onUpdate, employee }) {
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  const handleAcknowledge = async () => {
    setIsAcknowledging(true);
    try {
      await onUpdate(feedback._id);
    } finally {
      setIsAcknowledging(false);
    }
  };

  return (
    <div
      className={`feedback-card ${getSentimentColorClass(feedback.sentiment)}`}
    >
      <div className="feedback-card-header">
        <div className="feedback-card-meta">
          {isManager ? `Employee: ${employee?.name}` : ""}
          <span
            className={`sentiment-badge ${getSentimentColorClass(
              feedback.sentiment
            )}`}
          >
            {feedback.sentiment.toUpperCase()}
          </span>
          <span className="feedback-date">
            <Calendar size={14} />
            {formatDate(feedback.created_at)}
          </span>
        </div>
        <div className="feedback-card-actions">
          {isManager && (
            <button
              className="action-btn edit-btn"
              onClick={() => onUpdate(feedback)}
            >
              <Edit3 size={16} />
            </button>
          )}
          {!isManager && !feedback.acknowledged && (
            <button
              className="action-btn acknowledge-btn"
              onClick={handleAcknowledge}
              disabled={isAcknowledging}
            >
              <Eye size={16} />
              {isAcknowledging ? "Acknowledging..." : "Acknowledge"}
            </button>
          )}
          {feedback.acknowledged && (
            <span className="acknowledged-badge">
              <CheckCircle size={16} />
              Acknowledged
            </span>
          )}
        </div>
      </div>

      <div className="feedback-content">
        <div className="feedback-section">
          <h4 className="feedback-section-title">Strengths</h4>
          <p className="feedback-text">{feedback.strengths}</p>
        </div>

        <div className="feedback-section">
          <h4 className="feedback-section-title">Areas to Improve</h4>
          <p className="feedback-text">{feedback.areas_to_improve}</p>
        </div>
      </div>
    </div>
  );
}

export default FeedbackCard;
