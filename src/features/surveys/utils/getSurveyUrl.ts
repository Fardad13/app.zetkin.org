import { ZetkinSurvey } from 'utils/types/zetkin';

export default function getSurveyUrl(
  survey: ZetkinSurvey | null,
  orgId: number
) {
  if (survey) {
    const campId = getSurveyCampId(survey, orgId);
    return `/organize/${orgId}/projects/${campId}/surveys/${survey.id}`;
  } else {
    return '';
  }
}

export function getSurveyCampId(survey: ZetkinSurvey | null, orgId: number) {
  if (survey) {
    if (survey.organization.id !== orgId) {
      return 'shared';
    }
    return survey.campaign?.id ?? 'standalone';
  } else {
    return '';
  }
}
