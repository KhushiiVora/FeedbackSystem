import { request } from "./utils";

export async function getDashboardStats(offset = 0, limit = 5) {
  return request(`/api/dashboard?offset=${offset}&limit=${limit}`);
}

export async function acknowledgeFeedback(feedbackId) {
  return request(`/api/feedback/${feedbackId}/acknowledge`, {
    method: "PUT",
  });
}

export async function updateFeedback(feedbackId, feedbackData) {
  return request(`/api/feedback/${feedbackId}`, {
    method: "PUT",
    body: JSON.stringify(feedbackData),
  });
}

export async function createFeedback(feedbackData) {
  return request(`/api/feedback/`, {
    method: "POST",
    body: JSON.stringify(feedbackData),
  });
}
