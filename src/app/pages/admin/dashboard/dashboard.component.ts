import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SalleService } from '../../../core/services/salle.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { AuthService } from '../../../core/services/auth.service';
import { Salle } from '../../../models/salle.model';
import { Reservation } from '../../../models/reservation.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalSalles: 0,
    totalReservations: 0,
    reservationsEnAttente: 0,
    reservationsValidees: 0,
    reservationsAnnulees: 0,
    chiffreAffaires: 0
  };

  dernieresReservations: Reservation[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private salleService: SalleService,
    private reservationService: ReservationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    // Charger les salles
    this.salleService.getAllSalles().subscribe({
      next: (salles) => {
        this.stats.totalSalles = salles.length;
      },
      error: (err) => console.error('Erreur chargement salles', err)
    });

    // Charger toutes les réservations
    this.reservationService.getAllReservations().subscribe({
      next: (reservations) => {
        this.stats.totalReservations = reservations.length;
        this.stats.reservationsEnAttente = reservations.filter(r => r.statut === 'EN_ATTENTE').length;
        this.stats.reservationsValidees = reservations.filter(r => r.statut === 'VALIDEE').length;
        this.stats.reservationsAnnulees = reservations.filter(r => r.statut === 'ANNULEE' || r.statut === 'REFUSEE').length;

        // Calculer le chiffre d'affaires (réservations validées)
        this.stats.chiffreAffaires = reservations
          .filter(r => r.statut === 'VALIDEE')
          .reduce((total, r) => {
            const debut = r.heureDebut.split(':').map(Number);
            const fin = r.heureFin.split(':').map(Number);
            const duree = (fin[0] * 60 + fin[1]) - (debut[0] * 60 + debut[1]);
            return total + (duree / 60) * r.salle.prixHeure;
          }, 0);

        // Dernières 5 réservations
        this.dernieresReservations = reservations
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .slice(0, 5);

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement dashboard', err);
        this.error = 'Impossible de charger les données du dashboard';
        this.loading = false;
      }
    });
  }

  getStatutBadgeClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'VALIDEE': return 'bg-green-100 text-green-800';
      case 'ANNULEE': return 'bg-red-100 text-red-800';
      case 'REFUSEE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'VALIDEE': return 'Validée';
      case 'ANNULEE': return 'Annulée';
      case 'REFUSEE': return 'Refusée';
      default: return statut;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
