import { Component, inject, Renderer2, type OnDestroy, type OnInit } from '@angular/core';
import { AuthLogoComponent } from "@components/auth-logo.component";
import { credits, currentYear } from '@common/constants';
import { calculateTimeToEvent } from '@core/helper/utils';
import { interval, type Subscription } from 'rxjs';

@Component({
  selector: 'coming-soon',
  standalone: true,
  imports: [AuthLogoComponent],
  templateUrl: './coming-soon.component.html',
  styles: ``
})
export class ComingSoonComponent implements OnInit, OnDestroy {
  currentYear = currentYear
  credits=credits

  _days?: number
  _hours?: number
  _minutes?: number
  _seconds?: number
  countdown: { days: number; hours: number; minutes: number; seconds: number } =
    {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  private intervalSubscription!: Subscription
  private renderer = inject(Renderer2)

  ngOnInit(): void {
    this.countdown = calculateTimeToEvent()
    this.intervalSubscription = interval(1000).subscribe(() => {
      this.countdown = calculateTimeToEvent()
    })
    this.renderer.addClass(document.body, 'h-100')
  }

  ngOnDestroy(): void {
    this.intervalSubscription.unsubscribe()
    this.renderer.removeClass(document.body, 'h-100')
  }


}
