import { Component } from '@angular/core';
import { SelectComponent } from '../select/select.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [SelectComponent, SearchComponent],
})
export class NavbarComponent {
}
