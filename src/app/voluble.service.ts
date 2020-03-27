import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface JSONApiResponse {
  data: any | any[]
  [key: string]: any
}

interface ContactResponse extends JSONApiResponse {

}

@Injectable({
  providedIn: 'root'
})
export class VolubleService {
  volubleApiBaseUrl: "http://localhost:5000/v1"
  authToken: string

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  getContacts(organization_id: string, auth_token: string): Observable<ContactResponse> {
    return this.http.get<ContactResponse>(`http://localhost:5000/v1/orgs/${organization_id}/contacts`,
      {
        responseType: "json",
        headers: { 'Authorization': `Bearer ${auth_token}` }
      })
  }
}
