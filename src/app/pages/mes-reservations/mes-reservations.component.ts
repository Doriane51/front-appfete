import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../../core/services/reservation.service';
import { AuthService } from '../../core/services/auth.service';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-mes-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mes-reservations.component.html',
  styleUrls: ['./mes-reservations.component.css']
})
export class MesReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true;
  error: string | null = null;
  annulationEnCours: number | null = null;

  constructor(
    private reservationService: ReservationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getMesReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement réservations', err);
        this.error = 'Impossible de charger vos réservations';
        this.loading = false;
      }
    });
  }

  // Convertit "14:30" en [14, 30]
  parseHeure(heure: string): number[] {
    return heure.split(':').map(Number);
  }

  // Calcule la durée en minutes
  calculerDuree(heureDebut: string, heureFin: string): number {
    const debut = this.parseHeure(heureDebut);
    const fin = this.parseHeure(heureFin);
    return (fin[0] * 60 + fin[1]) - (debut[0] * 60 + debut[1]);
  }

  // Formate la durée en "2h" ou "2h 30min"
  formaterDuree(heureDebut: string, heureFin: string): string {
    const duree = this.calculerDuree(heureDebut, heureFin);
    const heures = Math.floor(duree / 60);
    const minutes = duree % 60;
    return minutes > 0 ? `${heures}h ${minutes}min` : `${heures}h`;
  }

  // Calcule le prix total
  calculerPrixTotal(reservation: Reservation): number {
    const duree = this.calculerDuree(reservation.heureDebut, reservation.heureFin);
    return (duree / 60) * reservation.salle.prixHeure;
  }

  annulerReservation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.annulationEnCours = id;
      this.reservationService.annulerReservation(id).subscribe({
        next: () => {
          const reservation = this.reservations.find(r => r.id === id);
          if (reservation) {
            reservation.statut = 'ANNULEE';
          }
          this.annulationEnCours = null;
        },
        error: (err) => {
          console.error('Erreur annulation', err);
          alert(err.error?.error || 'Erreur lors de l\'annulation');
          this.annulationEnCours = null;
        }
      });
    }
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
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatHeure(heure: string): string {
    return heure.substring(0, 5);
  }

  peutAnnuler(statut: string): boolean {
    return statut === 'EN_ATTENTE';
  }
}
