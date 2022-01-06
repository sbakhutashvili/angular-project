import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export type Alert = 'success' | 'warning'

export interface alert {
  type: Alert,
  text: string
}

@Injectable()
export class AlertService {
  alert$: Subject<alert> = new Subject<alert>()

  success(text) {
    this.alert$.next({type: 'success', text})
  }
  warning(text) {
    this.alert$.next({type: 'warning', text})

  }
}
