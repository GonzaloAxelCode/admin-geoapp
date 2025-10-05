

import { DialogcreateconductorComponent } from '@/app/components/Dialogs/dialogcreateconductor/dialogcreateconductor.component';
import { Injectable } from '@angular/core';
import { TuiDialogOptions, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root',
})
export class DialogCreateConductorService {

    constructor(
        private readonly dialogService: TuiDialogService,

    ) { }
    open(): Observable<boolean> {
        const component = new PolymorpheusComponent(DialogcreateconductorComponent);
        const options: Partial<TuiDialogOptions<any>> = {
            label: 'Crear un conductor',
            dismissible: true,
            size: 'm',

        };

        return this.dialogService.open(component, options);
    }
}
