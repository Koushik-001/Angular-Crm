import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AuthService } from '../api-calls.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Rating } from 'primeng/rating'
interface MetricData {
  product_type: string;
  total_cost: number;
}

@Component({
  selector: 'app-feedback-page',
  imports: [ChartModule, CommonModule, TableModule,FormsModule,Rating],
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackPageComponent {
  phone_number: string = '';
  labels: string[] = [];
  metricData: number[] = [];
  data: any;
  options: any;
  tableData: any = [];
  feedback_form = {
    product_type: '',
    mode_of_purchase: '',
    cost_of_product: '',
    value:'',
    phone:localStorage.getItem('phone')
  };
  loader = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private apicall: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    this.loader=true
    console.log(this.feedback_form,'data')
    this.apicall.submitUserFeedback(this.feedback_form).subscribe((data)=>{ this.feedback_form = {
      product_type: '',
      mode_of_purchase: '',
      cost_of_product: '',
      value:'',
      phone: localStorage.getItem('phone') || '',
    };
  this.getUserData();
  this.loader=false
  })
  }

  getMetricData = () => {
    this.phone_number = localStorage.getItem('phone') || '';
    if (!this.phone_number) {
      return;
    }
    this.apicall
      .getMetrics(this.phone_number)
      .pipe(
        catchError((error) => {
          console.error('Error fetching metric data:', error);
          return of([]);
        })
      )
      .subscribe((data: MetricData[]) => {
        this.labels = [];
        this.metricData = [];

        data.forEach((ele: MetricData) => {
          if (ele?.product_type && ele?.total_cost) {
            this.labels.push(ele?.product_type);
            this.metricData.push(ele?.total_cost);
          }
        });

        this.data = {
          labels: this.labels,
          datasets: [
            {
              label: 'Expenditure',
              borderColor: '#db2e2e',
              pointBackgroundColor: 'red',
              pointBorderColor: 'green',
              pointHoverBackgroundColor: '#db2e2e',
              pointHoverBorderColor: '#db2e2e',
              data: this.metricData,
            },
          ],
        };

        this.cd.markForCheck();
        this.options = {
          font: {
            family: '"Iceland", sans-serif',
          },
          plugins: {
            legend: {
              labels: {
                color: '#044a1d',
                font: {
                  family: '"Iceland", sans-serif',
                },
              },
            },
          },
          scales: {
            r: {
              grid: {
                color: '#068a36',
              },
            },
          },
        };
      });
  };

  getUserData = async () => {
    this.phone_number = localStorage.getItem('phone') || '';
    try {
      await this.apicall
        .getUserFeedback(this.phone_number)
        .subscribe((data) => {
          this.tableData = data;
        });
    } catch (error) {
      console.log(error);
    }
  };

  ngOnInit() {
    this.getUserData();
    this.getMetricData();
  }
}
