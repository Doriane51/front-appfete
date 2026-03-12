import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SalleService } from '../../core/services/salle.service';
import { Salle } from '../../models/salle.model';

@Component({
  selector: 'app-salles',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './salle.component.html',
  styleUrls: ['./salle.component.css']
})
export class SallesComponent implements OnInit {
  salles: Salle[] = [];
  filteredSalles: Salle[] = [];
  loading = true;

  // Filtres
  searchNom: string = '';
  capaciteMin: number | null = null;
  prixMax: number | null = null;

  // Options pour les selects
  capacitesOptions = [10, 20, 30, 50, 100, 200];
  prixOptions = [50, 100, 200, 500, 1000];

  constructor(private salleService: SalleService) {}

  ngOnInit(): void {
    this.loadSalles();
  }

  loadSalles(): void {
    this.loading = true;
    this.salleService.getAllSalles().subscribe({
      next: (data) => {
        this.salles = data;
        this.filteredSalles = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement salles', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredSalles = this.salles.filter(salle => {
      let match = true;

      // Filtre par nom
      if (this.searchNom) {
        match = match && salle.nom.toLowerCase().includes(this.searchNom.toLowerCase());
      }

      // Filtre par capacité
      if (this.capaciteMin) {
        match = match && salle.capacite >= this.capaciteMin;
      }

      // Filtre par prix
      if (this.prixMax) {
        match = match && salle.prixHeure <= this.prixMax;
      }

      return match;
    });
  }

  resetFilters(): void {
    this.searchNom = '';
    this.capaciteMin = null;
    this.prixMax = null;
    this.filteredSalles = this.salles;
  }
}
