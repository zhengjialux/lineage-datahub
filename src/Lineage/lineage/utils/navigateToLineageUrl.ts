import * as QueryString from 'query-string';
import { SEPARATE_SIBLINGS_URL_PARAM } from '../../entity/shared/siblingUtils';
import { SHOW_COLUMNS_URL_PARAMS } from './useIsShowColumnsMode';

export const navigateToLineageUrl = ({
    isLineageMode,
    isHideSiblingMode,
    showColumns,
    startTimeMillis,
    endTimeMillis,
}: {
    isLineageMode: boolean;
    isHideSiblingMode?: boolean;
    showColumns?: boolean;
    startTimeMillis?: number;
    endTimeMillis?: number;
}) => {
    const parsedSearch = QueryString.parse(window.location.search, { arrayFormat: 'comma' });
    let newSearch: any = {
        ...parsedSearch,
        is_lineage_mode: isLineageMode,
        start_time_millis: startTimeMillis || null,
        end_time_millis: endTimeMillis || null,
    };
    
    if (isHideSiblingMode !== undefined) {
        newSearch[SEPARATE_SIBLINGS_URL_PARAM] = isHideSiblingMode;
    }
    if (showColumns !== undefined) {
        newSearch[SHOW_COLUMNS_URL_PARAMS] = showColumns;
    }
    
    const newSearchString = QueryString.stringify(newSearch, { arrayFormat: 'comma' });
    window.history.replaceState(null, '', `${window.location.pathname}?${newSearchString}`);
};