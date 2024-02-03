import { Box } from '@mui/material';

import DateLabel from './DateLabel';
import { DaySummary } from '../../utils';
import Event from './Event';

const Day = ({ date, dayInfo }: { date: Date; dayInfo: DaySummary }) => {
  return (
    <Box
      alignItems="flex-start"
      display="flex"
      flexDirection="row"
      gap={4}
      padding={1}
      sx={{
        backgroundColor: '#eeeeee',
      }}
    >
      <Box display="flex" width={'200px'}>
        <DateLabel date={date} />
      </Box>
      {/* Remaining space for list of events */}
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        gap={1}
        justifyItems="flex-start"
      >
        {dayInfo.events.map((event, index) => {
          return <Event key={index} event={event.data} />;
        })}
      </Box>
    </Box>
  );
};

export default Day;
