import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, ReservationRequest } from '../../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) { }

  // Client : créer une réservation
  createReservation(reservation: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation, {
      withCredentials: true
    });
  }

  // Client : voir ses réservations
  getMesReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/mes-reservations`, {
      withCredentials: true
    });
  }

  // Client : annuler une réservation
  annulerReservation(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/annuler`, {}, {
      withCredentials: true
    });
  }

  // Admin : voir toutes les réservations
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/admin/toutes`, {
      withCredentials: true
    });
  }

  // Admin : voir les réservations en attente
  getReservationsEnAttente(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/admin/en-attente`, {
      withCredentials: true
    });
  }

  // Admin : valider une réservation
  validerReservation(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/${id}/valider`, {}, {
      withCredentials: true
    });
  }

  // Admin : refuser une réservation
  refuserReservation(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/${id}/refuser`, {}, {
      withCredentials: true
    });
  }

  // Admin : supprimer une réservation
  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/${id}`, {
      withCredentials: true
    });
  }
}
