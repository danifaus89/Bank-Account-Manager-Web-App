import { Pipe, PipeTransform } from '@angular/core';
import { CalendarLiterals } from '../models/calendar-literals.model';
import { TranslateService } from '@ngx-translate/core';
import calendar from '../i18n/calendarTranslate.json';



@Pipe({
  name: 'translateCalendar'
})

export class TranslateCalendarPipe implements PipeTransform {

  constructor(private translate: TranslateService) {
  }

  transform(): CalendarLiterals {

    const firstDayOfWeek: string = this.translate.instant(calendar.config.firstDayOfWeek + '');
    const dayNames: string = this.translate.instant(calendar.config.dayNames + '');
    const dayNamesShort: string = this.translate.instant(calendar.config.dayNamesShort + '');
    const dayNamesMin: string = this.translate.instant(calendar.config.dayNamesMin + '');
    const monthNames: string = this.translate.instant(calendar.config.monthNames + '');
    const monthNamesShort: string = this.translate.instant(calendar.config.monthNamesShort + '');
    const today: string = this.translate.instant(calendar.config.today + '');
    const clear: string = this.translate.instant(calendar.config.clear + '');

    const literals: CalendarLiterals = {
      firstDayOfWeek: +firstDayOfWeek,
      dayNames: dayNames.split('|'),
      dayNamesShort: dayNamesShort.split('|'),
      dayNamesMin: dayNamesMin.split('|'),
      monthNames: monthNames.split('|'),
      monthNamesShort: monthNamesShort.split('|'),
      today,
      clear
    };

    return literals;
  }
}
