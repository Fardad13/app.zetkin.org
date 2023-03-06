import { OpenInNew } from '@mui/icons-material';
import { Box, Card, Link, Typography, useTheme } from '@mui/material';

import { Msg } from 'core/i18n';
import ZUITextfieldToClipboard from 'zui/ZUITextfieldToClipboard';

import messageIds from '../l10n/messageIds';

interface SurveyURLCardProps {
  isOpen: boolean;
  orgId: string;
  surveyId: string;
}

const SurveyURLCard = ({ isOpen, orgId, surveyId }: SurveyURLCardProps) => {
  const theme = useTheme();
  return (
    <Card style={{ padding: 16 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">
          {isOpen ? (
            <Msg id={messageIds.urlCard.open} />
          ) : (
            <Msg id={messageIds.urlCard.preview} />
          )}
        </Typography>
        <Box
          sx={{
            backgroundColor: isOpen
              ? theme.palette.success.main
              : theme.palette.grey['500'],
            borderRadius: 5,
            height: 20,
            width: 20,
          }}
        />
      </Box>
      <Typography color="GrayText" paddingBottom={4} variant="body2">
        {isOpen ? (
          <Msg id={messageIds.urlCard.nowAccepting} />
        ) : (
          <Msg id={messageIds.urlCard.willAccept} />
        )}
      </Typography>
      <Box display="flex" flexDirection="row" paddingBottom={2}>
        <ZUITextfieldToClipboard
          copyText={`${process.env.NEXT_PUBLIC_ZETKIN_APP_DOMAIN}o/${orgId}/surveys/${surveyId}`}
        >
          {`${process.env.NEXT_PUBLIC_ZETKIN_APP_DOMAIN}o/${orgId}/surveys/${surveyId}`}
        </ZUITextfieldToClipboard>
      </Box>
      <Link
        display="flex"
        href={`/o/${orgId}/surveys/${surveyId}`}
        sx={{ alignItems: 'center', gap: 1 }}
        target="_blank"
      >
        <OpenInNew fontSize="inherit" />
        {isOpen ? (
          <Msg id={messageIds.urlCard.visitPortal} />
        ) : (
          <Msg id={messageIds.urlCard.previewPortal} />
        )}
      </Link>
    </Card>
  );
};

export default SurveyURLCard;
