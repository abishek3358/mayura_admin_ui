import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductListService } from './product-list/product-list.service';
declare let $: any;




@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productArr:any = [];

  

  constructor( public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private product:ProductListService
    ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getProduct();

  }
  getProduct() {
    $('#product').DataTable().clear().destroy();

    this.product.getProduct().pipe(first()).subscribe(res => {
      $(document).ready(function () {
        $('#product').DataTable({
          "iDisplayLength":25
        });
      });
      this.productArr = res.data;
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
 
 
  

  
  




}
