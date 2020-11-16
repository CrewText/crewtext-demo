import { Component, OnInit } from '@angular/core';
import { VolubleService } from 'src/app/voluble.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { parsePhoneNumberFromString } from 'libphonenumber-js'

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit {

  servicechains = []
  categories = []
  constructor(private volubleSvc: VolubleService, private authSvc: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.volubleSvc.servicechains.getServicechains(this.authSvc.userOrg)
      .subscribe(resp => {
        this.servicechains = resp['data']
      })

    this.volubleSvc.categories.getCategories(this.authSvc.userOrg)
      .subscribe(resp => {
        this.categories = resp['data']
      })


    //@ts-ignore
    $.fn.form.settings.rules.isPhoneNum = function (value) {
      //@ts-ignore
      let phone_code = $('.ui.form').form('get value', 'phone-number-code')
      let parsed = parsePhoneNumberFromString(`+${phone_code}${value}`)
      if (!parsed) { return false }
      return parsed.isValid() && parsed.countryCallingCode == phone_code
    }

    //@ts-ignore
    $('#phonecode').dropdown({
      ignoreDiacritics: true,
      sortSelect: true,
      // saveRemoteData: false,
      // cache: false,
    })

    //@ts-ignore
    $('#category').dropdown()

    //@ts-ignore
    $('#servicechain').dropdown()

    //@ts-ignore
    $('.ui.form').form({
      fields: {
        'first-name': {
          rules: [{ type: 'empty' }]
        },
        'last-name': {
          rules: [{ type: 'empty' }]
        },
        'phone-number-afterext': {
          rules: [{ type: 'empty' },//]
          {
            //@ts-ignore
            type: `isPhoneNum`,
            prompt: "Phone number is not valid"
          }]
        },
        'email-address': {
          rules: [{ type: 'empty' }, { type: 'email' }]
        },
        'servicechain': {
          rules: [{ type: 'empty' }]
        },
      }
    })
  }

  public sendForm() {
    //@ts-ignore
    $('.ui.form').form('validate form')

    //@ts-ignore
    if ($('.ui.form').form('is valid')) {
      //@ts-ignore
      let vals = $('.ui.form').form('get values',
        ['title', 'first-name', 'last-name', 'phone-number-code', 'phone-number-afterext', 'email-address',
          'category', 'servicechain'])

      this.volubleSvc.contacts.createContact(this.authSvc.userOrg, vals['title'], vals['first-name'],
        vals['last-name'], `+${vals['phone-number-code']}${vals['phone-number-afterext']}`,
        vals['email-address'], vals['servicechain'] || null,
        vals['category'] || null)
        .then(resp => {
          this.router.navigateByUrl('/contacts')
        })
        .catch(e => {
          console.log(e.message)
        })
    }
  }

}
