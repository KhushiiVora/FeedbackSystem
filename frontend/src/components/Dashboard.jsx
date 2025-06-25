import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  Smile,
  Frown,
} from "lucide-react";

import StatsCard from "./dashboard/StatsCard";
import SentimentChart from "./dashboard/SentimentChart";
import FeedbackList from "./dashboard/FeedbackList";
import EditFeedbackModal from "./dashboard/EditFeedbackModal";
import CreateFeedbackModal from "./dashboard/CreateFeedbackModal";
import TeamView from "./dashboard/TeamView";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { ToastContainer } from "react-toastify";
import "../styles/dashboard.css";
import {
  getDashboardStats,
  acknowledgeFeedback,
  updateFeedback,
  createFeedback,
} from "../api/dashboard";

function Dashboard() {
  const navigate = useNavigate();
  const userRef = useRef(JSON.parse(localStorage.getItem("user")));

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [feedbackOffset, setFeedbackOffset] = useState(0);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [team, setTeam] = useState([]);
  const FEEDBACK_LIMIT = 5;

  const loadDashboardData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await getDashboardStats(0, FEEDBACK_LIMIT);
      setDashboardData(data);
      setFeedbackOffset(data.recent_feedback.length);
      setHasMore(data.recent_feedback.length === FEEDBACK_LIMIT);
    } catch (error) {
      if (error.message === "401") {
        navigate("/login");
      }
      showErrorToast("Error loading dashboard data");
      console.error("Error loading dashboard data:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  const handleLoadMore = useCallback(async () => {
    try {
      const moreData = await getDashboardStats(feedbackOffset, FEEDBACK_LIMIT);
      if (moreData.recent_feedback.length === 0) {
        setHasMore(false);
        return;
      }
      setDashboardData((prev) => ({
        ...prev,
        recent_feedback: [...prev.recent_feedback, ...moreData.recent_feedback],
      }));
      setFeedbackOffset((prev) => prev + moreData.recent_feedback.length);
      setHasMore(moreData.recent_feedback.length === FEEDBACK_LIMIT);
    } catch (error) {
      showErrorToast("Error loading more feedback");
      console.error("Error loading more feedback:", error);
    }
  }, [feedbackOffset]);

  const handleAcknowledge = useCallback(async (feedbackId) => {
    try {
      const updatedFeedback = await acknowledgeFeedback(feedbackId);
      setDashboardData((prev) => ({
        ...prev,
        recent_feedback: prev.recent_feedback.map((feedback) =>
          feedback.id === feedbackId ? updatedFeedback : feedback
        ),
      }));
      showSuccessToast("Feedback acknowledged!");
      loadDashboardData(false);
    } catch (error) {
      showErrorToast("Error acknowledging feedback");
      console.error("Error acknowledging feedback:", error);
    }
  }, []);

  const handleUpdateFeedback = async (feedbackId, feedbackData) => {
    try {
      const updatedFeedback = await updateFeedback(feedbackId, feedbackData);
      setDashboardData((prev) => ({
        ...prev,
        recent_feedback: prev.recent_feedback.map((feedback) =>
          feedback.id === feedbackId ? updatedFeedback : feedback
        ),
      }));
      showSuccessToast("Feedback updated successfully!");
      setEditingFeedback(null);
      loadDashboardData(false);
    } catch (error) {
      showErrorToast("Error updating feedback");
      console.error("Error updating feedback:", error);
    }
  };

  const handleEdit = useCallback((feedback) => {
    setEditingFeedback(feedback);
  }, []);

  const handleOpenCreateModal = (employee) => {
    setSelectedEmployee(employee);
    setCreateModalOpen(true);
  };

  const handleCreateFeedback = async (employeeId, feedbackData) => {
    try {
      await createFeedback({ ...feedbackData, employee_id: employeeId });
      showSuccessToast("Feedback submitted successfully!");
      setCreateModalOpen(false);
      setSelectedEmployee(null);
      loadDashboardData(false); // Reload data without full loading screen
    } catch (error) {
      showErrorToast("Failed to submit feedback.");
      console.log(error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const renderEmptyState = () => {
    if (userRef.current.role === "manager") {
      return (
        <div className="empty-state card">
          <Smile size={48} />
          <h3>No Feedback Given Yet</h3>
          <p>Start by giving feedback to one of your team members.</p>
        </div>
      );
    }
    return (
      <div className="empty-state card">
        <Frown size={48} />
        <h3>No Feedback Received Yet</h3>
        <p>You have not received any feedback. Keep up the great work!</p>
      </div>
    );
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="error-container">
        <p>Error loading dashboard data. Please try again.</p>
        <button onClick={loadDashboardData} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          {userRef.current.role === "manager"
            ? "Manager Dashboard"
            : "Your Feedback Dashboard"}
        </h1>
        <p className="dashboard-subtitle">
          {userRef.current.role === "manager"
            ? "Team Overview & Feedback Management"
            : "Track your progress and development"}
        </p>
      </div>

      {dashboardData.total_feedback > 0 && (
        <>
          <div className="stats-grid">
            <StatsCard
              title="Total Feedback"
              value={dashboardData.total_feedback}
              icon={MessageSquare}
              className="stats-primary"
            />
            {userRef.current.role === "manager" ? (
              <StatsCard
                title="Team Members"
                value={team.length}
                icon={Users}
                className="stats-secondary"
              />
            ) : (
              <StatsCard
                title="Unacknowledged"
                value={
                  dashboardData.recent_feedback.filter((f) => !f.acknowledged)
                    .length
                }
                icon={Eye}
                className="stats-warning"
              />
            )}

            <StatsCard
              title={`Positive ${
                userRef.current.role === "manager" ? "Feedback" : "Reviews"
              }`}
              value={dashboardData.sentiment_breakdown.positive}
              icon={TrendingUp}
              className="stats-success"
            />
          </div>

          <div className="charts-grid">
            <SentimentChart
              data={dashboardData.sentiment_breakdown}
              type="bar"
            />
            <SentimentChart
              data={dashboardData.sentiment_breakdown}
              type="pie"
            />
          </div>
        </>
      )}

      {userRef.current.role === "manager" && (
        <TeamView
          onGiveFeedback={handleOpenCreateModal}
          setTeamInDashboard={setTeam}
        />
      )}

      {dashboardData.total_feedback > 0 ? (
        <FeedbackList
          feedbackList={dashboardData.recent_feedback}
          isManager={userRef.current.role === "manager"}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          onUpdate={
            userRef.current.role === "manager" ? handleEdit : handleAcknowledge
          }
          team={team}
        />
      ) : (
        renderEmptyState()
      )}

      {editingFeedback && (
        <EditFeedbackModal
          open={!!editingFeedback}
          onClose={() => setEditingFeedback(null)}
          feedback={editingFeedback}
          onUpdate={handleUpdateFeedback}
          employeeName={
            team.find((employee) => employee._id == editingFeedback.employee_id)
              .name
          }
        />
      )}
      <CreateFeedbackModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        employee={selectedEmployee}
        onSubmit={handleCreateFeedback}
      />
      <ToastContainer />
    </div>
  );
}
export default Dashboard;
