import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  width: string;
  height: string;

  setWidth(width: string) {
    this.width = width;
  }

  setHeight(height: string) {
    this.height = height;
  }
}
