import { SidenavComponent } from '@/app/components/sidenav/sidenav.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';





@Component({
  selector: 'app-mainlayout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidenavComponent],
  templateUrl: './mainlayout.component.html',
  styleUrl: './mainlayout.component.scss'
})
export class MainlayoutComponent {

}
