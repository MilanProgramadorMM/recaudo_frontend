import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PageTitleComponent} from "@components/page-title.component";
import {NouisliderModule} from 'ng2-nouislider'

@Component({
  selector: 'range-slider',
  standalone: true,
  imports: [PageTitleComponent, NouisliderModule, FormsModule],
  templateUrl: './range-slider.component.html',
})
export class RangeSliderComponent {
  range = [-500, 500]
  skipRange = [20, 90]

  skipConfig = {
    connect: true,
    range: {
      min: 0,

      '10%': 10,
      '20%': 20,
      '30%': 30,
      // Nope, 40 is no fun.
      '50%': 50,
      '60%': 60,
      '70%': 70,
      // I never liked 80.
      '90%': 90,
      max: 100,
    },
    snap: true,
    // start: [20, 90],
  }


  basicSliderconfig = {
    behaviour: 'drag',
    connect: true,
    // start: 124,
    range: {
      min: [0],
      max: [255],
    },
  }

  softSliderConfig = {
    connect: true,
    // start: 124,
    range: {
      min: [-1000],
      max: [1000],
    },
    pips: {
      mode: 'values',
      values: [20, 80],
      density: 4
    }
  }

  verticalRangeSlider1 = {
    // start: [40, 60],
    orientation: 'vertical',
    behaviour: 'drag',
    connect: true,
    range: {
      min: 0,
      max: 100
    },
  }

  verticalRangeSlider2 = {
    // start: 40,
    orientation: 'vertical',
    behaviour: 'drag',
    connect: 'upper',
    range: {
      min: 0,
      max: 100
    },
  }

  verticalRangeSlider3 = {
    // start: 10,
    orientation: 'vertical',
    behaviour: 'drag',
    tooltips: true,
    range: {
      min: 0,
      max: 100
    }
  }
}
