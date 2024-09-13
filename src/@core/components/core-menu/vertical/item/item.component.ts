import { Component, Input } from '@angular/core';

import { CoreMenuItem } from '@core/types';

@Component({
  selector: '[core-menu-vertical-item]',
  templateUrl: './item.component.html'
})
export class CoreMenuVerticalItemComponent {
  @Input()
  item: CoreMenuItem;
  user = JSON.parse(localStorage.getItem('currentUser'))?.roleObj.roleName
  // vendor = JSON.parse(localStorage.getItem('currentUser'))

  //  constructor() {
  //    this.vendor.role = 'Vendor';

  //    localStorage.setItem('currentUser',JSON.stringify(this.vendor))
  // }
}
