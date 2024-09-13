import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {

  constructor() { }
  dateObjToStr(dateObj) {
    return dateObj.day + '/' + dateObj.month + '/' + dateObj.year;
  }

  dateStrToObj(dateStr) {
    var date = dateStr.split('/');
    let date2 = new Date(date[1] + '-' + date[0] + ' ' + date[2]);
    // let date = new Date(dateStr.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
    let dateObj = { year: date2.getFullYear(), month: date2.getMonth() + 1, day: date2.getDate() };
    return dateObj;
  }
}
