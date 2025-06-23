import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from './analytics';

// Note: we explicitly keep this outside of React state management.
let prevPathname: string = document.referrer;

/**
 * Hook used for logging page view events.
 */
export const useTrackPageView = () => {
    const location = window.location

    return useEffect(() => {
        analytics.page({ prevPathname });
        prevPathname = location.pathname;
    }, [location]);
};
