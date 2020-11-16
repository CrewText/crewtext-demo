import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { VolubleService } from 'src/app/voluble.service';

@Component({
  selector: 'app-servicechain-editor',
  templateUrl: './servicechain-editor.component.html',
  styleUrls: ['./servicechain-editor.component.css']
})
export class ServicechainEditorComponent implements OnInit {

  constructor(private volubleSvc: VolubleService, private authSvc: AuthService, private router: Router) { }
  services = []

  async ngOnInit(): Promise<void> {
    this.services = (await this.volubleSvc.services.getServices()).data
  }

  async sendForm() {
    const sc_name = (document.getElementById("sc-name") as HTMLInputElement).value
    const svcs = Array.from((document.getElementById("new-svc-list") as HTMLDivElement).children)
      .map((el, idx) => { return { service: el.id, priority: idx + 1 } });

    await this.volubleSvc.servicechains.createServicechain(this.authSvc.userOrg, sc_name, svcs)
    this.router.navigateByUrl('/servicechains')

  }

  handleDragStart(e: DragEvent) {
    e.dataTransfer.setData("text/plain", (e.target as HTMLDivElement).id)
    e.dataTransfer.dropEffect = "move"
    // e.preventDefault()
  }
  handleDragOver(e: DragEvent) {
    if (["new-svc-list", "existing-svcs-list"].includes((e.target as HTMLDivElement).id)) {
      e.preventDefault()
    }

  }
  handleDragEnd(e: DragEvent) {
    e.preventDefault();
    (e.target as HTMLDivElement).appendChild(document.getElementById(e.dataTransfer.getData("text/plain")))
  }

}
