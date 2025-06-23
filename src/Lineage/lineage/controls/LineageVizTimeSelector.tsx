import React from 'react';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router';
import { navigateToLineageUrl } from '../utils/navigateToLineageUrl';
import analytics, { EventType } from '../../analytics';
import { getTimeFromNow } from '../../shared/timeUtils';
import LineageTimeSelector from '../LineageTimeSelector';
import { useGetLineageTimeParams } from '../utils/useGetLineageTimeParams';

type Props = {
    isHideSiblingMode: boolean;
    showColumns: boolean;
};

export default function LineageVizTimeSelector({ isHideSiblingMode, showColumns }: Props) {
    const history = useHistory();
    const location = window.location
    const { startTimeMillis, endTimeMillis } = useGetLineageTimeParams();

    const lineageTimeSelectorOnChange = (dates, _dateStrings) => {
        if (dates) {
            const [start, end] = dates;
            const startTimeMillisValue = start?.valueOf();
            const endTimeMillisValue = end?.valueOf();
            const relativeStartDate = getTimeFromNow(startTimeMillisValue);
            const relativeEndDate = getTimeFromNow(endTimeMillisValue);
            analytics.event({
                type: EventType.LineageGraphTimeRangeSelectionEvent,
                relativeStartDate,
                relativeEndDate,
            });

            navigateToLineageUrl({
                location,
                history,
                isHideSiblingMode,
                showColumns,
                startTimeMillis: startTimeMillisValue,
                endTimeMillis: endTimeMillisValue,
            });
        }
    };

    const initialDates: [moment.Moment | null, moment.Moment | null] = [
        startTimeMillis ? moment(startTimeMillis) : null,
        endTimeMillis ? moment(endTimeMillis) : null,
    ];

    return <LineageTimeSelector onChange={lineageTimeSelectorOnChange} initialDates={initialDates} />;
}
