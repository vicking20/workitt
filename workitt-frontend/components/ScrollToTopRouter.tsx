import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopRouter = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Immediate scroll
        window.scrollTo(0, 0);

        // Fallback for some browsers/situations where restoration happens after
        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
};

export default ScrollToTopRouter;