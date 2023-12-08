import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  select,
  scaleLinear,
  max,
  min,
  scaleTime,
  extent,
  curveBasis,
  line,
  axisBottom,
  timeFormat,
  axisLeft,
  area,
  format,
} from 'd3';
import { DateChartData } from '../../types/chart.types';

@Component({
  selector: 'app-linechart',
  standalone: true,
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss'],
})
export class LinechartComponent implements OnInit, AfterViewInit {
  @ViewChild('linechart', { static: false }) lineChartRef!: ElementRef;
  @Input({ required: true }) data!: DateChartData;
  @Input() yAxisFormat: string | null = null;

  private dimensions!: {
    width: number;
    height: number;
    innerHeight: number;
    innerWidth: number;
    margin: {
      top: number;
      left: number;
      right: number;
      bottom: number;
    };
  };

  public svg: any;
  public svgInner: any;
  public yScale: any;
  public xScale: any;
  public xAxis: any;
  public yAxis: any;
  public lineGroup: any;

  constructor(
    private readonly chartComponentRef: ElementRef,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.initChart();
      this.drawChart();
    });
  }

  calculateDimensions() {
    console.log(this.lineChartRef.nativeElement.offsetWidth);

    this.dimensions = {
      width: this.lineChartRef.nativeElement.offsetWidth,
      height: this.lineChartRef.nativeElement.offsetHeight,
      margin: {
        top: 20,
        left: 30,
        right: 20,
        bottom: 20,
      },
      innerHeight: 0,
      innerWidth: 0,
    };
    this.dimensions.innerHeight =
      this.dimensions.height -
      this.dimensions.margin.top -
      this.dimensions.margin.bottom;
    this.dimensions.innerWidth =
      this.dimensions.width -
      this.dimensions.margin.left -
      this.dimensions.margin.right;
  }

  initChart() {
    this.calculateDimensions();
    this.svg = select(this.chartComponentRef.nativeElement)
      .select('.linechart')
      .append('svg')
      .attr('width', this.dimensions.width)
      .attr('height', this.dimensions.height);

    this.svgInner = this.svg
      .append('g')
      .attr('height', this.dimensions.innerHeight)
      .attr('with', this.dimensions.innerWidth)
      .attr(
        'transform',
        `translate(${this.dimensions.margin.left}, ${this.dimensions.margin.top})`
      );

    this.yScale = scaleLinear()
      .domain([
        max(this.data, (d) => d.value)! + 0.5,
        min(this.data, (d) => d.value)! - 0.5,
      ])
      // .domain([max(this.data, d => d.value) + 0.5, 0])
      .range([0, this.dimensions.innerHeight])
      .nice();

    this.yAxis = this.svgInner.append('g').attr('class', 'linechart-y-axis');

    this.xScale = scaleTime()
      .domain(<any>extent(this.data, (d) => d.date))
      .range([0, this.dimensions.innerWidth]);

    this.xAxis = this.svgInner
      .append('g')
      .attr('class', 'linechart-x-axis')
      .attr('transform', `translate(0, ${this.dimensions.innerHeight})`);

    this.lineGroup = this.svgInner
      .append('g')
      .attr('class', 'linechart-line-group');
  }

  drawChart() {
    const xAxis = axisBottom(this.xScale)
      .ticks(3)
      .tickFormat(<any>timeFormat('%Y/%m'));
    this.xAxis.call(xAxis);

    const yAxis = axisLeft(this.yScale)
      .ticks(6)
      .tickSize(-this.dimensions.innerWidth);

    if (this.yAxisFormat) {
      yAxis.tickFormat(<any>format(this.yAxisFormat!));
    }
    this.yAxis.call(yAxis);

    this.yAxis.select('path').remove();
    this.xAxis.selectAll('path, .tick line').remove();

    const lineGenerator = line()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(curveBasis);

    const areaGenerator = area()
      .x((d) => d[0])
      .y0(this.dimensions.innerHeight)
      .y1((d) => d[1])
      .curve(curveBasis);

    const points: [number, number][] = this.data.map((d) => [
      this.xScale(d.date),
      this.yScale(d.value),
    ]);

    // AREA
    this.lineGroup
      .append('path')
      .attr('class', 'area')
      .attr('d', areaGenerator(points));

    // LINE
    this.lineGroup
      .append('path')
      .attr('class', 'line')
      .style('fill', 'none')
      .style('stroke-width', '2px')
      .attr('d', lineGenerator(points));
  }
}
