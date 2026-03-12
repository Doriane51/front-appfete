import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SalleService } from '../../../core/services/salle.service';
import { Salle } from '../../../models/salle.model';

@Component({
  selector: 'app-gestion-salles',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gestion-salles.component.html',
  styleUrls: ['./gestion-salles.component.css']
})
export class GestionSallesComponent implements OnInit {
  salles: Salle[] = [];
  filteredSalles: Salle[] = [];
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;

  // Modal
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  currentSalle: Salle = this.getEmptySalle();

  // Recherche
  searchTerm = '';

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
        this.error = 'Impossible de charger les salles';
        this.loading = false;
      }
    });
  }

  getEmptySalle(): Salle {
    return {
      nom: '',
      description: '',
      adresse: '',
      capacite: 0,
      prixHeure: 0,
      images: [],
      equipements: []
    };
  }

  // Recherche
  filterSalles(): void {
    if (!this.searchTerm) {
      this.filteredSalles = this.salles;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredSalles = this.salles.filter(salle =>
      salle.nom.toLowerCase().includes(term) ||
      salle.adresse.toLowerCase().includes(term)
    );
  }

  // Modal
  openAddModal(): void {
    this.modalMode = 'add';
    this.currentSalle = this.getEmptySalle();
    this.showModal = true;
  }

  openEditModal(salle: Salle): void {
    this.modalMode = 'edit';
    this.currentSalle = { ...salle }; // Copie pour ne pas modifier l'original
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.successMessage = null;
    this.error = null;
  }

  // Gestion des images (string)
  addImage(): void {
    if (!this.currentSalle.images) {
      this.currentSalle.images = [];
    }
    this.currentSalle.images.push('');
  }

  removeImage(index: number): void {
    this.currentSalle.images.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Gestion des équipements
  addEquipement(): void {
    if (!this.currentSalle.equipements) {
      this.currentSalle.equipements = [];
    }
    this.currentSalle.equipements.push('');
  }

  removeEquipement(index: number): void {
    this.currentSalle.equipements.splice(index, 1);
  }

  // Sauvegarde
  saveSalle(): void {
    // Validation
    if (!this.currentSalle.nom || !this.currentSalle.description || !this.currentSalle.adresse) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    if (this.currentSalle.capacite <= 0 || this.currentSalle.prixHeure <= 0) {
      this.error = 'La capacité et le prix doivent être positifs';
      return;
    }

    // Filtrer les chaînes vides
    this.currentSalle.images = this.currentSalle.images.filter(img => img.trim() !== '');
    this.currentSalle.equipements = this.currentSalle.equipements.filter(eq => eq.trim() !== '');

    if (this.modalMode === 'add') {
      this.salleService.createSalle(this.currentSalle).subscribe({
        next: (newSalle) => {
          this.salles.push(newSalle);
          this.filterSalles();
          this.successMessage = 'Salle ajoutée avec succès';
          setTimeout(() => this.closeModal(), 1500);
        },
        error: (err) => {
          console.error('Erreur création', err);
          this.error = err.error?.error || 'Erreur lors de la création';
        }
      });
    } else {
      this.salleService.updateSalle(this.currentSalle.id!, this.currentSalle).subscribe({
        next: (updatedSalle) => {
          const index = this.salles.findIndex(s => s.id === updatedSalle.id);
          if (index !== -1) {
            this.salles[index] = updatedSalle;
          }
          this.filterSalles();
          this.successMessage = 'Salle modifiée avec succès';
          setTimeout(() => this.closeModal(), 1500);
        },
        error: (err) => {
          console.error('Erreur modification', err);
          this.error = err.error?.error || 'Erreur lors de la modification';
        }
      });
    }
  }

  // Suppression
  deleteSalle(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      this.salleService.deleteSalle(id).subscribe({
        next: () => {
          this.salles = this.salles.filter(s => s.id !== id);
          this.filterSalles();
          this.successMessage = 'Salle supprimée avec succès';
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          this.error = err.error?.error || 'Erreur lors de la suppression';
          setTimeout(() => this.error = null, 3000);
        }
      });
    }
  }
}
