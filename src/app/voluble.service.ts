import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact, Message, MessageDirections, Servicechain, Category } from 'voluble-common';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

interface JSONApiResponseResource<T> {
  id: string
  attributes: T
  relationships: { [key: string]: any }
}

interface JSONApiResponses<T> {
  data: JSONApiResponseResource<T>[]
  [key: string]: any
}
interface JSONApiResponse<T> {
  data: JSONApiResponseResource<T>
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class VolubleService {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  /**
   * Gets a resource relative to the API base URL.
   * @param {string} resource_url The URL of the resource to fetch, relative to the API base url, such as those provided in JSON:API 'links' objects
  */
  getResourceAt<T>(resource_url: string): Promise<JSONApiResponse<T>> {
    return fetch(`${environment.voluble.api_base}${resource_url}`)
      .then(async resp => {
        let json = await resp.json()
        if (!resp.ok) { throw new Error(json.errors[0].detail) }
        return <JSONApiResponse<T>>json
      })
  }

  getContacts(organization_id: string): Promise<JSONApiResponses<Contact>> {
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

  getCategory(organization_id: string, category_id: string): Promise<JSONApiResponse<Category>> {
    let url = `${environment.voluble.api_base}/orgs/${organization_id}/categories/${category_id}`
    return fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    }).then(async resp => {
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
      return resp.json()
    })
  }

  createContact(organization_id: string, title: string, first_name: string, last_name: string,
    phone_number: string, email_address: string, default_servicechain?: string, category?: string): Promise<JSONApiResponse<Contact>> {
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

  getMessage(organization_id: string, message_id: string): Promise<JSONApiResponse<Message>> {
    let url = new URL(`${environment.voluble.api_base}/orgs/${organization_id}/messages/${message_id}`)
    return fetch(url.toString(), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    })
      .then(async resp => {
        if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
        return resp.json()
      })
  }

  getMessages(organization_id: string, direction: MessageDirections = null): Promise<JSONApiResponses<Message>> {
    let url = new URL(`${environment.voluble.api_base}/orgs/${organization_id}/messages`)
    if (direction) { url.searchParams.append('direction', direction) }
    url.searchParams.append('to_date', (Date.now() / 1000 - new Date().getTimezoneOffset() * 60).toString());
    return fetch(url.toString(), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    })
      .then(async resp => {
        if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
        return resp.json()
      })
  }

  getMessageReplies(organization_id: string, message_id: string): Promise<JSONApiResponses<Message>> {
    let url = new URL(`${environment.voluble.api_base}/orgs/${organization_id}/messages/${message_id}/replies`)
    return fetch(url.toString(), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
    })
      .then(async resp => {
        if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
        return resp.json()
      })
  }

  sendMessage(organization_id: string, contact_id: string, message_body: string, is_reply_to?: string): Promise<JSONApiResponse<Message>> {
    let url = `${environment.voluble.api_base}/orgs/${organization_id}/messages`
    let data = {
      contact: contact_id,
      body: message_body
    }
    if (is_reply_to) { data['is_reply_to'] = is_reply_to }

    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authSvc.jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async resp => {
        if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
        return resp.json()
      })
  }
}
