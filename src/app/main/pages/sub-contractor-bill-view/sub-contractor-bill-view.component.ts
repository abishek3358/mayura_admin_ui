import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubContractorBillService } from '../sub-contractor-bill/sub-contractor-bill.service';
import { Router , ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-sub-contractor-bill-view',
  templateUrl: './sub-contractor-bill-view.component.html',
  styleUrls: ['./sub-contractor-bill-view.component.scss']
})
export class SubContractorBillViewComponent implements OnInit {
  subContractor:any = {};
  subContractorBillDtlList:any = [];
  contractorData={};
  constructor(private ScBillService: SubContractorBillService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
   if(id){
    this.getView(id);
   }
   this.spinner.show();
      
    console.log('view', this.subContractor)
  }
  getView(id) {
    this.ScBillService.subContractorView(id).pipe(first()).subscribe(res => {
      this.subContractor = res.data;
      console.log('view', this.subContractor)
      this.spinner.hide();
      this.toastr.success(res.message)
    }, err => {
    
      // this.toastr.error(err.error.error.reason);
      this.spinner.hide();
    })
  }
}
