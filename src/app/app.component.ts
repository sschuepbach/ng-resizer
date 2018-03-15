import { Component } from '@angular/core';

@Component({
             selector: 'app-root',
             templateUrl: './app.component.html',
             styleUrls: ['./app.component.css']
           })
export class AppComponent {
  width: number;
  height: number;
  top: number;
  left: number;
  resizing = false;
  dragging = false;

  setWidth(width: number) {
    this.width = width;
  }

  setHeight(height: number) {
    this.height = height;
  }

  setTop(top: number) {
    this.top = top;
  }

  setLeft(left: number) {
    this.left = left;
  }

  setResizing(resizing: boolean) {
    this.resizing = resizing;
  }

  setDragging(dragging: boolean) {
    this.dragging = dragging;
  }
}
