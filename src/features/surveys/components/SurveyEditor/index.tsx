import { Box } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';

import AddBlocks from './AddBlocks';
import BlockWrapper from './blocks/BlockWrapper';
import ChoiceQuestionBlock from './blocks/ChoiceQuestionBlock';
import OpenQuestionBlock from './blocks/OpenQuestionBlock';
import TextBlock from './blocks/TextBlock';
import useSurveyElements from 'features/surveys/hooks/useSurveyElements';
import useSurveyMutations from 'features/surveys/hooks/useSurveyMutations';
import ZUIFuture from 'zui/ZUIFuture';
import ZUIReorderable from 'zui/ZUIReorderable';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyOptionsQuestionElement,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';

interface SurveyEditorProps {
  orgId: number;
  surveyId: number;
  readOnly: boolean;
}

const SurveyEditor: FC<SurveyEditorProps> = ({ orgId, readOnly, surveyId }) => {
  const [idOfBlockInEditMode, setIdOfBlockInEditMode] = useState<
    number | undefined
  >();

  const lengthRef = useRef<number>();
  const elementsFuture = useSurveyElements(orgId, surveyId);
  const { updateElementOrder } = useSurveyMutations(orgId, surveyId);

  useEffect(() => {
    const elements = elementsFuture.data;
    if (elements) {
      // If the previous length is null, it's because it only now loaded for the
      // first time and the length has not really been read before.
      if (
        lengthRef.current !== undefined &&
        lengthRef.current < elements.length
      ) {
        const lastElement = elements[elements.length - 1];
        setIdOfBlockInEditMode(lastElement.id);
      }

      lengthRef.current = elements.length;
    }
  }, [elementsFuture.data]);

  return (
    <>
      <ZUIFuture future={elementsFuture}>
        {(elements) => {
          return (
            <Box paddingBottom={elements.length ? 4 : 0}>
              <ZUIReorderable
                disableClick={readOnly}
                disableDrag={readOnly}
                items={elements.map((elem) => ({
                  id: elem.id,
                  renderContent: ({ dragging }) => {
                    if (elem.type == ELEMENT_TYPE.QUESTION) {
                      if (elem.question.response_type == RESPONSE_TYPE.TEXT) {
                        return (
                          <BlockWrapper
                            key={elem.id}
                            dragging={dragging}
                            hidden={elem.hidden}
                          >
                            <OpenQuestionBlock
                              editable={elem.id == idOfBlockInEditMode}
                              element={elem as ZetkinSurveyTextQuestionElement}
                              onEditModeEnter={() =>
                                setIdOfBlockInEditMode(elem.id)
                              }
                              onEditModeExit={() => {
                                setIdOfBlockInEditMode(undefined);
                              }}
                              orgId={orgId}
                              readOnly={readOnly}
                              surveyId={surveyId}
                            />
                          </BlockWrapper>
                        );
                      } else if (
                        elem.question.response_type == RESPONSE_TYPE.OPTIONS
                      ) {
                        return (
                          <BlockWrapper
                            key={elem.id}
                            dragging={dragging}
                            hidden={elem.hidden}
                          >
                            <ChoiceQuestionBlock
                              editable={elem.id == idOfBlockInEditMode}
                              element={
                                elem as ZetkinSurveyOptionsQuestionElement
                              }
                              onEditModeEnter={() => {
                                setIdOfBlockInEditMode(elem.id);
                              }}
                              onEditModeExit={() => {
                                setIdOfBlockInEditMode(undefined);
                              }}
                              orgId={orgId}
                              readOnly={readOnly}
                              surveyId={surveyId}
                            />
                          </BlockWrapper>
                        );
                      }
                    } else if (elem.type == ELEMENT_TYPE.TEXT) {
                      return (
                        <BlockWrapper
                          key={elem.id}
                          dragging={dragging}
                          hidden={elem.hidden}
                        >
                          <TextBlock
                            editable={elem.id == idOfBlockInEditMode}
                            element={elem}
                            onEditModeEnter={() =>
                              setIdOfBlockInEditMode(elem.id)
                            }
                            onEditModeExit={() => {
                              setIdOfBlockInEditMode(undefined);
                            }}
                            orgId={orgId}
                            readOnly={readOnly}
                            surveyId={surveyId}
                          />
                        </BlockWrapper>
                      );
                    }

                    // Only required to satisfy typescript. Should never happen.
                    return null;
                  },
                }))}
                onReorder={(ids) => {
                  updateElementOrder(ids);
                }}
              />
            </Box>
          );
        }}
      </ZUIFuture>
      {!readOnly && <AddBlocks orgId={orgId} surveyId={surveyId} />}
    </>
  );
};

export default SurveyEditor;
