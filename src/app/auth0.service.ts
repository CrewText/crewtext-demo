import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

interface BasicUser {
  picture?: string
  given_name?: string
  family_name?: string
  name?: string
}

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {
  constructor(private authSvc: AuthService) { }

  getUser(user_id: string): Promise<BasicUser> {
    return fetch(`${environment.auth0_proxy_base}/auth0/users/${user_id}`)
      .then(async resp => {
        let json = await resp.json()
        if (!resp.ok) { throw new Error((json).errors[0].detail) }
        return json
      })
  }
}
