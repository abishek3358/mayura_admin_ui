import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SubContractWorkOrderService } from '../sub-contract-work-order-form/sub-contract-work-order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SubContractorServiceService } from '../new-sub-contractor-work-order/sub-contractor-service.service';
declare let $: any;

@Component({
  selector: 'app-sub-contract-work-order',
  templateUrl: './sub-contract-work-order.component.html',
  styleUrls: ['./sub-contract-work-order.component.scss']
})
export class SubContractWorkOrderComponent implements OnInit {
  contractArr: any = [];
  workOrderId = '';
  id:any;
  constructor(
    private Toastr: ToastrService,
    private SubContractWorkOrderService: SubContractWorkOrderService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService:NgbModal,
    private SCWOService:SubContractorServiceService

  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getSubContract();
  }

  getSubContract() {
    $('#sub-contract').DataTable().clear().destroy();

    this.SCWOService.getWo().pipe(first()).subscribe(res => {
      this.contractArr = res.data;
      $(document).ready(function () {
        $('#sub-contract').DataTable({
          "iDisplayLength": 100
        });
      });

      this.spinner.hide();
      this.Toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.Toastr.error(err);
    });
  }
  editSubContract(id) {
    this.spinner.show();
    this.router.navigate(['app/sub/contract/' + id]);
  }

  viewSubContract(id) {
    this.router.navigate(['app/sub/contract/view/' + id]);
  }
  statusModal(modal,id){
    this.modalService.open(modal,{ size: 'md' });
    this.workOrderId = id;
  }
  statusCompleted(modal){
 
    this.spinner.show();
    this.SCWOService.getStatus(this.workOrderId).pipe(first()).subscribe(res => {
    
      this.getSubContract();
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      //this.Toastr.error(err.error.error.reason);
      // this.Toastr.error(err.error.error.reason);
    });
  }
deleteModal (content,workId){
  this.modalService.open(content,{size:'md'});
  this.workOrderId = workId;
}
  deleteSubContract(modal) {
    this.spinner.show();
    this.SCWOService.deleteWo(this.workOrderId).pipe(first()).subscribe(res => {
      this.getSubContract();
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    });
  }
}
