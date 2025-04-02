'use client';

import { Box } from '@mui/material';
import { FC, Suspense } from 'react';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import SettingsList from '../components/SettingsList';
import useCurrentUser from 'features/user/hooks/useCurrentUser';

const AllEventsPage: FC = () => {
  const user = useCurrentUser();

  return (
    <Suspense
      fallback={
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          height="90dvh"
          justifyContent="center"
        >
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
      {user && <SettingsList user={user} />}
    </Suspense>
  );
};

export default AllEventsPage;
