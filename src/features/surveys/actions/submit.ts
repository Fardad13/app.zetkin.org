'use server';

import { headers } from 'next/headers';

import BackendApiClient from 'core/api/client/BackendApiClient';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import { ZetkinSurveyFormStatus, ZetkinUser } from 'utils/types/zetkin';

export async function submit(
  prevState: ZetkinSurveyFormStatus,
  formData: FormData
): Promise<ZetkinSurveyFormStatus> {
  const headersList = headers();
  const headersEntries = headersList.entries();
  const headersObject = Object.fromEntries(headersEntries);
  const apiClient = new BackendApiClient(headersObject);

  let user: ZetkinUser | null;
  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    user = null;
  }

  const { orgId, surveyId } = Object.fromEntries([...formData.entries()]);
  const submission = prepareSurveyApiSubmission(formData, !!user);
  try {
    await apiClient.post(
      `/api/orgs/${orgId}/surveys/${surveyId}/submissions`,
      submission
    );
  } catch (e) {
    return 'error';
  }
  return 'submitted';
}
