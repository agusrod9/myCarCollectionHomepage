import { useEffect, useState } from "react";

const API_BASEURL = import.meta.env.VITE_API_BASEURL;

export default function useOnlineUsersCount(intervalMs = 60000) {
    const [onlineCount, setOnlineCount] = useState(0);

    useEffect(() => {
        async function fetchCount() {
            try {
                const res = await fetch(`${API_BASEURL}/api/users/onlineUserCount`);
                const data = await res.json();
                setOnlineCount(data.data || 0);
            } catch (err) {
                setOnlineCount(0);
            }
        }
        fetchCount();
        const interval = setInterval(fetchCount, intervalMs);

        return () => clearInterval(interval);
    }, [intervalMs]);

    return onlineCount;
}