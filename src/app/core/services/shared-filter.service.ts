import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ZonaResponseDto } from './zona.service';

export interface DashboardFilters {
    zona: string;
    zonaId: number | undefined;
    fechaInicio: string;
    fechaFin: string;
}

@Injectable({
    providedIn: 'root'
})
export class SharedFilterService {
    private readonly today = new Date().toLocaleDateString('en-CA');

    private filtersSubject = new BehaviorSubject<DashboardFilters>({
        zona: 'all',
        zonaId: undefined,
        fechaInicio: this.today,
        fechaFin: this.today
    });

    private zonasSubject = new BehaviorSubject<ZonaResponseDto[]>([]);

    filters$: Observable<DashboardFilters> = this.filtersSubject.asObservable();
    zonas$: Observable<ZonaResponseDto[]> = this.zonasSubject.asObservable();

    setFilters(filters: Partial<DashboardFilters>): void {
        const currentFilters = this.filtersSubject.value;
        this.filtersSubject.next({ ...currentFilters, ...filters });
    }

    setZonas(zonas: ZonaResponseDto[]): void {
        this.zonasSubject.next(zonas);
    }

    getFilters(): DashboardFilters {
        return this.filtersSubject.value;
    }

    getZonas(): ZonaResponseDto[] {
        return this.zonasSubject.value;
    }

    // Método helper para obtener zonaId por value
    getZonaIdByValue(zonaValue: string): number | undefined {
        if (zonaValue === 'all') return undefined;
        const zona = this.zonasSubject.value.find(z => z.value === zonaValue);
        return zona?.id;
    }
}