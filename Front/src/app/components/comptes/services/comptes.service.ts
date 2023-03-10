import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ModalMoviments } from 'src/app/shared/models/modal.model';
import { RequestEndpoints } from '../../../shared/config/api.constant';

@Injectable({
  providedIn: 'root',
})
export class ComptesService {
  constructor(private http: HttpClient) {}

  getMoviment(id): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    return this.http.get(RequestEndpoints.MOVE + '/' + id, { headers });
  }

  getMoviments(): Observable<any> {
    return this.http.get(RequestEndpoints.MOVE);
  }

  getMovimentsDelMes(mes: any, any: any): Observable<any> {
    let params = new HttpParams().set('month', mes).set('year', any);
    return this.http.get(RequestEndpoints.MOM, { params });
  }

  createMovement(form: ModalMoviments, mes: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify({ form, mes });
    console.log(body);
    return this.http.post(RequestEndpoints.MOVE, body, { headers }).pipe(
      map(async (item: any) => {
        console.log(item);
        return item;
      }),
      catchError((error) => throwError(error))
    );
  }

  updateMovement(id, form): any {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(form);
    console.log(id);
    console.log(form);
    return (
      this.http
        .put(RequestEndpoints.MOVE + `/${id}`, form)
        .subscribe((data) => {
          console.log(data);
        }),
      catchError((error) => throwError(error))
    );
  }

  deleteMovement(id): any {
    console.log(id);
    return this.http.delete(RequestEndpoints.MOVE + '/' + id).pipe(
      map(async (item: any) => {
        console.log(item);
        return item;
      }),
      catchError((error) => throwError(error))
    );
  }

  deleteMovements(id: any): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = id;
    return this.http.post(RequestEndpoints.MOVES, body, { headers }).pipe(
      map(async (item: any) => {
        return item;
      }),
      catchError((error) => throwError(error))
    );
  }

  // SALDO //
  getSaldo(): Observable<any> {
    return this.http.get(RequestEndpoints.SALDO);
  }

  updateSaldo(id, saldo): any {
    const headers = { 'content-type': 'application/json' };
    const body = { id, saldo };
    console.log(id);
    console.log(saldo);
    return (
      this.http
        .put(RequestEndpoints.SALDO + `/${id}`, saldo)
        .subscribe((data) => {
          console.log(data);
        }),
      catchError((error) => throwError(error))
    );
  }
}
