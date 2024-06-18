import { ZetkinPerson } from 'utils/types/zetkin';
import {
  duplicateMerged,
  duplicateUpdated,
  PotentialDuplicate,
} from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type DuplicatesMutationsReturn = {
  dismissDuplicate: (duplicateId: number) => void;
  mergeDuplicate: (
    potentialDuplicateId: number,
    duplicatesIds: number[],
    override: Partial<ZetkinPerson>
  ) => void;
};

export default function useDuplicatesMutations(
  orgId: number
): DuplicatesMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  type PotentialDuplicatePatchBody = {
    dismissed?: boolean;
  };

  type MergePostBody = {
    objects: number[];
    override: Partial<ZetkinPerson>;
    type: 'person';
  };

  const dismissDuplicate = async (duplicateId: number) => {
    await apiClient
      .patch<PotentialDuplicate, PotentialDuplicatePatchBody>(
        `/api/orgs/${orgId}/people/duplicates/${duplicateId}`,
        { dismissed: true }
      )
      .then((duplicate) => {
        dispatch(duplicateUpdated(duplicate));
      });
  };

  const mergeDuplicate = async (
    potentialDuplicateId: number,
    duplicatesIds: number[],
    override: Partial<ZetkinPerson>
  ) => {
    await apiClient
      .post<ZetkinPerson, MergePostBody>(`/api/orgs/${orgId}/merges`, {
        objects: duplicatesIds,
        override,
        type: 'person',
      })
      .then(() => {
        dispatch(duplicateMerged(potentialDuplicateId));
      });
  };

  return {
    dismissDuplicate,
    mergeDuplicate,
  };
}
