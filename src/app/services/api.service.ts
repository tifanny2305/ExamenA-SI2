import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: string = "http://localhost:8081";
  tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          console.log(response.token);
          this.setToken(response.token);
        }
      }),
      catchError(err => {
        console.error('Error en el login:', err);
        throw err;
      })
    );
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  // --------------------------- Materia

  getAllMaterias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/materia/findAll`);
  }

  getMateriaById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/materia/find/${id}`);
  }

  createMateria(nombre: string): Observable<any> {
    if (!this.isAuthenticated()) {
      return throwError('Token is invalid or expired');
    }

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/api/materia/save`, { nombre: nombre }, { headers: headers })
      .pipe(
        catchError(error => {
          console.error('Error al crear la materia:', error);
          return throwError(error);
        })
      );
  }

  updateMateria(id: string, materia: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/api/materia/update/${id}`, materia, { headers, responseType: 'text' as 'json' }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error desconocido al actualizar la materia';
        if (error.error instanceof ErrorEvent) {
          // Error del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del servidor
          errorMessage = `Error: ${error.status}: ${error.error.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }

  deleteMateria(id: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/api/materia/delete/${id}`, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error desconocido al eliminar la materia';
          if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = `Error del cliente: ${error.error.message}`;
          } else {
            // Error del servidor
            errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
          }
          console.error('Error completo:', error);
          return throwError(errorMessage);
        })
      );
  }

  // --------------------------- Facultad

   getAllFacultades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/facultad/findAll`);
  }

  getFacultadById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/facultad/find/${id}`);
  }

  createFacultad(nombre: string): Observable<any> {
    if (!this.isAuthenticated()) {
      return throwError('Token is invalid or expired');
    }

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/api/facultad/save`, { nombre: nombre }, { headers: headers })
      .pipe(
        catchError(error => {
          console.error('Error al crear la facultad:', error);
          return throwError(error);
        })
      );
  }

  updateFacultad(id: string, facultad: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/api/facultad/update/${id}`, facultad, { headers, responseType: 'text' as 'json' }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error desconocido al actualizar la faculad';
        if (error.error instanceof ErrorEvent) {
          // Error del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del servidor
          errorMessage = `Error: ${error.status}: ${error.error.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }

  deleteFacultad(id: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/api/facultad/delete/${id}`, { headers, responseType: 'text' as 'json'  })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error desconocido al eliminar la faculad';
          if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = `Error del cliente: ${error.error.message}`;
          } else {
            // Error del servidor
            errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
          }
          console.error('Error completo:', error);
          return throwError(errorMessage);
        })
      );
  }

  // --------------------------- Grupo

  getAllGrupos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/grupo/findAll`);
  }

  getGrupoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/grupo/find/${id}`);
  }

  createGrupo(sigla: string): Observable<any> {
    if (!this.isAuthenticated()) {
      return throwError('Token is invalid or expired');
    }

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/api/grupo/save`, { sigla: sigla }, { headers: headers })
      .pipe(
        catchError(error => {
          console.error('Error al crear el grupo:', error);
          return throwError(error);
        })
      );
  }

  updateGrupo(id: string, sigla: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/api/grupo/update/${id}`, sigla, { headers, responseType: 'text' as 'json' }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error desconocido al actualizar el grupo';
        if (error.error instanceof ErrorEvent) {
          // Error del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del servidor
          errorMessage = `Error: ${error.status}: ${error.error.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }

  deleteGrupo(id: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/api/grupo/delete/${id}`, { headers, responseType: 'text' as 'json'  })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error desconocido al eliminar el grupo';
          if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = `Error del cliente: ${error.error.message}`;
          } else {
            // Error del servidor
            errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
          }
          console.error('Error completo:', error);
          return throwError(errorMessage);
        })
      );
  }

  // --------------------------- Usuario

  getAllUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/usuario/findAll`);
  }

  getUsuarioById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/usuario/find/${id}`);
  }

  createUsuario(username: string, email: string, password: string): Observable<any> {
    if (!this.isAuthenticated()) {
      return throwError('Token is invalid or expired');
    }

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const usuario = { username, email, password };

    return this.http.post<any>(`${this.apiUrl}/api/createUser`, usuario, { headers })
      .pipe(
        catchError(error => {
          console.error('Error al crear el usuario:', error);
          return throwError(error);
        })
      );
  }

  updateUsuario(id: string, username: string, email: string, password: string): Observable<any> {
    if (!this.isAuthenticated()) {
      return throwError('Token is invalid or expired');
    }

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const usuario = { username, email, password };

    return this.http.put<any>(`${this.apiUrl}/api/usuario/update/${id}`, usuario, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error desconocido al actualizar el usuario';
          if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Error del servidor
            errorMessage = `Error: ${error.status}: ${error.error.message}`;
          }
          console.error(errorMessage);
          return throwError(errorMessage);
        })
      );
  }

  deleteUsuario(id: string): Observable<any> {
    if (!this.isAuthenticated()) {
      return throwError('Token is invalid or expired');
    }

    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete(`${this.apiUrl}/api/usuario/delete/${id}`, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error desconocido al eliminar el usuario';
          if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = `Error del cliente: ${error.error.message}`;
          } else {
            // Error del servidor
            errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
          }
          console.error('Error completo:', error);
          return throwError(errorMessage);
        })
      );
  }
}
