import {
  createTask,
  listTasksByArtistProfileId,
  listUpcomingTasksByArtistProfileId
} from "@/db/queries/tasks";
import {
  normalizeTaskInput,
  taskFormSchema,
  type TaskFormValues
} from "@/lib/validations/tasks";
import { requireArtistProfileForUser } from "@/services/artist-profiles-service";

export async function getTasksForUser(userId: string) {
  const artistProfile = await requireArtistProfileForUser(userId);
  return listTasksByArtistProfileId(artistProfile.id);
}

export async function getUpcomingTasksForUser(userId: string, limit = 5) {
  const artistProfile = await requireArtistProfileForUser(userId);
  return listUpcomingTasksByArtistProfileId(artistProfile.id, limit);
}

export async function createTaskForUser(userId: string, values: TaskFormValues) {
  const parsed = taskFormSchema.parse(values);
  const artistProfile = await requireArtistProfileForUser(userId);
  return createTask(artistProfile.id, normalizeTaskInput(parsed));
}
