import moment from "moment";

export default class DateHelper {
  static toDateWithFormat(date: string, formatFrom?: string, formatTo?: string) {
    return moment(date, formatFrom ?? "DD/MM/YYYY").format(formatTo ?? "DD/MM/YYYY");
  }
}