import {useEffect} from "react";
import {useReactive} from "ahooks";

function roundDate() {
    const now = new Date();
    now.setSeconds(Math.floor(now.getSeconds() / 30) * 30, 0);
    return now;
}

export const useDate = (interval = 10000) => {
    const dates = useReactive({
        now: roundDate(),
        startOfTheDay: new Date(roundDate().setHours(0, 0, 0, 0)),
        endOfTheDay: new Date(roundDate().setHours(23, 59, 59, 999)),
    });

    useEffect(() => {
        const id = setInterval(() => {
            dates.now = roundDate();
            dates.startOfTheDay = new Date(roundDate().setHours(0, 0, 0, 0));
            dates.endOfTheDay = new Date(roundDate().setHours(23, 59, 59, 999));
        }, interval);

        return () => clearInterval(id);
    }, [interval, dates])

    return dates;
}