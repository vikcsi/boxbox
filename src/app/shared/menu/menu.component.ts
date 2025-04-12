import { AfterViewInit, Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, AfterViewInit {
  @Input() sidenav!: MatSidenav;
  @Input() isLoggedIn: boolean = false;
  @Output() logoutEvent = new EventEmitter<void>();

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  closeMenu() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  logout() {
    this.userService.logout();
    window.location.href = '/home';
  }
}
