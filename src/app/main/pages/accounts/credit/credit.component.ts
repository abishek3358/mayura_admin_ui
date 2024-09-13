import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreditService } from '../credit/credit.service';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss']
})
export class CreditComponent implements OnInit {


  creditArr: any = [];
  creditId = "";

  constructor(private router: Router,
    private Toastr: ToastrService,
    private Spinner: NgxSpinnerService,
    private modalService:NgbModal,
    private CreditService: CreditService) { }

  ngOnInit(): void {
    this.getCredit();

  }


  getCredit() {
    this.Spinner.show();
    $('#credit').DataTable().clear().destroy();
    this.CreditService.getCredit().pipe(first()).subscribe(res => {
      this.creditArr = res.data;

      $(document).ready(function () {
        $('#credit').DataTable({
          "iDisplayLength": 100
        });
      });
      this.Spinner.hide();
      this.Toastr.success(res.message);
    }, err=>{
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }


  editCredit(id) {
    this.Spinner.show();
    this.router.navigate(['app/accounts/credit' + '/' + id]);
  }
  deletConfirmation(modal,creditData){
    this.modalService.open(modal, { size:'md'});
    this.creditId = creditData.id;
  }
  delete(modal) {
    this.Spinner.show();
    this.CreditService.deleteCredit(this.creditId).pipe(first()).subscribe(res => {
      this.getCredit();
      modal.dismiss("cross click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("cross click");
      this.Spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }


}
