import Fuse from 'fuse.js';

import { UIDataColumn } from './useUIDataColumn';
import useTagConfig from './useTagConfig';
import useTags from 'features/tags/hooks/useTags';
import { CellData, TagColumn } from '../utils/types';

const useGuessTags = (orgId: number, uiDataColumn: UIDataColumn<TagColumn>) => {
  const tags = useTags(orgId);
  const { assignTags } = useTagConfig(
    orgId,
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );
  const fuse = new Fuse(tags.data || [], {
    includeScore: true,
    keys: ['title'],
  });

  const guessTags = () => {
    // Loop through each possible cell value
    const matchedRows = uiDataColumn.uniqueValues.reduce(
      (acc: TagColumn['mapping'], cellValue: CellData) => {
        if (typeof cellValue === 'string') {
          // Find tags with most similar name
          const results = fuse.search(cellValue);
          // Filter out items with a bad match
          const goodResults = results.filter(
            (result) => result.score && result.score < 0.25
          );
          // If there is a match, guess it
          if (goodResults.length > 0) {
            return [
              ...acc,
              {
                tags: [{ id: goodResults[0].item.id }],
                value: cellValue,
              },
            ];
          }
        }
        return acc;
      },
      []
    );

    assignTags(matchedRows);
  };

  return guessTags;
};

export default useGuessTags;
