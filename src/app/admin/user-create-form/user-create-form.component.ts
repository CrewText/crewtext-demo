import { Component, OnInit } from '@angular/core';
import md5 from 'md5';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

let emailInput: HTMLInputElement;
let avatarImg: HTMLImageElement;
let gravatarEmailInfo$: any;

@Component({
  selector: 'app-user-create-form',
  templateUrl: './user-create-form.component.html',
  styleUrls: ['./user-create-form.component.css']
})
export class UserCreateFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //@ts-ignore
    $('#userCreateForm').form()

    emailInput = <HTMLInputElement>document.getElementById('emailInput')
    avatarImg = <HTMLImageElement>document.getElementById('avatar')

    fromEvent(emailInput, 'input')
      .pipe(map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        debounceTime(50),
        filter(text => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(text)),
        distinctUntilChanged()
      )
      .subscribe(text => {
        avatarImg.src = `https://www.gravatar.com/avatar/${md5(text)}?d=mp`

        fetch(`https://en.gravatar.com/${md5(text)}.json`, { redirect: "follow", method: "GET" })
          .then(response => response.ok ? response.json() : null)
          .then(data => {
            if (data != null) {
              let profile = data["entry"][0]

              if (profile["name"]["givenName"]) { (<HTMLInputElement>document.getElementById('firstName')).value = profile["name"]["givenName"] }
              if (profile["name"]["familyName"]) { (<HTMLInputElement>document.getElementById('lastName')).value = profile["name"]["familyName"] }
            }
          })
      })
  }

  resetForm() {
    //@ts-ignore
    $('#userCreateForm').form('reset')
    avatarImg.src = "https://www.gravatar.com/avatar/0?d=mp"
  }

}
