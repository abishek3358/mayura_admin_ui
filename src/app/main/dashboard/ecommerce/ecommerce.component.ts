import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { CoreConfigService } from '@core/services/config.service';
import { CoreTranslationService } from '@core/services/translation.service';

import { User } from 'app/auth/models';
import { colors } from 'app/colors.const';
import { AuthenticationService } from 'app/auth/service';
import { DashboardService } from 'app/main/dashboard/dashboard.service';

import { locale as english } from 'app/main/dashboard/i18n/en';
import { locale as french } from 'app/main/dashboard/i18n/fr';
import { locale as german } from 'app/main/dashboard/i18n/de';
import { locale as portuguese } from 'app/main/dashboard/i18n/pt';
import { NgxSpinnerService } from "ngx-spinner";
import { LocationService } from 'app/main/pages/masters/location.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexDataLabels,
  ApexXAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexPlotOptions,
  ApexYAxis,
  ApexFill,
  ApexMarkers,
  ApexTheme,
  ApexNonAxisChartSeries,
  ApexLegend,
  ApexResponsive,
  ApexStates
} from 'ng-apexcharts';
export interface ChartOptions2 {
  // Apex-non-axis-chart-series
  series?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  stroke?: ApexStroke;
  tooltip?: ApexTooltip;
  dataLabels?: ApexDataLabels;
  fill?: ApexFill;
  colors?: string[];
  legend?: ApexLegend;
  labels?: any;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  markers?: ApexMarkers[];
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  states?: ApexStates;
}
@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class EcommerceComponent implements OnInit {
  waitingForValue = false;
  barchartShown = false;
  simplechartShow = false;
  single: any[];
  view: any[] = [1100, 200];
  views: any[] = [360, 100];

  colorScheme = {
    domain: ['#1AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#f7f7f7';
  dashBoardArr = [
    {
      "name": "WORK ORDER",
      "value": 0
    },
    {
      "name": "CLIENT",
      "value": 0
    },
    // {
    //   "name": "VENDOR",
    //   "value": 0
    // },
    {
      "name": "SUB CONTRACTOR",
      "value": 0
    },
    {
      "name": "S/C WOD",
      "value": 0
    },
    // {
    //   "name": "EMPLOYEE",
    //   "value": 0
    // }
  ];
  colorAttendance = {
    domain: ['#1AA454', '#E44D25']
  };
  cardColors: string = '';
  employeeArray = [
    {
      "name": "Presents",
      "value": 0
    },
    {
      "name": "Apsents",
      "value": 0
    },

  ];

  projectsArray: any = [];
  profitAndLossArray: any = [];
  purchaseOrderArray: any = [];


  //projects chart
  simplePieChart: any = {
    chart: {
      height: 400,
      type: 'pie',
    },
    projectsArray: [50, 50],


    labels: ['Completed Project', 'Incompleted Project'],
    colors: ['#34c38f', '#556ee6'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      verticalAlign: 'middle',
      floating: false,
      fontSize: '14px',
      offsetX: 0,
      offsetY: -10
    },
    responsive: [{
      breakpoint: 400,
      options: {
        chart: {
          height: 350
        },
        legend: {
          show: false
        },
      }
    }]
  };

  //Attendance chart
  public doughnutChartLabels: string[] = ['Present', 'Apsent',];
  public demodoughnutChartData: number[] = [250, 350];
  public doughnutChartType: string = 'doughnut';


  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public mbarChartLabels: any = [];
  public barChartType: string = 'bar';

  public barChartColors: Array<any> = [
    {
      backgroundColor: '#6495ed',
      borderColor: '#6495ed',
      pointBackgroundColor: '#6495ed',
      pointBorderColor: '#6495ed',
      pointHoverBackgroundColor: '#6495ed',
      pointHoverBorderColor: '#6495ed'
    },
    {
      backgroundColor: '#40E0D0',
      borderColor: '#40E0D0',
      pointBackgroundColor: '#40E0D0',
      pointBorderColor: '#40E0D0',
      pointHoverBackgroundColor: '#40E0D0',
      pointHoverBorderColor: '#40E0D0'
    }
  ];
  public barChartData: any[] = [
    { data: [], label: 'Profit' },
    { data: [], label: 'Loss' }
  ];
  apexDonut: boolean;
  apexRadial: boolean;

  // events
  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  public randomize(): void {
    let data = [
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
      (Math.random() * 100),
      Math.round(Math.random() * 100),
      (Math.random() * 100),
      Math.round(Math.random() * 100)];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
  }
  
  // Decorator
  @ViewChild('statisticsBarChartRef') statisticsBarChartRef: any;
  @ViewChild('statisticsLineChartRef') statisticsLineChartRef: any;
  @ViewChild('earningChartRef') earningChartRef: any;
  @ViewChild('revenueReportChartRef') revenueReportChartRef: any;
  @ViewChild('budgetChartRef') budgetChartRef: any;
  @ViewChild('statePrimaryChartRef') statePrimaryChartRef: any;
  @ViewChild('stateWarningChartRef') stateWarningChartRef: any;
  @ViewChild('stateSecondaryChartRef') stateSecondaryChartRef: any;
  @ViewChild('stateInfoChartRef') stateInfoChartRef: any;
  @ViewChild('stateDangerChartRef') stateDangerChartRef: any;
  @ViewChild('goalChartRef') goalChartRef: any;
  @ViewChild('apexRadialChartRef') apexRadialChartRef: any;
  @ViewChild('apexDonutChartRef') apexDonutChartRef: any;

  // Public
  public data: any;
  public currentUser: User;
  public isAdmin: boolean;
  public isClient: boolean;
  public statisticsBar;
  public statisticsLine;
  public revenueReportChartoptions;
  public budgetChartoptions;
  public goalChartoptions;
  public statePrimaryChartoptions;
  public stateWarningChartoptions;
  public stateSecondaryChartoptions;
  public stateInfoChartoptions;
  public stateDangerChartoptions;
  public earningChartoptions;
  public isMenuToggled = false;
  public loading = false;
  public apexDonutChart: Partial<ChartOptions2>;
  public apexRadialChart: Partial<ChartOptions2>;

  // Private
  private $barColor = '#f3f3f3';
  private $trackBgColor = '#EBEBEB';
  private $textMutedColor = '#b9b9c3';
  private $budgetStrokeColor2 = '#dcdae3';
  private $goalStrokeColor2 = '#51e5a8';
  private $textHeadingColor = '#5e5873';
  private $strokeColor = '#ebe9f1';
  private $earningsStrokeColor2 = '#28c76f66';
  private $earningsStrokeColor3 = '#28c76f33';

  /**
   * Constructor
   * @param {AuthenticationService} _authenticationService
   * @param {DashboardService} _dashboardService
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreTranslationService} _coreTranslationService
   */
  constructor(

    private _authenticationService: AuthenticationService,
    private _dashboardService: DashboardService,
    private _coreConfigService: CoreConfigService,
    private _coreTranslationService: CoreTranslationService,
    private spinner: NgxSpinnerService,
    private LocationService: LocationService,
    private toastr:ToastrService,
  ) {
    Object.assign(this, { dashBoardArr: this.dashBoardArr });
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));




    this._coreTranslationService.translate(english, french, german, portuguese);
  // Color Variables
 
 // Apex Radial Chart
     // Apex Radial Chart
     this.apexRadialChart = {
      series: [],
      labels: ['Paid', 'Unpaid' ],
      chart: {
        height: 0,
        type: 'radialBar'
      },
      colors: [this.chartColors.donut.series1, this.chartColors.donut.series2],
      plotOptions: {
        radialBar: {
          // size: 185,
          hollow: {
            size: '40%'
          },
          track: {
            margin: 15
          },
          dataLabels: {
            name: {
              fontSize: '2rem',
              fontFamily: 'Montserrat'
            },
            value: {
              fontSize: '1rem',
              fontFamily: 'Montserrat'
            },
            total: {
              show: true,
              fontSize: '1rem',
              label: '',
              formatter: function (w) {
                return '';
              }
            }
          }
        }
      },
      legend: {
        show: true,
        position: 'bottom'
      },
      stroke: {
        lineCap: 'round'
      }
    };
   
// Apex Donut Chart
this.apexDonutChart = {
  series: [],
  chart: {
    height: 0,
    type: 'donut'
  },
  colors: [
    this.chartColors.donut.series3,
    this.chartColors.donut.series4,
   
  ],
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            fontSize: '2rem',
            fontFamily: 'Montserrat'
          },
          value: {
            fontSize: '1rem',
            fontFamily: 'Montserrat',
            formatter: function (val) {
              return parseInt(val) + '%';
            }
          },
          total: {
            show: true,
            fontSize: '1.5rem',
            label: '',
            formatter: function (w) {
              return '';
            }
          }
        }
      }
    }
  },
  legend: {
    show: true,
    position: 'bottom'
  },
  labels: ['Paid', 'Unpaid'],
  responsive: [
    {
      breakpoint: 0,
      options: {
        chart: {
          height: 0
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ]
};

  }
  chartColors = {
    column: {
      series1: '#86B3EB',
      series2: '#d2b0ff',

      // bg: '#f8d3ff'
    },
    success: {
      shade_100: '#7eefc7',
      shade_200: '#06774f'
    },
    donut: {
      series1: '#39A4F1',
      series2: '#AC8BE6',
       series3: '#34CEA9',
       series4: '#2789E9'
    },
    area: {
     
      series2: '#86B3EB',
      series1: '#2bdac7'
    }

  };
  
  ngOnInit(): void {
    // this.spinner.show();
    // this.getCount();
    // this.getEmployee();
    // this.getChartData('YEAR');
    // this.getProjects();
    this.getPurchaseOrder();
     this.apexRadialChart.chart.width = this.apexRadialChartRef?.nativeElement.offsetWidth;
     this.apexDonutChart.chart.width = this.apexDonutChartRef?.nativeElement.offsetWidth;
  }
  getChartData(chargeType) {
    this._dashboardService.getProfitAndLoss(chargeType).pipe(first()).subscribe(res => {
    
      this.mbarChartLabels = [];
      for (let i = 0; i < res.data.dashBoardMonthProfitAndLossList.length; i++) {
        this.mbarChartLabels.push(res.data.dashBoardMonthProfitAndLossList[i].month);
        this.barChartData[0].data.push(res.data.dashBoardMonthProfitAndLossList[i].profitAmount);
        this.barChartData[1].data.push(res.data.dashBoardMonthProfitAndLossList[i].lossAmount);

      }     
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  getCount() {
    this._dashboardService.getCounts().pipe(first()).subscribe(res => {
      for (let i = 0; i < this.dashBoardArr.length; i++) {
        if (this.dashBoardArr[i].name == "WORK ORDER") {
          this.dashBoardArr[i].value = res.data.noOfWorkOrders
        }
        if (this.dashBoardArr[i].name == "CLIENT") {
          this.dashBoardArr[i].value = res.data.noOfClients
        }
        // if (this.dashBoardArr[i].name == "VENDOR") {
        //   this.dashBoardArr[i].value = res.data.noOfVendors
        // }
        if (this.dashBoardArr[i].name == "SUB CONTRACTOR") {
          this.dashBoardArr[i].value = res.data.noOfContractor
        }
        if (this.dashBoardArr[i].name == "S/C WOD") {
          this.dashBoardArr[i].value = res.data.noOfSubContractorWorkOrder
        }
        // if (this.dashBoardArr[i].name == "EMPLOYEE") {
        //   this.dashBoardArr[i].value = res.data.noOfEmployee
        // }
      }

      this.waitingForValue = true;
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  getEmployee() {
    this._dashboardService.getEmployeeAttendance().pipe(first()).subscribe(res => {
      this.employeeArray = res.data;
      for (let i = 0; i < this.employeeArray.length; i++) {
        if (this.employeeArray[i].name == "Presents") {
          this.employeeArray[i].value = res.data.employeePresentCount
        }
        if (this.employeeArray[i].name == "Apsents") {
          this.employeeArray[i].value = res.data.employeeAbsentCount
        }
      }

      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }

  getProfitAndLoss(calenderType) {
    this._dashboardService.getProfitAndLoss(calenderType).pipe(first()).subscribe(res => {
      this.profitAndLossArray = res.data;
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  };
  getProjects() {
    this._dashboardService.getProjects().pipe(first()).subscribe(res => {
      for (let i = 0; i < this.simplePieChart.projectsArray.length; i++) {
        this.simplePieChart.projectsArray[0] = res.data.completedProject
        this.simplePieChart.projectsArray[1] = res.data.incompletedProject
      }
      this.simplechartShow = true;
      this.spinner.hide();
      this.toastr.success(res.message);
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.error.error.reason);
    })
  }
  getPurchaseOrder(){
    // this._dashboardService.getPurchaseOrder().pipe(first()).subscribe(res=>{
    //   this.purchaseOrderArray = res.data;
      
    //   this.apexRadialChart.series.push(parseInt(this.purchaseOrderArray.salesInvoicePercentage));
    //   this.apexRadialChart.series.push(parseInt(this.purchaseOrderArray.salesInvoiceRemainingPercentage));
    //   this.apexDonutChart.series.push(parseInt(this.purchaseOrderArray.purchaseMaterialPercentage));
    //   this.apexDonutChart.series.push(parseInt(this.purchaseOrderArray.purchaseMaterialRemainingPercentage));
    //   setTimeout(()=>{
    //     this.apexDonut = true;
    //     this.apexRadial = true;
    //   },10)
     
    //   this.spinner.hide();
    //   this.toastr.success(res.message);
    // }, err => {
      this.spinner.hide();
  //     this.toastr.error(err.error.error.reason);
  //   })
  }

}
