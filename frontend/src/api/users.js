import { request } from "./utils";

export async function getTeam() {
  // add await if needed
  return request(`/api/users/team`);
}
