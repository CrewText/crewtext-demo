import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  public login() {
    this.authNonce = this.generateAuthNonce()

    let auth_url = "https://voluble-dev.eu.auth0.com/authorize"
    let aud = "https://voluble-poc.herokuapp.com"
    let client_id = "COMAy4nBatqEuGzdTHEzOOc2ucpRywcs"
    let redirect_uri = "http://lvh.me:4200/auth/callback"
    let resp_type = "id_token token"
    let url = encodeURI(`${auth_url}?response_type=${resp_type}&redirect_uri=${redirect_uri}&client_id=${client_id}&audience=${aud}&scope=profile email&nonce=${this.authNonce}`)
    window.location.assign(url)
  }

  public logout() {
    this.access_token = ''
    this.id_token = ''
    this.jwt = ''
  }

  public get isLoggedIn() {
    // return this.auth0.isAuthenticated()
    return !!this.id_token
  }

  public get userOrg(): string {
    return localStorage.getItem('organization')
  }

  public set userOrg(org: string) {
    localStorage.setItem('organization', org)
  }

  private set authNonce(nonce: string) {
    localStorage.setItem('authNonce', nonce)
  }

  private get authNonce() {
    return localStorage.getItem('authNonce')
  }

  public generateAuthNonce() {
    return Math.random().toString(32).substr(2, 15) + Math.random().toString(32).substr(2, 15)
  }

  public set access_token(access_token: any) {
    localStorage.setItem('access_token', JSON.stringify(access_token))
  }

  public set jwt(jwt: any) {
    localStorage.setItem('jwt', jwt)
  }

  public get jwt() {
    return localStorage.getItem('jwt')
  }

  public get access_token() {
    let tok = localStorage.getItem('access_token')
    if (!tok) { localStorage.removeItem('access_token'); return null }
    let parsed_tok = JSON.parse(tok)
    return Date.now() <= parsed_tok.exp * 1000 ? parsed_tok : null
  }

  public set id_token(id_token: any) {
    localStorage.setItem('id_token', JSON.stringify(id_token))
  }

  public get id_token() {
    let tok = localStorage.getItem('id_token')
    if (!tok) { localStorage.removeItem('id_token'); return null }
    let parsed_tok = JSON.parse(tok)
    return Date.now() <= parsed_tok.exp * 1000 ? parsed_tok : null
  }
}
