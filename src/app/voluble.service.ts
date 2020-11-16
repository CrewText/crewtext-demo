import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category, Contact, Message, MessageDirections, Servicechain, Service, User, Org } from 'voluble-common';
import { AuthService } from './auth.service';

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

  contacts = {
    getContacts: async (organization_id: string): Promise<JSONApiResponses<Contact>> => {
      const resp = await fetch(`${environment.voluble.api_base}/orgs/${organization_id}/contacts`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    },

    getContact: async (organization_id: string, contact_id: string): Promise<JSONApiResponse<Contact>> => {
      const resp = await fetch(`${environment.voluble.api_base}/orgs/${organization_id}/contacts/${contact_id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      });
      let json = await resp.json();
      if (!resp.ok) { throw new Error(json.errors[0].detail); }
      return <JSONApiResponse<Contact>>json;
    },

    createContact: async (organization_id: string, title: string, first_name: string, last_name: string,
      phone_number: string, email_address: string, default_servicechain?: string, category?: string): Promise<JSONApiResponse<Contact>> => {
      let body = {
        title: title,
        first_name: first_name, surname: last_name,
        phone_number: phone_number, email_address: email_address
      }

      if (default_servicechain) { body['servicechain'] = default_servicechain }
      if (category) { body['category'] = category }

      let url = `${environment.voluble.api_base}/orgs/${organization_id}/contacts`
      const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Authorization': `Bearer ${this.authSvc.jwt}`,
          'Content-Type': `application/json`
        }
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    },

    deleteContact: async (organization_id: string, contact_id: string) => {
      let url = `${environment.voluble.api_base}/orgs/${organization_id}/contacts/${contact_id}`
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return void 0;
    }
  }

  messages = {
    getMessageCount: async (organization_id: string, startDate: Date = new Date(1000), endDate: Date = new Date()) => {
      let url = `${environment.voluble.api_base}/orgs/${organization_id}/messages/count?start_timestamp=${Math.floor(startDate.getTime() / 1000)}&end_timestamp=${Math.floor(endDate.getTime() / 1000)}`
      const resp = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    },

    getMessage: async (organization_id: string, message_id: string): Promise<JSONApiResponse<Message>> => {
      let url = new URL(`${environment.voluble.api_base}/orgs/${organization_id}/messages/${message_id}`)
      const resp = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    },

    getMessages: async (organization_id: string, direction: MessageDirections = null): Promise<JSONApiResponses<Message>> => {
      let url = new URL(`${environment.voluble.api_base}/orgs/${organization_id}/messages`)
      if (direction) { url.searchParams.append('direction', direction) }
      url.searchParams.append('to_date', Math.floor(new Date().getTime() / 1000).toString());
      const resp = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    },

    getMessageReplies: async (organization_id: string, message_id: string): Promise<JSONApiResponses<Message>> => {
      let url = new URL(`${environment.voluble.api_base}/orgs/${organization_id}/messages/${message_id}/replies`)
      const resp = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    },

    sendMessage: async (organization_id: string, contact_id: string, message_body: string, is_reply_to?: string): Promise<JSONApiResponse<Message>> => {
      let url = `${environment.voluble.api_base}/orgs/${organization_id}/messages`
      let data = {
        contact: contact_id,
        body: message_body
      }
      if (is_reply_to) { data['is_reply_to'] = is_reply_to }

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authSvc.jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    }
  }

  servicechains = {
    getServicechains: (organization_id: string): Observable<JSONApiResponses<Servicechain>> => {
      let url = `${environment.voluble.api_base}/orgs/${organization_id}/servicechains`
      return <Observable<JSONApiResponses<Servicechain>>>this.http.get(url, {
        responseType: 'json',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      })
    },

    createServicechain: async (organization_id: string, sc_name: string, svc_prio_list: { service: string, priority: number }[]) => {
      let url = `${environment.voluble.api_base}/orgs/${organization_id}/servicechains`

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authSvc.jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          services: svc_prio_list,
          name: sc_name
        })
      });

      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    },

    deleteServicechain: async (organization_id: string, servicechain_id: string): Promise<void> => {
      let url = `${environment.voluble.api_base}/orgs/${organization_id}/servicechains/${servicechain_id}`
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return void 0;
    }
  }

  services = {
    getServices: async (): Promise<JSONApiResponses<Service>> => {
      const resp = await fetch(`${environment.voluble.api_base}/services`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      })
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    },

  }

  categories = {
    getCategories: (organization_id: string) => {
      let url = `${environment.voluble.api_base}/orgs/${organization_id}/categories`
      return this.http.get(url, {
        responseType: 'json',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      })
    },

    getCategory: async (organization_id: string, category_id: string): Promise<JSONApiResponse<Category>> => {
      let url = `${environment.voluble.api_base}/orgs/${organization_id}/categories/${category_id}`
      const resp = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    }
  }

  users = {
    getUserSelf: (user_id: string) => {
      let url = `${environment.voluble.api_base}/users/${user_id}`
      return fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      })
      // .then(resp: async => {
      //   if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail) }
      //   return resp.json()
      // })
    },

    createUser: async (organization_id: string, user_id: string): Promise<JSONApiResponse<User>> => {
      let url = `${environment.voluble.api_base}/orgs/${organization_id}/users`
      let data = {
        id: user_id
      }

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authSvc.jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    }
  }

  organizations = {
    getOrg: async (organization_id: string): Promise<JSONApiResponse<Org>> => {
      let url = `${environment.voluble.api_base}/orgs/${organization_id}`
      const resp = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${this.authSvc.jwt}` }
      });
      if (!resp.ok) { throw new Error((await resp.json()).errors[0].detail); }
      return resp.json();
    }
  }

  /**
   * Gets a resource relative to the API base URL.
   * @param {string} resource_url The URL of the resource to fetch, relative to the API base url, such as those provided in JSON:API 'links' objects
  */
  async getResourceAt<T>(resource_url: string): Promise<JSONApiResponse<T>> {
    const resp = await fetch(`${environment.voluble.api_base}${resource_url}`);
    let json = await resp.json();
    if (!resp.ok) { throw new Error(json.errors[0].detail); }
    return <JSONApiResponse<T>>json;
  }
}
