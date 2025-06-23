import * as QueryString from 'query-string';
import { useLocation } from 'react-router-dom';

export default function useIsLineageMode() {
    const location = window.location
    const params = QueryString.parse(location.search, { arrayFormat: 'comma' });

    return params.is_lineage_mode === 'true';
}
