import { FC, useContext } from 'react';
import { Badge } from '@mui/material';
import { FilterList } from '@mui/icons-material';

import { areaFilterContext } from 'features/areas/components/AreaFilters/AreaFilterContext';
import { assigneesFilterContext } from './AssigneeFilterContext';

const OrganizerMapFilterBadge: FC = () => {
  const { activeTagIdsByGroup } = useContext(areaFilterContext);
  const { assigneesFilter } = useContext(assigneesFilterContext);

  const numActiveGroups = Object.values(activeTagIdsByGroup).filter(
    (tagIds) => !!tagIds.length
  ).length;

  const numTotalFilters = assigneesFilter
    ? numActiveGroups + 1
    : numActiveGroups;

  return numTotalFilters > 0 ? (
    <Badge
      badgeContent={numTotalFilters}
      sx={(theme) => ({
        '& .MuiBadge-badge': {
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        },
      })}
    >
      <FilterList />
    </Badge>
  ) : (
    <FilterList />
  );
};
export default OrganizerMapFilterBadge;
