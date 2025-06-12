import React from 'react';
import styled from 'styled-components/macro';

export const LINEAGE_GRAPH_TIME_FILTER_ID = 'lineage-graph-time-filter';
// import LineageVizTimeSelector from './LineageVizTimeSelector';
import { LineageVizToggles } from './LineageVizToggles';

const LeftControlsDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    gap: 30px;
    margin-left: 48px;
`;

const RightControlsDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 48px;
`;

type Props = {
    showExpandedTitles: boolean;
    setShowExpandedTitles: (showExpandedTitles: boolean) => void;
};

export function LineageVizControls({ showExpandedTitles, setShowExpandedTitles }: Props) {

    return (
        <>
            <LeftControlsDiv>
                <LineageVizToggles
                    showExpandedTitles={showExpandedTitles}
                    setShowExpandedTitles={setShowExpandedTitles}
                />
            </LeftControlsDiv>
            {/* <RightControlsDiv>
                <span id={LINEAGE_GRAPH_TIME_FILTER_ID}>
                    <LineageVizTimeSelector isHideSiblingMode={isHideSiblingMode} showColumns={showColumns} />
                </span>
            </RightControlsDiv> */}
        </>
    );
}
