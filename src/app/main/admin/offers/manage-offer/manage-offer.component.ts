import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import Stepper from 'bs-stepper';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { OffersService } from '../offers.service';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-manage-offer',
  templateUrl: './manage-offer.component.html',
  styleUrls: ['./manage-offer.component.scss']
})
export class ManageOfferComponent implements OnInit {
  startDateAndTime: string;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '0',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],


  };
  offerSubmitted = false;
  submittedForm: FormGroup;
  private modernWizardStepper: Stepper;
  stepper: any;
  activeOfferArr: [];
  offerData: any = {};
  offerDetailsId: any;
  id: any;
  end: any;
  start: any;
  buttonText: string = 'Submit';

  constructor(
    private formBuilder: FormBuilder,
    private offerService: OffersService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,) {
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    if (this.id) {
      this.getSingleProduct();
    }
    this.modernWizardStepper = new Stepper(document.querySelector('#stepper3'), {});
    this.submittedForm = this.formBuilder.group({
      offerName: [null, [Validators.required]],
      offerCode: [null, [Validators.required]],
      start: [null, [Validators.required]],
      end: [null, [Validators.required]],
      startDateAndTime: [null],
      expiryDateAndTime: [null],
      offerType: [null, [Validators.required]],
      offerValue: [null, [Validators.required]],
      minimumOrderAmount: [null, [Validators.required]],
      termsAndConditions: [null, [Validators.required]],
      id: [null]
    })
  }

  started() {
    let val = this.submittedForm.value.start.split('T');
    val[0] = val[0].split('-').reverse().join('/');
    val[1] = val[1].split(':');
    let timeType: string = val[1][0] > 12 ? 'PM' : 'AM';
    val[1][0] = val[1][0] - (val[1][0] > 12 ? 12 : 0);
    val[1][0] = val[1][0] == 0 ? 12 : val[1][0];
    val[1] = `${val[1].join(':')} ${timeType}`;
    val[1] = val[1];
    val = val.join(' ');

    this.submittedForm.patchValue({
      startDateAndTime: val,
    });

  }
  expired() {
    let val = this.submittedForm.value.end.split('T');
    val[0] = val[0].split('-').reverse().join('/');
    val[1] = val[1].split(':');
    let timeType: string = val[1][0] > 12 ? 'PM' : 'AM';
    val[1][0] = val[1][0] - (val[1][0] > 12 ? 12 : 0);
    val[1][0] = val[1][0] == 0 ? 12 : val[1][0];
    val[1] = `${val[1].join(':')} ${timeType}`;
    val[1] = val[1];
    val = val.join(' ');
    this.submittedForm.patchValue({
      expiryDateAndTime: val,
    });

  }

  get f() { return this.submittedForm.controls };

  next() {
    this.offerSubmitted = true;
    if (this.submittedForm.value.offerName && this.submittedForm.value.offerCode
      && this.submittedForm.value.end
      && this.submittedForm.value.start
      && this.submittedForm.value.offerType && this.submittedForm.value.offerValue && this.submittedForm.value.minimumOrderAmount) {
      this.offerSubmitted = false;
      this.modernWizardStepper.next();
    }
  }

  previous() {
    this.modernWizardStepper.previous();
  }

  onSubmit() {
    this.offerSubmitted = true;
    if (this.submittedForm.invalid) {
      return
    }

    if (this.submittedForm.value.id) {
      this.buttonText = "Update"
      this.offerService.updateOffer(this.submittedForm.value).pipe(first()).subscribe(res => {
        this.getSingleProduct();
        this.activeOfferArr = res.data;
        this.router.navigate(['admin/offer-management/offers']);
        this.toastr.success(res.data);
      },
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        })
    }
    else {
      this.offerService.createOffer(this.submittedForm.value).pipe(first()).subscribe(res => {
        this.activeOfferArr = res.data;
        this.router.navigate(['admin/offer-management/offers'])
        this.toastr.success(res.data);
      },
        err => {
          this.spinner.hide();
          this.toastr.error(err.error.error.reason);
        })
    }
  }
  getSingleProduct() {
    this.offerService.singleOffer(this.id).pipe(first()).subscribe(res => {
      this.submittedForm.patchValue({
        id: res.data.id,
        startDateAndTime: res.data.startDateAndTime,
        expiryDateAndTime: res.data.expiryDateAndTime,
        minimumOrderAmount: res.data.minimumOrderAmount,
        offerCode: res.data.offerCode,
        offerName: res.data.offerName,
        offerType: res.data.offerType,
        offerValue: res.data.offerValue,
        termsAndConditions: res.data.termsAndConditions,
        // start: this.demo(res.data.startDateAndTime),
        // end: this.demo(res.data.expiryDateAndTime)
      });
    },
      err => {
        this.spinner.hide();
        this.toastr.error(err.error.error.reason);
      })
    this.buttonText = "Update"
  }

  demo(value: any) {
    if (value) {
      let reverseFormat = value;
      console.log(value);
      
      reverseFormat = reverseFormat.split(' ');
      reverseFormat[0] = reverseFormat[0].split('/').reverse().join('-');
      reverseFormat[1] = reverseFormat[1].split(':');
      reverseFormat[1][0] =
        reverseFormat[2] == 'PM'
          ? Number(reverseFormat[1][0]) + 12
          : reverseFormat[1][0];
      reverseFormat[1] = reverseFormat[1].join(':');
      reverseFormat.splice(2, 1);
      return (reverseFormat = reverseFormat.join('T'));
    }
  }
}
