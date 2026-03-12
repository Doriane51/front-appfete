import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkSession();
  }

  // Inscription
  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  // Connexion
  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  // Déconnexion
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }

  // Vérifier la session
  checkSession(): void {
    this.http.get<User>(`${this.apiUrl}/me`, {
      withCredentials: true
    }).subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
      },
      error: () => {
        this.currentUserSubject.next(null);
      }
    });
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === 'ADMIN';
  }

  // Récupérer l'utilisateur connecté
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Récupérer l'ID de l'utilisateur connecté
  getCurrentUserId(): number | null {
    const user = this.currentUserSubject.value;
    return user ? user.id! : null;
  }
}
