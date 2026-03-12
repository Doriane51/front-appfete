import { User } from './user.model';
import { Salle } from './salle.model';

export interface Reservation {
  id?: number;
  user: User;
  salle: Salle;
  dateReservation: string;
  heureDebut: string;
  heureFin: string;         
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'ANNULEE' | 'REFUSEE';
  createdAt?: Date;
}

export interface ReservationRequest {
  salleId: number;
  date: string;
  heureDebut: string;
  heureFin: string;
}
