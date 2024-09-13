import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ManageRewardService } from './manage-reward.service';
declare let $: any;
@Component({
  selector: 'app-manage-reward',
  templateUrl: './manage-reward.component.html',
  styleUrls: ['./manage-reward.component.scss']
})
export class ManageRewardComponent implements OnInit {
   rewardArr: any = [];
  constructor(
    private managerewardservice:ManageRewardService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
this.spinner.show();
   this.getReward();
  }
  getReward(){
    $('#reward').DataTable().clear().destroy();
    this.managerewardservice.getReward().subscribe(res=>{
      this.rewardArr = res.data
      $(document).ready(function () {
        $('#reward').DataTable({
          "iDisplayLength": 25
        });
      });
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }

}
