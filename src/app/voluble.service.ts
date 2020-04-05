import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact, Message } from 'voluble-common';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

interface JSONApiResponse<T> {
  data: {
    id: string
    attributes: T
    relationships: { [key: string]: any }
  }[]

  [key: string]: any
}

// interface ContactResponse extends JSONApiResponse {
//   data: {
//     attributes: Contact | Contact[]
//     relationships: { [key: string]: any }
//   }[]
// }

// interface MessageResponse extends JSONApiResponse {
//   data: {
//     attributes: Message | Message[]
//     relationships: { [key: string]: any }
//   }[]
// }

@Injectable({
  providedIn: 'root'
})
export class VolubleService {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  getContacts(organization_id: string) {
    return fetch(`${environment.voluble.api_base}/orgs/${organization_id}/contacts`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    })
      .then(async resp => {
        if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
        return resp.json()
      })
  }

  getContact(organization_id: string, contact_id: string): Promise<JSONApiResponse<Contact>> {
    return fetch(`${environment.voluble.api_base}/orgs/${organization_id}/contacts/${contact_id}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    })
      .then(async resp => {
        let json = await resp.json()
        if (!resp.ok) { throw new Error(json.errors[0].detail) }
        return <JSONApiResponse<Contact>>json
      })
  }

  getMessageCount(organization_id: string, startDate: Date = new Date(1000), endDate: Date = new Date()) {
    let url = `${environment.voluble.api_base}/orgs/${organization_id}/messages/count?start_timestamp=${startDate.valueOf() / 1000}&end_timestamp=${endDate.valueOf() / 1000}`
    return this.http.get<any>(url,
      {
        responseType: 'json',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      })
  }

  getServicechains(organization_id: string) {
    let url = `${environment.voluble.api_base}/orgs/${organization_id}/servicechains`
    return this.http.get(url, {
      responseType: 'json',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    })
  }

  getCategories(organization_id: string) {
    let url = `${environment.voluble.api_base}/orgs/${organization_id}/categories`
    return this.http.get(url, {
      responseType: 'json',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    })
  }

  getCategory(organization_id: string, category_id: string) {
    let url = `${environment.voluble.api_base}/orgs/${organization_id}/categories/${category_id}`
    return fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    }).then(async resp => {
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
      return resp.json()
    })
  }

  createContact(organization_id: string, title: string, first_name: string, last_name: string, phone_number: string, email_address: string, default_servicechain?: string, category?: string) {
    let body = {
      title: title,
      first_name: first_name, surname: last_name,
      phone_number: phone_number, email_address: email_address
    }

    if (default_servicechain) { body['servicechain'] = default_servicechain }
    if (category) { body['category'] = category }

    let url = `${environment.voluble.api_base}/orgs/${organization_id}/contacts`
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Authorization': `Bearer ${this.authSvc.jwt}`,
        'Content-Type': `application/json`
      }
    })
      .then(async resp => {
        if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
        return resp.json()
      })
  }

  deleteContact(organization_id: string, contact_id: string) {
    let url = `${environment.voluble.api_base}/orgs/${organization_id}/contacts/${contact_id}`
    return fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    })
      .then(async resp => {
        if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
        return void 0
      })
  }

  getUserSelf(user_id: string) {
    let url = `${environment.voluble.api_base}/users/${user_id}`
    return fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    })
    // .then(async resp => {
    //   if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
    //   return resp.json()
    // })
  }

  getInboundMessages(organization_id: string): Promise<JSONApiResponse<Message>> {
    let url = `${environment.voluble.api_base}/orgs/${organization_id}/messages?direction=INBOUND&to_date=${Date.now() / 1000 - new Date().getTimezoneOffset() * 60}`
    return fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    })
      .then(async resp => {
        if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
        return resp.json()
      })
  }
}
