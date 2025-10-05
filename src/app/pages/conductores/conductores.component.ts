import { TableconductoresComponent } from "@/app/components/tableconductores/tableconductores.component";
import { DialogCreateConductorService } from '@/app/services/dialogs-services/dialog-updateproveedor.service';
import { Component, inject } from '@angular/core';
import { TuiAppearance, TuiButton, TuiIcon } from "@taiga-ui/core";

@Component({
  selector: 'app-conductores',
  standalone: true,
  imports: [TableconductoresComponent, TuiButton, TuiAppearance, TuiIcon],
  templateUrl: './conductores.component.html',
  styleUrl: './conductores.component.scss'
})
export class ConductoresComponent {



  private readonly createConductorDialog = inject(DialogCreateConductorService);
  protected showDialogCreateConductor(): void {
    this.createConductorDialog.open().subscribe(() => {

    });
  }


}
