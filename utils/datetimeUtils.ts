import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import calendar from "dayjs/plugin/calendar";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.extend(calendar);
dayjs.extend(relativeTime);

export const tz = "America/Toronto";

export const getAppointmentWindow = (
  startTime: number | string,
  endTime: number | string
): string => {
  const begin = dayjs(startTime).tz(tz).format("h:mm a");
  const end = dayjs(endTime).tz(tz).format("h:mm a");
  return `${begin} - ${end} ET`;
};

export const getTimeToNow = (
  startTime: number | string,
  withoutPrefix = true
): string => {
  return dayjs(startTime).tz(tz).fromNow(withoutPrefix);
};

export const isInPast = (startTime: number | string): boolean => {
  return dayjs(startTime).tz(tz).diff(dayjs().tz(tz), "s") < 0;
};

export const isInFuture = (time: number | string): boolean => {
  return dayjs(time).tz(tz).diff(dayjs().tz(tz), "s") > 0;
};

export const isNowInTimeslot = (
  startTime?: number | string,
  endTime?: number | string
): boolean => {
  if (!startTime || !endTime) {
    return false;
  }
  const started = isInPast(startTime);
  const ended = isInFuture(endTime);
  return started && !ended;
};

export const getTime = (startTime: number | string): string => {
  return dayjs(startTime).tz(tz).format("h:mm a");
};

export const getDate = (date: number | dayjs.Dayjs | string): string => {
  dayjs.updateLocale("en", {
    calendar: {
      lastDay: "[Yesterday], MM/DD",
      sameDay: "[Today], MM/DD",
      nextDay: "[Tomorrow], MM/DD",
      lastWeek: "dddd, MM/DD",
      nextWeek: "dddd, MM/DD",
      sameElse: "dddd, MM/DD",
    },
  });
  return dayjs(date).calendar();
};

export const getDayAgo = (): dayjs.Dayjs => {
  return dayjs().tz(tz).subtract(1, "day");
};

export const getWeekAgo = (): dayjs.Dayjs => {
  return dayjs().tz(tz).subtract(7, "day");
};

export const getMonthAgo = (): dayjs.Dayjs => {
  return dayjs().tz(tz).subtract(1, "month");
};
