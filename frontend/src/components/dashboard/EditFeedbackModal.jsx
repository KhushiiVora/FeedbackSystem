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
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "1rem",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

function EditFeedbackModal({
  open,
  onClose,
  feedback,
  onUpdate,
  employeeName,
}) {
  const [formData, setFormData] = useState({
    strengths: feedback.strengths,
    areas_to_improve: feedback.areas_to_improve,
    sentiment: feedback.sentiment,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(feedback._id, formData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6">Edit Feedback for {employeeName}</Typography>
        <TextField
          name="strengths"
          label="Strengths"
          value={formData.strengths}
          onChange={handleChange}
          multiline
          rows={3}
          required
        />
        <TextField
          name="areas_to_improve"
          label="Areas to Improve"
          value={formData.areas_to_improve}
          onChange={handleChange}
          multiline
          rows={3}
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
          <button type="submit" variant="contained">
            Save Changes
          </button>
        </div>
      </Box>
    </Modal>
  );
}

export default EditFeedbackModal;
