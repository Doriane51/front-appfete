import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SalleService } from '../../core/services/salle.service';
import { Salle } from '../../models/salle.model';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  salles: Salle[] = [];
  loading = true;

  constructor(private salleService: SalleService) {}

  ngOnInit(): void {
    this.salleService.getAllSalles().subscribe({
      next: (data) => {
        this.salles = data.slice(0, 3); 
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement salles', err);
        this.loading = false;
      }
    });
  }
}
