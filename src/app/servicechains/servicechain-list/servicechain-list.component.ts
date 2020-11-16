import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { VolubleService } from 'src/app/voluble.service';

@Component({
  selector: 'app-servicechain-list',
  templateUrl: './servicechain-list.component.html',
  styleUrls: ['./servicechain-list.component.css']
})
export class ServicechainListComponent implements OnInit {

  constructor(private authSvc: AuthService, private volubleSvc: VolubleService) { }

  servicechains: any[];
  errText: string
  servicechainDeletePromptName: string

  ngOnInit(): void {

    if (!this.authSvc.isLoggedIn || !this.canViewServicechain) {
      this.errText = "You do not have the privileges to view the servicechains."
      return
    }

    const scs = this.volubleSvc.servicechains.getServicechains(this.authSvc.userOrg)
      .subscribe(resp => {
        this.servicechains = resp.data
      })

  }

  deleteServicechain(servicechain_id: string) {
    for (const sc of this.servicechains) {
      if (sc.id == servicechain_id) {
        this.servicechainDeletePromptName = sc.attributes.name
        break
      }
    }

    //@ts-ignore
    $('#deleteModal').modal({
      onApprove: () => {
        this.volubleSvc.servicechains.deleteServicechain(this.authSvc.userOrg, servicechain_id)
          .then((_resp) => {
            window.location.reload()
          })
      }
    })

    //@ts-ignore
    $('#deleteModal').modal('show')
  }

  get canAddServicechain(): boolean {
    return this.authSvc.isLoggedIn && this.authSvc.hasScope(['servicechain:add', 'organization:owner', 'voluble:admin'])
  }

  get canViewServicechain(): boolean {
    return this.authSvc.isLoggedIn && this.authSvc.hasScope(['servicechain:view', 'organization:owner', 'voluble:admin'])
  }

  get canDeleteServicechain(): boolean {
    return this.authSvc.isLoggedIn && this.authSvc.hasScope(['servicechain:delete', 'organization:owner', 'voluble:admin'])
  }

}
