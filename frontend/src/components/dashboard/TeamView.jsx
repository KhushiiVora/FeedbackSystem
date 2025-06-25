import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";

import { getTeam } from "../../api/users";
import { showErrorToast } from "../../utils/toastUtils";
import "../../styles/team-view.css";

function TeamView({ onGiveFeedback, setTeamInDashboard }) {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const teamData = await getTeam();
        setTeam(teamData);
        setTeamInDashboard(teamData);
      } catch (error) {
        showErrorToast("Failed to load team members.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeam();
  }, []);

  if (isLoading) {
    return <p>Loading team...</p>;
  }

  return (
    <div className="team-view-container card">
      <h3 className="card-header">Your Team</h3>
      {team.length === 0 ? (
        <p>You have no team members assigned.</p>
      ) : (
        <ul className="team-list">
          {team.map((member, index) => (
            <li key={member.id} className="team-list-item">
              <div className="member-info">
                <span className="member-name">{`${index + 1}. ${
                  member.name
                }`}</span>
                <span className="member-email">{member.email}</span>
              </div>
              <button
                className="feedback-btn"
                onClick={() => onGiveFeedback(member)}
              >
                <UserPlus size={14} /> <span> Give Feedback</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TeamView;
