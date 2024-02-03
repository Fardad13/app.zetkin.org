import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTask } from '../components/types';
import { taskLoad, taskLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useTask(
  orgId: number,
  taskId: number
): ZetkinTask | null {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks);

  const item = tasks.tasksList.items.find((item) => item.id === taskId);

  const taskFuture = loadItemIfNecessary(item, dispatch, {
    actionOnLoad: () => taskLoad(taskId),
    actionOnSuccess: (data) => taskLoaded(data),
    loader: () =>
      apiClient.get<ZetkinTask>(`/api/orgs/${orgId}/tasks/${taskId}`),
  });
  return taskFuture.data;
}
