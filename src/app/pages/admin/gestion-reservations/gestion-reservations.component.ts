import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../models/reservation.model';

@Component({
  selector: 'app-gestion-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gestion-reservations.component.html',
  styleUrls: ['./gestion-reservations.component.css']
})
export class GestionReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;
  actionEnCours: number | null = null;

  // Filtres
  searchTerm = '';
  statutFilter: string = 'TOUS';

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement réservations', err);
        this.error = 'Impossible de charger les réservations';
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

  applyFilters(): void {
    let filtered = this.reservations;

    // Filtre par statut
    if (this.statutFilter !== 'TOUS') {
      filtered = filtered.filter(r => r.statut === this.statutFilter);
    }

    // Filtre par recherche (client ou salle)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.user.nom.toLowerCase().includes(term) ||
        r.salle.nom.toLowerCase().includes(term) ||
        r.user.email.toLowerCase().includes(term)
      );
    }

    // Trier par date (plus récent d'abord)
    filtered.sort((a, b) =>
      new Date(b.dateReservation).getTime() - new Date(a.dateReservation).getTime()
    );

    this.filteredReservations = filtered;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statutFilter = 'TOUS';
    this.applyFilters();
  }

  validerReservation(id: number): void {
    this.actionEnCours = id;
    this.reservationService.validerReservation(id).subscribe({
      next: () => {
        const reservation = this.reservations.find(r => r.id === id);
        if (reservation) {
          reservation.statut = 'VALIDEE';
        }
        this.applyFilters();
        this.successMessage = 'Réservation validée avec succès';
        this.actionEnCours = null;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        console.error('Erreur validation', err);
        this.error = err.error?.error || 'Erreur lors de la validation';
        this.actionEnCours = null;
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  refuserReservation(id: number): void {
    this.actionEnCours = id;
    this.reservationService.refuserReservation(id).subscribe({
      next: () => {
        const reservation = this.reservations.find(r => r.id === id);
        if (reservation) {
          reservation.statut = 'REFUSEE';
        }
        this.applyFilters();
        this.successMessage = 'Réservation refusée';
        this.actionEnCours = null;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        console.error('Erreur refus', err);
        this.error = err.error?.error || 'Erreur lors du refus';
        this.actionEnCours = null;
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  supprimerReservation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      this.actionEnCours = id;
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.reservations = this.reservations.filter(r => r.id !== id);
          this.applyFilters();
          this.successMessage = 'Réservation supprimée avec succès';
          this.actionEnCours = null;
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          this.error = err.error?.error || 'Erreur lors de la suppression';
          this.actionEnCours = null;
          setTimeout(() => this.error = null, 3000);
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
}
