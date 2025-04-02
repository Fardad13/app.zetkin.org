import { useApiClient } from 'core/hooks';
import { ZetkinLanguage } from '../components/SettingsList';

export default function useUserMutations() {
  const apiClient = useApiClient();

  const changeUserLanguage = async (lang: ZetkinLanguage) => {
    await apiClient.patch(`/api/users/me`, { lang });
  };

  return { changeUserLanguage };
}
