import getNewEventTimes from '../utils/getNewEventTimes';
import updateEvents from '../rpc/updateEvents';
import { ZetkinEvent } from 'utils/types/zetkin';
import { eventsUpdate, eventsUpdated, resetSelection } from '../store';
import {
  useApiClient,
  useAppDispatch,
  useNumericRouteParams,
} from 'core/hooks';

export default function useMoveEvents() {
  const { orgId } = useNumericRouteParams();
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const moveEvents = async (events: ZetkinEvent[], offset: number) => {
    const eventsWithNewDates = events.map((event) => {
      const { newStartTime, newEndTime } = getNewEventTimes(event, offset);

      return {
        end_time: newEndTime.toISOString(),
        id: event.id,
        start_time: newStartTime.toISOString(),
      };
    });

    dispatch(
      eventsUpdate([events.map((e) => e.id), ['start_time', 'end_time']])
    );
    const updatedEvents = await apiClient.rpc(updateEvents, {
      events: eventsWithNewDates,
      orgId: orgId.toString(),
    });
    dispatch(eventsUpdated(updatedEvents));
    dispatch(resetSelection());
  };

  return {
    moveEvents,
  };
}
