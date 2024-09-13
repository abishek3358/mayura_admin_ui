import { Component, OnInit } from '@angular/core';
declare let $: any;
import { OffersService } from '../offers.service';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  activeOfferArr: any = [];
  expiryOfferArr: any = [];
  offerDetailsId: any = {};
  offerId: any;
  selectedTab: number = 1; 
  constructor(
    private offerService: OffersService,
    private modalService: NgbModal, 
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner:NgxSpinnerService,) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getActive();
    this.getExpiry();
    this.selectedTab = 1;
  }
//GET ACTIVE TABLE//
  getActive() {
    this.selectedTab = 1;
    $('#active').DataTable().clear().destroy();
    this.offerService.getActive().pipe(first()).subscribe((res:any) => {
      this.activeOfferArr = res.data;
      $(document).ready(function () {
        $('#active').DataTable({
          "iDisplayLength": 25
        });
      });   
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err);
    })
  }
//GET EXPIRY TABLE //
  getExpiry() {
    this.selectedTab = 2;
    $('#expired').DataTable().clear().destroy();
    this.offerService.getExpiry().pipe(first()).subscribe((res:any) => {
      this.expiryOfferArr = res.data;
      $(document).ready(function () {
        $('#expired').DataTable({
          "iDisplayLength": 100
        });
      });
      this.spinner.hide();
      
    },
    err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }

//DELETE//
deletedInActive(modal) {
  this.offerService.deleteOffer(this.offerId).pipe(first()).subscribe((res:any) => {
    this.getActive();
    this.getExpiry();
    this.selectedTab = 1;
    this.toastr.success(res.data);
    modal.dismiss('cross click');
  }, err => {
    modal.dismiss('cross click');
    this.toastr.error(err.error.error.reason);
  })
}


  deleted(modal) {
    this.offerService.deleteOffer(this.offerId).pipe(first()).subscribe((res:any) => {
      this.getActive();
      this.getExpiry();
      this.selectedTab = 2;
      this.toastr.success(res.data);
      modal.dismiss('cross click');
    }, err => {
      modal.dismiss('cross click');
      this.toastr.error(err.error.error.reason);
    })
  }

  
//EDIT//
  // edit() {
  //   this.router.navigate(['admin/offers-management/offers/manageoffer/']);
  // }

  deleteModal(myModalId, offer) {
    this.modalService.open(myModalId, { size: 'md' });
    this.offerId = offer.id;
  }
}
