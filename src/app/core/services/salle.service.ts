import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salle } from '../../models/salle.model';

@Injectable({
  providedIn: 'root'
})
export class SalleService {
  private apiUrl = 'http://localhost:8080/api/salles';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les salles (public)
  getAllSalles(): Observable<Salle[]> {
    return this.http.get<Salle[]>(this.apiUrl);
  }

  // Récupérer une salle par ID (public)
  getSalleById(id: number): Observable<Salle> {
    return this.http.get<Salle>(`${this.apiUrl}/${id}`);
  }

  // Créer une salle (admin seulement)
  createSalle(salle: Salle): Observable<Salle> {
    return this.http.post<Salle>(this.apiUrl, salle, {
      withCredentials: true
    });
  }

  // Modifier une salle (admin seulement)
  updateSalle(id: number, salle: Salle): Observable<Salle> {
    return this.http.put<Salle>(`${this.apiUrl}/${id}`, salle, {
      withCredentials: true
    });
  }

  // Supprimer une salle (admin seulement)
  deleteSalle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  // Rechercher des salles
  searchSalles(nom?: string, capaciteMin?: number, prixMax?: number): Observable<Salle[]> {
    let params: any = {};
    if (nom) params.nom = nom;
    if (capaciteMin) params.capaciteMin = capaciteMin;
    if (prixMax) params.prixMax = prixMax;

    return this.http.get<Salle[]>(`${this.apiUrl}/recherche`, { params });
  }
}
