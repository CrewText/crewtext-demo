import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { BasicUser } from './basic-user';
import Axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {
  constructor(private authSvc: AuthService) { }

  getUser(org_id: string, user_id: string, auth_token: string): Promise<BasicUser> {
    return fetch(`${environment.auth0_proxy_base}/auth0/users/${org_id}/${user_id}`,
      {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${auth_token}` }
      })
      .then(async resp => {
        let json = await resp.json()
        if (!resp.ok) { throw new Error((json).errors[0].detail) }
        return json
      })
  }

  getUsers(org_id: string, auth_token: string): Observable<BasicUser[]> {
    return new Observable(observer => {
      fetch(`${environment.auth0_proxy_base}/auth0/users/${org_id}`,
        {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${auth_token}` }
        })
        .then(async resp => {
          if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
          return resp.json()
        })
        .then(respJson => {
          observer.next(respJson)
          observer.complete()
        })
    })
  }
}
