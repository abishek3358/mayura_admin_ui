import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ContractorService } from '../contractor-form/contractor.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;
@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.scss']
})
export class ContractorComponent implements OnInit {
  ContractorArr: any = [];
  contractorId = '';
  constructor(
    private ContractorService: ContractorService,
    private Toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal

  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getContractor();
  }

  getContractor() {
    $('#contractorTable').DataTable().clear().destroy();

    this.ContractorService.getContractor().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#contractorTable').DataTable({
          "iDisplayLength": 100
        });
      });
      this.ContractorArr = res.data;
      this.spinner.hide();
      this.Toastr.success(res.message);
    })
  }
  editContractor(id) {
    this.spinner.show();
    this.router.navigate(['app/contractor' + '/' + id]);
  }
  deleteModal(content, contractorId) {
    this.contractorId = contractorId;
    this.modalService.open(content,{size:'md'});
  }
  deleteContractor(modal) {
    this.spinner.show();
    this.ContractorService.deleteContractor(this.contractorId).pipe(first()).subscribe(res => {
      this.getContractor();
      modal.dismiss("Cross Click");
      this.Toastr.success(res.data);
    }, err => {
      modal.dismiss("Cross Click");
      this.spinner.hide();
      this.Toastr.error(err.error.error.reason);
    })
  }
}
