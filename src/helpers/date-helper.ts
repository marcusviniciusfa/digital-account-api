export class DateHelper {
  static localToUTC(date: Date = new Date()): Date {
    const year = date.getFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();

    return new Date(year, month, day, hours, minutes, seconds, milliseconds);
  }

  static startOfDayUTC(date: Date = new Date()): Date {
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  static endOfDayUTC(date: Date = new Date()): Date {
    date.setUTCHours(23, 59, 59, 999);
    return date;
  }
}
