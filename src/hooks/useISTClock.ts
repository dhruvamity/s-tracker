import { useState, useEffect } from 'react';
import { getISTDate, formatFriendlyDate } from '../utils/dateUtils';
import { getLiveLectureStatus } from '../utils/attendanceMath';
import { LiveLectureStatus } from '../types/attendance';

export function useISTClock() {
  const [nowIST, setNowIST] = useState<Date>(() => getISTDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowIST(getISTDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = nowIST.getHours();
  const greeting = hours < 5
    ? 'Still up'
    : hours < 12
    ? 'Good morning'
    : hours < 17
    ? 'Good afternoon'
    : 'Good evening';

  const istClockFormatted = `${nowIST.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} IST`;
  const istDateFormatted = formatFriendlyDate(nowIST);

  const liveStatus: LiveLectureStatus = getLiveLectureStatus(nowIST);

  return {
    nowIST,
    greeting,
    istClockFormatted,
    istDateFormatted,
    liveStatus
  };
}
