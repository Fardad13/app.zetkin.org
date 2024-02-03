import { useAppSelector } from 'core/hooks';
import useFolder from './useFolder';
import useViewMutations from './useViewMutations';

interface UseViewBrowserMutationsReturn {
  itemIsRenaming: (type: 'folder' | 'view', id: number) => boolean;
  moveItem: (
    type: 'folder' | 'view',
    id: number,
    newParentId: number | null
  ) => void;
  renameItem: (type: 'folder' | 'view', id: number, title: string) => void;
}

export default function useViewBrowserMutations(
  orgId: number
): UseViewBrowserMutationsReturn {
  const views = useAppSelector((state) => state.views);
  const { updateFolder } = useFolder(orgId);
  const { updateView } = useViewMutations(orgId);

  const itemIsRenaming = (type: 'folder' | 'view', id: number): boolean => {
    if (type == 'folder') {
      const item = views.folderList.items.find((item) => item.id == id);
      return item?.mutating.includes('title') ?? false;
    } else if (type == 'view') {
      const item = views.viewList.items.find((item) => item.id == id);
      return item?.mutating.includes('title') ?? false;
    } else {
      return false;
    }
  };
  const moveItem = (
    type: 'folder' | 'view',
    id: number,
    newParentId: number | null
  ) => {
    if (type == 'folder') {
      updateFolder(orgId, id, { parent_id: newParentId });
    } else if (type == 'view') {
      updateView(id, { folder_id: newParentId });
    }
  };

  const renameItem = (type: 'folder' | 'view', id: number, title: string) => {
    if (type == 'folder') {
      updateFolder(orgId, id, { title });
    } else if (type == 'view') {
      updateView(id, { title });
    }
  };

  return { itemIsRenaming, moveItem, renameItem };
}
