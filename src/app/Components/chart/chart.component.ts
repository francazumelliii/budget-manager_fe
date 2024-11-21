import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements OnChanges {
  colorScheme: Color = {
    domain: ['#be123c', '#a21caf', '#7e22ce','#5AA454', '#4338ca', '#0e7490', '#0f766e', '#15803d', '#a16207', '#c2410c', '#b91c1c'],
    name: '',
    selectable: false,
    group: ScaleType.Ordinal
  };

  @Input() title: string = "";
  @Input() view: [number, number] = [500, 225];
  @Input() data: any[] = [];
  @Input() showXAxis: boolean = true;
  @Input() showYAxis: boolean = true;
  @Input() gradient: boolean = false;
  @Input() showLegend: boolean = false;
  @Input() showXAxisLabel: boolean = true;
  @Input() xAxisLabel: string = '';
  @Input() showYAxisLabel: boolean = true;
  @Input() units: any = '€'
  @Input() yAxisLabel: string = '';
  @Input() legend: string = '';
  @Input() legendTitle: string = '';
  @Input() type: string = 'bar-vertical-2d';
  @Input() maxValue: number = 0;
  @Input() percentage: number = 0;
  @Input() showText: boolean = false;

  scheme!: Color;
  domain: string[] = [];
  isDataAvailable: boolean = false; 
  ngOnChanges(changes: SimpleChanges) {
    this.updateColorScheme();
  }

  updateColorScheme() {
    if (this.percentage <= 50 && this.percentage > 0) {
      this.domain = ['#16a34a'];
    } else if (this.percentage > 50 && this.percentage <= 75) {
      this.domain = ['#ca8a04'];
    } else if (this.percentage > 75 && this.percentage <= 90) {
      this.domain = ['#ea580c'];
    } else {
      this.domain = ['#dc2626'];
    }

    this.scheme = {
      domain: this.domain,
      name: '',
      selectable: false,
      group: ScaleType.Ordinal
    };
  }

  constructor() {}

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
