import { useEffect } from "react";

export default function usePageTitle(pageTitle) {
    useEffect(() => {
        const appName = "TDC"; 
        document.title = `${appName} | ${pageTitle}`;
    }, [pageTitle]);
}