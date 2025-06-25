import { useState, useEffect } from "react";
import FeedbackCard from "./FeedbackCard";

function FeedbackList({
  feedbackList,
  isManager,
  onLoadMore,
  hasMore,
  isLoading,
  onUpdate,
  team,
}) {
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loadingMore ||
        !hasMore
      ) {
        return;
      }
      handleLoadMore();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore]);

  return (
    <div className="feedback-list">
      <h3 className="feedback-list-title">
        {isManager ? "Recent Team Feedback" : "Your Feedback Timeline"}
      </h3>

      {isLoading && feedbackList.length === 0 ? (
        <div className="loading-state">Loading feedback...</div>
      ) : (
        <>
          <div className="feedback-cards">
            {feedbackList.map((feedback) => (
              <FeedbackCard
                key={feedback._id}
                feedback={feedback}
                isManager={isManager}
                onUpdate={onUpdate}
                employee={team.find(
                  (employee) => employee._id == feedback.employee_id
                )}
              />
            ))}
          </div>

          {hasMore && (
            <div className="load-more-container">
              {loadingMore ? (
                <div className="loading-state">Loading more feedback...</div>
              ) : (
                <button className="load-more-btn" onClick={handleLoadMore}>
                  Load More Feedback
                </button>
              )}
            </div>
          )}

          {!hasMore && feedbackList.length > 0 && (
            <div className="end-message">
              You've reached the end of the feedback list.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FeedbackList;
