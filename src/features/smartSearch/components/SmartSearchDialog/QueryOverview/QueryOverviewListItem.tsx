import { Delete, Edit } from '@mui/icons-material';
import { FC, ReactNode, useState } from 'react';
import { Grid, IconButton, ListItem, Typography } from '@mui/material';

import { FilterConfigOrgOptions } from '../../types';
import OrgScope from '../../OrgScope';
import { useNumericRouteParams } from 'core/hooks';

type RenderFunction = (hovered: boolean) => ReactNode;
type Renderable = ReactNode | RenderFunction;

type QueryOverviewListItemProps = {
  canDelete?: boolean;
  canEdit?: boolean;
  diagram?: Renderable;
  filterText?: Renderable;
  icon?: Renderable;
  onClickDelete?: () => void;
  onClickEdit?: () => void;
  organizations?: FilterConfigOrgOptions;
};

const QueryOverviewListItem: FC<QueryOverviewListItemProps> = ({
  canEdit,
  canDelete,
  diagram,
  filterText,
  icon,
  onClickDelete,
  onClickEdit,
  organizations,
}) => {
  const [hovered, setHovered] = useState(false);
  const { orgId } = useNumericRouteParams();

  const render = (renderable: Renderable): ReactNode => {
    if (typeof renderable == 'function') {
      return renderable(hovered);
    }
    return renderable;
  };

  return (
    <ListItem
      onMouseOut={() => setHovered(false)}
      onMouseOver={() => setHovered(true)}
      style={{ background: 'white', minHeight: 60, padding: 0 }}
    >
      <Grid
        alignItems="center"
        container
        display="flex"
        justifyContent="space-between"
        width={1}
      >
        <Grid display="flex" item xs={1}>
          {render(icon)}
        </Grid>
        <Grid item lg={8} py={2} xs={7}>
          {organizations && (
            <OrgScope organizations={organizations} orgId={orgId} />
          )}
          <Typography>{render(filterText)}</Typography>
        </Grid>
        <Grid alignSelf="stretch" item lg={2} px={3} xs={3}>
          {render(diagram)}
        </Grid>
        <Grid alignItems="center" display="flex" item xs={1}>
          {canEdit && (
            <IconButton
              data-testid="QueryOverview-editFilterButton"
              onClick={() => onClickEdit && onClickEdit()}
              size="small"
            >
              <Edit fontSize="small" />
            </IconButton>
          )}
          {canDelete && (
            <IconButton
              onClick={() => onClickDelete && onClickDelete()}
              size="small"
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default QueryOverviewListItem;
