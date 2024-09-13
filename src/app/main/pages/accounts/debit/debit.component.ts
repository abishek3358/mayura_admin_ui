import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DebitserviceService } from '../../accounts/debit/debitservice.service';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';




declare let $: any;

@Component({
  selector: 'app-debit',
  templateUrl: './debit.component.html',
  styleUrls: ['./debit.component.scss']
})
export class DebitComponent implements OnInit {
  debitList = [];
  debitId:"";
  id:any;

  constructor(private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private spinner: NgxSpinnerService,
    private debitservice: DebitserviceService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getDebit();
  }
  getDebit() {
    $('#debitTable').DataTable().clear().destroy();
    this.debitservice.getDebit().pipe(first()).subscribe(res => {
      this.debitList = res.data;
      $(document).ready(function () {
        $('#debitTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    });
  }

  editDebit(id) {
    this.spinner.show();
    this.router.navigate(['app/accounts/debit' + '/' + id]);
  }
  deleteConfirmation(modal,debit){
    this.modalService.open(modal, { size: 'md' });
    this.debitId = debit.id;
  }

  delete(modal) {
    this.spinner.show();
    this.debitservice.deleteDebit(this.debitId).pipe(first()).subscribe(res => {
      this.getDebit();
      modal.dismiss("cross click");
      this.toastr.success(res.data);
    }, err => {
      modal.dismiss("cross click");
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    });
  }
}






