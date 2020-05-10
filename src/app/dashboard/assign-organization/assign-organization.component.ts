import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-organization',
  templateUrl: './assign-organization.component.html',
  styleUrls: ['./assign-organization.component.css']
})
export class AssignOrganizationComponent implements OnInit {

  constructor() { }
  step_id: number = 1

  ngOnInit(): void {
    //@ts-ignore
    $('#signUpSegment').transition('hide')
    for (let i = 2; i < 4; i++) {
      //@ts-ignore
      $(`#step_${i}`).transition('hide')
    }
  }

  scrollToSignUp() {
    //document.getElementById('signUpSegment').scrollIntoView({ behavior: 'smooth' })
    //@ts-ignore
    $('#mastheadSegment').transition('scale out', function () {
      //@ts-ignore
      $('#signUpSegment').transition('scale in')
    })
  }

  transitionBetweenSteps(fromStep: number, toStep: number) {
    //@ts-ignore
    $(`#step_${fromStep}`).transition('scale out', function () {
      //@ts-ignore
      $(`#step_${toStep}`).transition('scale in')
    })
  }
}