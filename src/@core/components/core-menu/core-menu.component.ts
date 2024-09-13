import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;

  @Input()
  layout = 'vertical';

  @Input()
  menu: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {CoreMenuService} _coreMenuService
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _coreMenuService: CoreMenuService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the menu either from the input or from the service
    this.menu = this.menu || this._coreMenuService.getCurrentMenu();

    // Subscribe to the current menu changes
    this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.currentUser = this._coreMenuService.currentUser;

      // Load menu
      this.menu = this._coreMenuService.getCurrentMenu();
      let vendoradmin = JSON.parse(localStorage.getItem('currentUser'))

      console.log(vendoradmin)
      if (vendoradmin.roleObj.roleName == "VENDOR_ADMIN") {

        let Obj = this.menu.filter(t => t.visibility == "VENDOR")
        this.menu = []
        this.menu = Obj
        console.log(this.menu, "2")
      }
      
      this.menu = this._coreMenuService.getCurrentMenu();
      let adminUser = JSON.parse(localStorage.getItem('currentUser'))
      if (adminUser.roleObj.roleName == "USER") {

        let Obj = this.menu.filter(t => t.visibility == "ADMINUSER")
        this.menu = []
        this.menu = Obj
        console.log(this.menu, "2")
      }
      this._changeDetectorRef.markForCheck();
    });
  }
}
