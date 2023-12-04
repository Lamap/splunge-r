import { useEffect, useRef, useState } from 'react';
import { requestLivelinessCheck } from '../services/services';
const livelinessMin: number = 13 * 60 * 1000;
const livelinessMax: number = 14 * 60 * 1000;
export function useLivelinessHook(): void {
    const [pingId, setPingId] = useState<number>(0);
    const pingIdRef: React.MutableRefObject<number> = useRef(pingId);

    useEffect(() => {
        pingIdRef.current = pingId;
    }, [pingId]);
    useEffect(() => {
        setPing();
        return (): void => {
            clearTimeout(pingIdRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    function setPing(): void {
        const delay: number = Math.round(Math.random() * (livelinessMax - livelinessMin) + livelinessMin);
        requestLivelinessCheck();
        clearTimeout(pingIdRef.current);
        const id: number = window.setTimeout((): void => {
            setPing();
        }, delay);
        setPingId(id);
    }
}
