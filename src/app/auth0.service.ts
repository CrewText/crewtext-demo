import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { BasicUser } from './basic-user';

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

  createUser(org_id: string, first_name: string, last_name: string, avatar_uri: string, email_address: string, auth_token: string, password: string = null) {
    let user_obj = { first_name, last_name, avatar_uri, email: email_address }

    return fetch(`${environment.auth0_proxy_base}/auth0/users/${org_id}`,
      {
        method: "POST",
        headers: { 'Authorization': `Bearer ${auth_token}`, "Content-Type": "application/json" },
        body: JSON.stringify(user_obj)
      })
      .then(async resp => {
        let json = await resp.json()
        if (!resp.ok) { throw new Error((json).errors[0].detail) }
        return json
      })

  }

  /**
   * This only sets up a password reset token - it doesn't send an email. For the full password-reset email
   * process, use the AuthService sendPasswordReset method.
   */
  resetUserPassword(org_id: string, user_id: string, auth_token: string) {
    return fetch(`${environment.auth0_proxy_base}/auth0/users/${org_id}/${user_id}/resetpassword`,
      {
        method: "POST",
        headers: { 'Authorization': `Bearer ${auth_token}` },
      })
      .then(async resp => {
        let json = await resp.json()
        if (!resp.ok) { throw new Error((json).errors[0].detail) }
        return json
      })
  }
}
