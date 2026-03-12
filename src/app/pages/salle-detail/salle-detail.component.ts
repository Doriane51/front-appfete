import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SalleService } from '../../core/services/salle.service';
import { ReservationService } from '../../core/services/reservation.service';
import { AuthService } from '../../core/services/auth.service';
import { Salle } from '../../models/salle.model';

@Component({
  selector: 'app-salle-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './salle-detail.component.html',
  styleUrls: ['./salle-detail.component.css']
})
export class SalleDetailComponent implements OnInit {
  salle: Salle | null = null;
  loading = true;
  error: string | null = null;

  // Réservation
  showReservationForm = false;
  reservation = {
    date: '',
    heureDebut: '',
    heureFin: ''
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Galerie
  selectedImageIndex = 0;
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salleService: SalleService,
    private reservationService: ReservationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID récupéré:', id);
    if (id) {
      this.loadSalle(+id);
    } else {
      this.error = 'ID de salle manquant';
      this.loading = false;
    }
  }

  loadSalle(id: number): void {
    this.loading = true;
    console.log('Chargement salle ID:', id);

    this.salleService.getSalleById(id).subscribe({
      next: (data) => {
        console.log('Salle chargée:', data);
        this.salle = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = 'Impossible de charger la salle';
        this.loading = false;
      }
    });
  }

  // Galerie
  nextImage(): void {
    if (this.salle?.images?.length) {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.salle.images.length;
    }
  }

  previousImage(): void {
    if (this.salle?.images?.length) {
      this.selectedImageIndex = (this.selectedImageIndex - 1 + this.salle.images.length) % this.salle.images.length;
    }
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  // Réservation
  openReservationForm(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/connexion'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }
    this.showReservationForm = true;
  }

  closeReservationForm(): void {
    this.showReservationForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.reservation = { date: '', heureDebut: '', heureFin: '' };
    this.successMessage = null;
    this.errorMessage = null;
  }

  submitReservation(): void {
    if (!this.salle) return;

    if (!this.reservation.date || !this.reservation.heureDebut || !this.reservation.heureFin) {
      this.errorMessage = 'Tous les champs sont requis';
      return;
    }

    if (this.reservation.heureDebut >= this.reservation.heureFin) {
      this.errorMessage = "L'heure de fin doit être après l'heure de début";
      return;
    }

    const reservationData = {
      salleId: this.salle.id!,
      date: this.reservation.date,
      heureDebut: this.reservation.heureDebut,
      heureFin: this.reservation.heureFin
    };

    this.reservationService.createReservation(reservationData).subscribe({
      next: () => {
        this.successMessage = 'Réservation effectuée avec succès !';
        setTimeout(() => this.closeReservationForm(), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Erreur lors de la réservation';
      }
    });
  }
}
