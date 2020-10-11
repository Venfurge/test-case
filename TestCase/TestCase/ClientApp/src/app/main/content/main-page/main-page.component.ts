import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  public isDeviceSm: boolean;

  private _unsubscribe: Subject<any>;

  constructor(
    public mediaObserver: MediaObserver,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnInit(): void {
    this.mediaObserver.media$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((res: MediaChange) => {
        if (res.mqAlias == 'xs' || res.mqAlias == 'sm')
          this.isDeviceSm = true;
        else
          this.isDeviceSm = false;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }
}
