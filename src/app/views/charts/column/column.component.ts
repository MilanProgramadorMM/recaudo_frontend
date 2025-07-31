import { Component } from '@angular/core';
import { PageTitleComponent } from "@components/page-title.component";
import { basicColumnChartOpts, columnGroupChartOpts, columnMarkersChartOpts, datalabelsColumnChartOpts, distributedColumnChartOpts, fullStackedColumnChartOpts, negativeColumnChartOpts, rangeColumnChartOpts, rotateColumnChartOpts, stackedColumnChartOpts } from './data';
import { NgApexchartsModule } from 'ng-apexcharts';
import ApexCharts from 'apexcharts'
import type { ChartOptions } from '@common/apexchart.model';

function updateQuarterChart(sourceChart: any, destChartIDToUpdate: string) {
  let series = []
  let seriesIndex = 0
  let colors = []
  if (sourceChart.w.globals.selectedDataPoints[0]) {
    let selectedPoints = sourceChart.w.globals.selectedDataPoints
    for (let i = 0; i < selectedPoints[seriesIndex].length; i++) {
      let selectedIndex = selectedPoints[seriesIndex][i]
      let yearSeries = sourceChart.w.config.series[seriesIndex]
      series.push({
        name: yearSeries.data[selectedIndex].x,
        data: yearSeries.data[selectedIndex].quarters,
      })
      colors.push(yearSeries.data[selectedIndex].color)
    }
    if (series.length === 0)
      series = [
        {
          data: [],
        },
      ]
    return ApexCharts.exec(destChartIDToUpdate, 'updateOptions', {
      series: series,
      colors: colors,
      fill: {
        colors: colors,
      },
    })
  }
}

function shuffleArray(
  array: { y: number; quarters: { x: string; y: number }[] }[]
) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

let arrayData = [
  {
    y: 400,
    quarters: [
      {
        x: 'Q1',
        y: 120,
      },
      {
        x: 'Q2',
        y: 90,
      },
      {
        x: 'Q3',
        y: 100,
      },
      {
        x: 'Q4',
        y: 90,
      },
    ],
  },
  {
    y: 430,
    quarters: [
      {
        x: 'Q1',
        y: 120,
      },
      {
        x: 'Q2',
        y: 110,
      },
      {
        x: 'Q3',
        y: 90,
      },
      {
        x: 'Q4',
        y: 110,
      },
    ],
  },
  {
    y: 448,
    quarters: [
      {
        x: 'Q1',
        y: 70,
      },
      {
        x: 'Q2',
        y: 100,
      },
      {
        x: 'Q3',
        y: 140,
      },
      {
        x: 'Q4',
        y: 138,
      },
    ],
  },
  {
    y: 470,
    quarters: [
      {
        x: 'Q1',
        y: 150,
      },
      {
        x: 'Q2',
        y: 60,
      },
      {
        x: 'Q3',
        y: 190,
      },
      {
        x: 'Q4',
        y: 70,
      },
    ],
  },
  {
    y: 540,
    quarters: [
      {
        x: 'Q1',
        y: 120,
      },
      {
        x: 'Q2',
        y: 120,
      },
      {
        x: 'Q3',
        y: 130,
      },
      {
        x: 'Q4',
        y: 170,
      },
    ],
  },
  {
    y: 580,
    quarters: [
      {
        x: 'Q1',
        y: 170,
      },
      {
        x: 'Q2',
        y: 130,
      },
      {
        x: 'Q3',
        y: 120,
      },
      {
        x: 'Q4',
        y: 160,
      },
    ],
  },
]

@Component({
  selector: 'column',
  standalone: true,
  imports: [PageTitleComponent,NgApexchartsModule],
  templateUrl: './column.component.html',
  styles: ``
})
export class ColumnComponent {
  basicColumnChart = basicColumnChartOpts
  stackedColumnChart = stackedColumnChartOpts
  datalabelsColumnChart = datalabelsColumnChartOpts
  fullStackedColumnChart = fullStackedColumnChartOpts
  columnMarkersChart = columnMarkersChartOpts
  columnGroupChart = columnGroupChartOpts
  rotateColumnChart = rotateColumnChartOpts
  negativeColumnChart = negativeColumnChartOpts
  distributedColumnChart = distributedColumnChartOpts
  rangeColumnChart = rangeColumnChartOpts

  makeData() {
    let dataSet = shuffleArray(arrayData)

    return [
      {
        x: '2011',
        y: dataSet[0].y,
        color: '#727cf5',
        quarters: dataSet[0].quarters,
      },
      {
        x: '2012',
        y: dataSet[1].y,
        color: '#6c757d',
        quarters: dataSet[1].quarters,
      },
      {
        x: '2013',
        y: dataSet[2].y,
        color: '#0acf97',
        quarters: dataSet[2].quarters,
      },
      {
        x: '2014',
        y: dataSet[3].y,
        color: '#fa5c7c',
        quarters: dataSet[3].quarters,
      },
      {
        x: '2015',
        y: dataSet[4].y,
        color: '#ffbc00',
        quarters: dataSet[4].quarters,
      },
      {
        x: '2016',
        y: dataSet[5].y,
        color: '#39afd1',
        quarters: dataSet[5].quarters,
      },
    ]
  }

  yearColumnChart: Partial<ChartOptions> = {
    series: [
      {
        data: this.makeData(),
      },
    ],
    chart: {
      id: 'barYear',
      height: 400,
      width: '100%',
      type: 'bar',
      toolbar: {
        show: false,
      },
      events: {
        dataPointSelection: function (e, chart, opts) {
          let quarterChartEl = document.querySelector('#chart-quarter')
          var yearChartEl = document.querySelector('#chart-year')

          if (opts.selectedDataPoints[0].length === 1) {
            if (quarterChartEl?.classList.contains('active')) {
              updateQuarterChart(chart, 'barQuarter')
            } else {
              yearChartEl?.classList.add('chart-quarter-activated')
              quarterChartEl?.classList.add('active')
              updateQuarterChart(chart, 'barQuarter')
            }
          } else {
            updateQuarterChart(chart, 'barQuarter')
          }

          if (opts.selectedDataPoints[0].length === 0) {
            yearChartEl?.classList.remove('chart-quarter-activated')
            quarterChartEl?.classList.remove('active')
          }
        },
        updated: function (chart) {
          updateQuarterChart(chart, 'barQuarter')
        },
      },
    },
    plotOptions: {
      bar: {
        distributed: true,
        horizontal: true,
        barHeight: '75%',
        dataLabels: {
          position: 'bottom',
        },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff'],
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex]
      },
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
    colors: ['#727cf5', '#6c757d', '#0acf97', '#fa5c7c', '#ffbc00', '#39afd1'],

    states: {
      active: {
        allowMultipleDataPointsSelection: true,
        filter: {
          type: 'darken',
        },
      },
    },
    tooltip: {
      x: {
        show: false,
      },
    },
    title: {
      text: 'Yearly Results',
      offsetX: 15,
    },
    subtitle: {
      text: '(Click on bar to see details)',
      offsetX: 15,
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  }

  quarterChart: Partial<ChartOptions> = {
    series: [
      {
        data: [],
      },
    ],
    chart: {
      id: 'barQuarter',
      height: 400,
      width: '100%',
      type: 'bar',
      stacked: true,
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        horizontal: false,
      },
    },
    legend: {
      show: false,
    },
    colors: ['#1c84ee', '#7f56da', '#ff86c8', '#ef5f5f', '#f9b931', '#22c55e'],
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    title: {
      text: 'Quarterly Results',
      offsetX: 10,
    },
    tooltip: {
      x: {
        formatter: function (val, opts) {
          return opts.w.globals.seriesNames[opts.seriesIndex]
        },
      },
    },
  }

  updateQuarter() {
    this.yearColumnChart.series = [
      {
        data: this.makeData(),
      },
    ]
  }
}
