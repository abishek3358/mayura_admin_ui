import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { BillOfQuantityService } from '../bill-of-quantity/bill-of-quantity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bill-of-quantity-view',
  templateUrl: './bill-of-quantity-view.component.html',
  styleUrls: ['./bill-of-quantity-view.component.scss']
})
export class BillOfQuantityViewComponent implements OnInit {
  billOfQuantityDtlDTO: any = {};
  id: any;
  billofquantityId: any;
  constructor(private BillOfQuantityService: BillOfQuantityService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
   
    if (this.route.snapshot.params['id']) {
      this.boqView(this.route.snapshot.params['id']);
    
    }
    
this.spinner.show();
    console.log(this.billOfQuantityDtlDTO);
  }
  boqView(id) {
    this.BillOfQuantityService.getSingleBoq(id).pipe(first()).subscribe(res => {
      this.toastr.success(res.massage);
      this.spinner.hide();
      this.billOfQuantityDtlDTO = res.data;
    }), err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    }
  }
  download(id) {
    this.spinner.show();
    var win = window.open(environment.apiUrl + 'api/document/download/get/' + this.route.snapshot.params['id']);
    win.focus();
    this.spinner.hide();
  }
}
