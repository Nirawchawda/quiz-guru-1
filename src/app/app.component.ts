import { Component , OnInit } from '@angular/core';
import { AppService } from './app.service';
import { FormBuilder , FormControl , Validators} from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'quizGuru1';
	response : any;
	questions : any = [];
	checkoutForm:any;
	submitted : boolean = false;
	analysis = {
		correct : 0,
		incorrect : 0
	};


	// public barChartOptions: ChartOptions = {
	// 	responsive: true,
	// 	scales: {
 //            yAxes: [{
 //                ticks: {
 //                    beginAtZero: true,
 //                    maxTicksLimit: 10
 //                }
 //            }]
 //        }
	// };
	public barChartOptions: ChartOptions = {
	    // We use these empty structures as placeholders for dynamic theming.
	    scales: { xAxes: [{}], 
	    		  yAxes: [{
					    	ticks: {
				                    beginAtZero: true,
				                    maxTicksLimit: 10
				                }
						    }
	    				] 
				},
	    plugins: {
	      datalabels: {
	        anchor: 'end',
	        align: 'end',
	      }
	    },
	    legend: {
	        display: false
	    },
	    maintainAspectRatio: false,
	    responsive : true
	  };
	  public barChartLabels: any[] = ['Incorrect', 'correct'];
	  public barChartType: ChartType = 'bar';
	  public barChartLegend = true;
	  public barChartPlugins = [];

	  public barChartData: ChartDataSets[] = [
	    { data: [0,0],
		  backgroundColor: ["red", "blue", "green", "blue", "red", "blue"],
		  hoverBackgroundColor : ["red", "blue", "green", "blue", "red", "blue"]}
	  ];

	displayChart : boolean = true;

	constructor(
		private _app: AppService,
	    private formBuilder: FormBuilder,
	) { 
		this.checkoutForm = this.formBuilder.group({});
	}

	ngOnInit() {
		this._app.getShippingPrices().subscribe(
			res=>{
				this.response = res;
				var cnt = 1 , options = {};
				for(var i in res){
					options['answer-'+cnt] = new FormControl('', [Validators.required]);
					cnt++;
				}
				this.questions = res;
				this.checkoutForm = this.formBuilder.group(options);
				console.log(this.checkoutForm);
			}
		);
	}

	onSubmit(form){
		this.analysis.correct = 0;
		this.analysis.incorrect = 0;
		this.submitted = true;
		if(form.status == 'INVALID'){
			console.log(form.status);
		}else{
			console.log('Now u can show the graph',form.value);
			this.questions.forEach(function(a,i,b){
				a.options.forEach(function(l){
					if(l.key == form.value['answer-'+(i+1)]){
						console.log(l);
						if(l.correct){
							this.analysis.correct++;
						}else{
							this.analysis.incorrect++;
						}
					}
				}.bind(this))
			}.bind(this)) 
			console.log(this.analysis);
			this.barChartData[0].data = [this.analysis.incorrect,this.analysis.correct]
			this.displayChart = true;
		}
	}
	clearResults(){
		this.analysis.correct = 0;
		this.analysis.incorrect = 0;
		this.barChartData[0].data = [0,0];
		this.displayChart = true;
		this.submitted = false;

		var cnt = 1,options = {};
		for(var i in this.response){
			options['answer-'+cnt] = new FormControl('', [Validators.required]);
			cnt++;
		}
		this.questions = this.response;
		this.checkoutForm = this.formBuilder.group(options);
	}
}
