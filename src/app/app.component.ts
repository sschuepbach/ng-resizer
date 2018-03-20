import {Component} from '@angular/core';

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
  showBoundaries = true;
  topBoundary: number;
  bottomBoundary: number;
  leftBoundary: number;
  rightBoundary: number;

  constructor() {
  }

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

  setBoundary(boundary: string, pos: number) {
    if (boundary === 'top') {
      this.topBoundary = pos;
    } else if (boundary === 'bottom') {
      this.bottomBoundary = pos;
    } else if (boundary === 'left') {
      this.leftBoundary = pos;
    } else if (boundary === 'right') {
      this.rightBoundary = pos;
    }
  }

}
