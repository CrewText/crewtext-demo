import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { VolubleService } from '../../voluble.service';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.css']
})
export class ContactsListComponent implements OnInit {
  contacts: any[]
  constructor(private volubleSvc: VolubleService, public authSvc: AuthService) { }

  errText: string
  public contactDeletePromptName: string

  async ngOnInit() {
    if (!this.authSvc.isLoggedIn || !this.canViewContact) {
      this.errText = "You do not have the privileges to view the contacts."
      return
    }

    this.volubleSvc.contacts.getContacts(this.authSvc.userOrg)
      .then((resp: any | any[]) => {
        if (!Array.isArray(resp.data)) { resp.data = [resp.data] }
        return Promise.all(resp.data.map(async (contact, idx, arr) => {
          if (!contact.relationships.category.data) {
            contact.relationships.category.data = { 'attributes': { 'name': "" } }
            return contact
          } else {
            return this.volubleSvc.categories.getCategory(this.authSvc.userOrg, contact.relationships.category.data.id)
              .then((category_resp) => {
                contact.relationships.category.data = category_resp.data
                return contact
              })
              .catch(e => e)
          }
        })
        )
      })
      .then(contactsOrErrs => {
        contactsOrErrs.forEach(val => { if (val instanceof Error) { throw val } })

        this.contacts = contactsOrErrs
      })
  }

  deleteContact(contact_id: string) {
    for (const ctt of this.contacts) {
      if (ctt.id == contact_id) {
        this.contactDeletePromptName = `${ctt.attributes.first_name} ${ctt.attributes.surname}`
        break
      }
    }

    //@ts-ignore
    $('#deleteModal').modal({
      onApprove: () => {
        this.volubleSvc.contacts.deleteContact(this.authSvc.userOrg, contact_id)
          .then((resp) => {
            window.location.reload()
          })
      }
    })

    //@ts-ignore
    $('#deleteModal').modal('show')
  }

  get canAddContact(): boolean {
    return this.authSvc.isLoggedIn && this.authSvc.hasScope(['contact:add', 'organization:owner', 'voluble:admin'])
  }

  get canViewContact(): boolean {
    return this.authSvc.isLoggedIn && this.authSvc.hasScope(['contact:view', 'organization:owner', 'voluble:admin'])
  }

  get canDeleteContact(): boolean {
    return this.authSvc.isLoggedIn && this.authSvc.hasScope(['contact:delete', 'organization:owner', 'voluble:admin'])
  }
}
