import { Component, OnInit } from '@angular/core';
import { VendorOrderService } from '../vendor-order.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';

declare let $: any
@Component({
  selector: 'app-deliverd-list',
  templateUrl: './deliverd-list.component.html',
  styleUrls: ['./deliverd-list.component.scss']
})
export class DeliverdListComponent implements OnInit {
  deliverdArr: any = []
  listArr: any = [];
  vendorObj: any = {};
  view: any;
  vendorId:any;
  user: any = {};

  constructor(private service: VendorOrderService,
    private spinner: NgxSpinnerService,
    private Toastr: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getAllocate('DELIVERED')
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.vendorId = this.user.userId;
  }
  getAll: any = [];

  getAllocate(orderStatus) {
    $('#deliverey').DataTable().clear().destroy();
    this.service.getVendor(orderStatus).subscribe(res => {
      this.Toastr.success(res.message);
      this.getAll = res.data;
      this.listArr = this.getAll.filter((res: any) => {
        return res.userId == this.vendorId;
      })
      
      this.listArr.sort((a:any,b:any)=>{
        if(a.customerOrderNo<b.customerOrderNo)return-1;
        if(a.customerOrderNo>b.customerOrderNo)return 1;
        return 0;
          })
      this.vendorObj = res.data;
      $(document).ready(function () {
        $('#deliverey').DataTable({
          "iDisplayLength": 25
        });
      });
      this.spinner.hide();
    }, err => {

      this.Toastr.error(err);
    });
  }

  openModal(content: any, id: any) {

    this.view = this.listArr.find(function (element) {

      return id == element.customerOrderId;
    });
    this.modalService.open(content, { size: 'lg' })
  }
}
