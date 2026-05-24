import moment from "moment";

export default class DateHelper {
  static toDateWithFormat(date: string, formatFrom?: string, formatTo?: string) {
    return moment(date, formatFrom ?? "DD/MM/YYYY").format(formatTo ?? "DD/MM/YYYY");
  }

  static getDateDisplayText = (date: string) => {
    if (date === DateHelper.toDateWithFormat(moment().date().toString())) return "Today";
    else if (date === DateHelper.toDateWithFormat(moment().subtract(1, 'day').date().toString())) return "Yesterday";
    return date;
  }
}