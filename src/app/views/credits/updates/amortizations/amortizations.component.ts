import { Component } from '@angular/core';
import { AmortizationDto, AmortizationService } from '@core/services/amortization.service';
import { PageTitleComponent } from "@components/page-title.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-amortizations',
  imports: [CommonModule,
      FormsModule,
      PageTitleComponent],
  templateUrl: './amortizations.component.html',
  styleUrl: './amortizations.component.scss'
})
export class AmortizationsComponent {
  amortizations: AmortizationDto[] = [];
  filteredAmortizations: AmortizationDto[] = [];
  searchTerm: string = '';

  constructor(private amortizationService: AmortizationService) { }

  ngOnInit(): void {
    this.fetchAmortizations();
  }

  fetchAmortizations(): void {
    this.amortizationService.getAllAmortization().subscribe({
      next: (response) => {
        this.amortizations = response;
        this.filteredAmortizations = [...this.amortizations];
      },
      error: (err) => {
        console.error('Error al obtener amortizaciones', err);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredAmortizations = this.amortizations.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }
}
