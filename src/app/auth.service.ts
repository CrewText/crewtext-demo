import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  public login() {
    this.authNonce = this.generateAuthNonce()

    let auth_url = `https://voluble-dev.eu.auth0.com/authorize`
    let aud = "https://voluble-poc.herokuapp.com"
    let client_id = environment.auth0_client_id
    let redirect_uri = environment.auth_callback_url
    let resp_type = "id_token token"
    let url = encodeURI(`${auth_url}?response_type=${resp_type}&redirect_uri=${redirect_uri}&client_id=${client_id}&audience=${aud}&scope=profile email openid&nonce=${this.authNonce}`)
    window.location.assign(url)
  }

  public logout() {
    this.access_token = ''
    this.id_token = ''
    this.jwt = ''
    this.userOrg = ''
    this.authNonce = ''
    window.location.assign('/')
  }

  public async sendPasswordReset(user_email: string, auth_token: string) {
    let auth_url = `https://voluble-dev.eu.auth0.com/dbconnections/change_password`
    const resp = await fetch(auth_url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${auth_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: environment.auth0_client_id,
        email: user_email,
        connection: "Username-Password-Authentication"
      })
    });

    let txt = await resp.text();
    if (!resp.ok) { throw new Error(JSON.parse(txt).errors[0].detail); }
    return txt;
  }

  public get isLoggedIn() {
    // return this.auth0.isAuthenticated()
    return !!this.id_token
  }

  public get userOrg(): string {
    return this.id_token["https://crewtext.com/organization"]
  }

  // public get getUser() {

  // }

  public set userOrg(org: string) {
    // TODO: MAKE COMPLIANT WITH GET USER ORG
    if (!org) { sessionStorage.removeItem('organization') }
    else { sessionStorage.setItem('organization', org) }
  }

  private set authNonce(nonce: string) {
    if (!nonce) { sessionStorage.removeItem('authNonce') }
    else { sessionStorage.setItem('authNonce', nonce) }
  }

  private get authNonce() {
    return sessionStorage.getItem('authNonce')
  }

  public generateAuthNonce() {
    return Math.random().toString(32).substr(2, 15) + Math.random().toString(32).substr(2, 15)
  }

  public set access_token(access_token: any) {
    if (!access_token) { sessionStorage.removeItem('access_token') }
    else { sessionStorage.setItem('access_token', JSON.stringify(access_token)) }
  }
  public get access_token() {
    let tok = sessionStorage.getItem('access_token')
    if (!tok) { sessionStorage.removeItem('access_token'); return null }
    let parsed_tok = JSON.parse(tok)
    return Date.now() <= parsed_tok.exp * 1000 ? parsed_tok : null
  }

  public set jwt(jwt: any) {
    if (!jwt) { sessionStorage.removeItem('jwt') }
    else { sessionStorage.setItem('jwt', jwt) }
  }

  public get jwt() {
    return sessionStorage.getItem('jwt')
  }

  public set id_token(id_token: any) {
    if (!id_token) { sessionStorage.removeItem('id_token') }
    else { sessionStorage.setItem('id_token', JSON.stringify(id_token)) }
  }

  public get id_token() {
    let tok = sessionStorage.getItem('id_token')
    if (!tok) { sessionStorage.removeItem('id_token'); return null }
    let parsed_tok = JSON.parse(tok)
    return Date.now() <= parsed_tok.exp * 1000 ? parsed_tok : null
  }

  public hasScope(scopes: string[]) {
    for (const scope of scopes) {
      if (this.access_token.permissions.includes(scope)) { return true }
    }

    return false
  }

  // public set onLoginRedirectUrl(url: string) {
  //   if (!url) { url = "/" }
  //   sessionStorage.setItem('on_login_redirect', url)
  // }

  // public get onLoginRedirectUrl() {
  //   return sessionStorage.getItem('on_login_redirect')
  // }
}
