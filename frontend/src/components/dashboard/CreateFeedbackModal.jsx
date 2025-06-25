import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "1rem",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

function CreateFeedbackModal({ open, onClose, employee, onSubmit }) {
  const [formData, setFormData] = useState({
    strengths: "",
    areas_to_improve: "",
    sentiment: "neutral",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(employee._id, formData);
  };

  if (!employee) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6">Give Feedback to {employee.name}</Typography>
        <TextField
          name="strengths"
          label="Strengths"
          value={formData.strengths}
          onChange={handleChange}
          multiline
          rows={4}
          required
        />
        <TextField
          name="areas_to_improve"
          label="Areas to Improve"
          value={formData.areas_to_improve}
          onChange={handleChange}
          multiline
          rows={4}
          required
        />
        <FormControl fullWidth>
          <InputLabel>Sentiment</InputLabel>
          <Select
            name="sentiment"
            value={formData.sentiment}
            label="Sentiment"
            onChange={handleChange}
          >
            <MenuItem value="positive">Positive</MenuItem>
            <MenuItem value="neutral">Neutral</MenuItem>
            <MenuItem value="negative">Negative</MenuItem>
          </Select>
        </FormControl>
        <div className="feedback-actions">
          <button className="cancle-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Submit Feedback</button>
        </div>
      </Box>
    </Modal>
  );
}

export default CreateFeedbackModal;
