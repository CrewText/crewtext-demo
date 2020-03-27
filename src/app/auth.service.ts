import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  public async login() {
    this.authNonce = this.generateAuthNonce()

    let auth_url = "https://voluble-dev.eu.auth0.com/authorize"
    let aud = "https://voluble-poc.herokuapp.com"
    let client_id = "COMAy4nBatqEuGzdTHEzOOc2ucpRywcs"
    let redirect_uri = "http://lvh.me:4200/auth/callback"
    let resp_type = "id_token token"
    let url = encodeURI(`${auth_url}?response_type=${resp_type}&redirect_uri=${redirect_uri}&client_id=${client_id}&audience=${aud}&scope=profile email&nonce=${this.authNonce}`)
    window.location.assign(url)

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

  public set access_token(access_token: string) {
    localStorage.setItem('access_token', access_token)
  }

  public get access_token() {
    return Date.now() > this.access_expire_time * 1000 ? localStorage.getItem('access_token') : null
  }

  public set id_token(id_token: string) {
    localStorage.setItem('id_token', id_token)
  }

  public get id_token() {
    return Date.now() > this.id_expire_time * 1000 ? localStorage.getItem('id_token') : null
  }

  public get access_expire_time(): number {
    return parseInt(localStorage.getItem('accessExpireTime'), 10)
  }

  public set access_expire_time(expire_time) {
    localStorage.setItem('accessExpireTime', expire_time.toString())
  }

  public get id_expire_time(): number {
    return parseInt(localStorage.getItem('id_ExpireTime'), 10)
  }

  public set id_expire_time(expire_time) {
    localStorage.setItem('id_ExpireTime', expire_time.toString())
  }
}
