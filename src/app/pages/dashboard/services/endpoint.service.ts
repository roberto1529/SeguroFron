import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EndPointService {
  protected endpoint: string = `http://localhost:5187/api/Asegurados`;
//   http://localhost:5187/api/Asegurados
  constructor(private http: HttpClient) { }

  public getAll(){
      return this.http.get(this.endpoint);
  }

  public SetUser(dato: any){
    return this.http.post(this.endpoint, dato);
  }

  public PutUser(dato: any, id: string){
    return this.http.put(`${this.endpoint}/${id}`, dato);
  }

  public DelUser(id: string){
    return this.http.delete(`${this.endpoint}/${id}`);
  }


}
