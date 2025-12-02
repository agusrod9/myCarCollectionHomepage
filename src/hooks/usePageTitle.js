import { useEffect } from "react";

export default function usePageTitle(pageTitle) {
    useEffect(() => {
        const appName = "The DieCaster"; 
        document.title = `${appName} - ${pageTitle}`;
    }, [pageTitle]);
}