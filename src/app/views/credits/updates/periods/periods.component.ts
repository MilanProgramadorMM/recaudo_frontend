import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from "@components/page-title.component";
import { PeriodDto, PeriodService } from '@core/services/perdiod.service';

@Component({
  selector: 'app-periods',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageTitleComponent
  ],
  templateUrl: './periods.component.html',
  styleUrl: './periods.component.scss'
})
export class PeriodsComponent {
  periods: PeriodDto[] = [];
  filteredPeriods: PeriodDto[] = [];
  searchTerm: string = '';

  constructor(private periodService: PeriodService) {}

  ngOnInit(): void {
    this.fetchPeriods();
  }

  fetchPeriods(): void {
    this.periodService.getAllPeriods().subscribe({
      next: (response) => {
        this.periods = response;
        this.filteredPeriods = [...this.periods];
      },
      error: (err) => {
        console.error('Error al obtener periodos', err);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPeriods = this.periods.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }
}
