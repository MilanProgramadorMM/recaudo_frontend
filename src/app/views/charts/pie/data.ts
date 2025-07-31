import type { ChartOptions } from "@common/apexchart.model"

const small1 = 'assets/images/small/small-1.jpg'
const small2 = 'assets/images/small/small-2.jpg'
const small3 = 'assets/images/small/small-3.jpg'
const small4 = 'assets/images/small/small-4.jpg'


export const simplePieChartOpts: Partial<ChartOptions> = {
  chart: {
    height: 320,
    type: 'pie',
  },
  series: [44, 55, 41, 17, 15],
  labels: ["Series 1", "Series 2", "Series 3", "Series 4", "Series 5"],
  colors: ["#727cf5", "#6c757d", "#0acf97", "#fa5c7c", "#e3eaef"],
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    // verticalAlign: 'middle',
    floating: false,
    fontSize: '14px',
    offsetX: 0,
    offsetY: 7
  },
  
}

export const simpleDonutChartOpts: Partial<ChartOptions> = {
  chart: {
    height: 320,
    type: 'donut',
  },
  series: [44, 55, 41, 17, 15],
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    // verticalAlign: 'middle',
    floating: false,
    fontSize: '14px',
    offsetX: 0,
    offsetY: 7
  },
  labels: ["Series 1", "Series 2", "Series 3", "Series 4", "Series 5"],
  colors: ["#39afd1", "#ffbc00", "#313a46", "#fa5c7c", "#0acf97"],
 
}

export const monochromePieChartOpts: Partial<ChartOptions> = {
  chart: {
    height: 320,
    type: 'pie',
  },
  series: [25, 15, 44, 55, 41, 17],
  labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    // verticalAlign: 'middle',
    floating: false,
    fontSize: '14px',
    offsetX: 0,
    offsetY: 7
  },
  theme: {
    monochrome: {
      enabled: true
    }
  },
 
}

export const gradientDonutChartOpts: Partial<ChartOptions> = {
  chart: {
    height: 320,
    type: 'donut',
  },
  series: [44, 55, 41, 17, 15],
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    // verticalAlign: 'middle',
    floating: false,
    fontSize: '14px',
    offsetX: 0,
    offsetY: 7
  },
  labels: ["Series 1", "Series 2", "Series 3", "Series 4", "Series 5"],
  colors: ["#727cf5", "#6c757d", "#0acf97", "#fa5c7c", "#e3eaef"],

  fill: {
    type: 'gradient'
  }
}

export const patternedDonutChartOpts: Partial<ChartOptions> = {
  chart: {
    height: 320,
    type: 'donut',
    dropShadow: {
      enabled: true,
      color: '#111',
      top: -1,
      left: 3,
      blur: 3,
      opacity: 0.2
    }
  },
  stroke: {
    show: true,
    width: 2,
  },
  series: [44, 55, 41, 17, 15],
  colors: ["#39afd1", "#ffbc00", "#313a46", "#fa5c7c", "#0acf97"],
  labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
  dataLabels: {
    dropShadow: {
      blur: 3,
      opacity: 0.8
    }
  },
  fill: {
    type: 'pattern',
    opacity: 1,
    pattern: {
      // enabled: true,
      style: ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'],
    },
  },
  states: {
    hover: {
      // enabled: false
    }
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    // verticalAlign: 'middle',
    floating: false,
    fontSize: '14px',
    offsetX: 0,
    offsetY: 7
  },
}

export const imagePieChartOpts: Partial<ChartOptions> = {
  chart: {
    height: 320,
    type: 'pie',
  },
  labels: ["Series 1", "Series 2", "Series 3", "Series 4"],
  colors: ["#39afd1", "#ffbc00", "#727cf5", "#0acf97"],
  series: [44, 33, 54, 45],
  fill: {
    type: 'image',
    opacity: 0.85,
    image: {
      src: [small1, small2, small3, small4],
      width: 25,
      // imagedHeight: 25
    },
  },
  stroke: {
    width: 4
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    // verticalAlign: 'middle',
    floating: false,
    fontSize: '14px',
    offsetX: 0,
    offsetY: 7
  },

}

export const donutUpdateOpts: Partial<ChartOptions> = {
  chart: {
    height: 320,
    type: 'donut',
  },
  dataLabels: {
    enabled: false,
  },
  series: [44, 55, 13, 33],
  colors: ["#727cf5", "#6c757d", "#0acf97", "#fa5c7c"],
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    // verticalAlign: "middle",
    floating: false,
    fontSize: '14px',
    offsetX: 0,
    offsetY: 7,
    
  },

}