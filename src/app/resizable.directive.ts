import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({selector: '[appResizable]'})
export class ResizableDirective implements OnInit {

  @Input() resizableOnLeft = true;
  @Input() resizableOnRight = true;
  @Input() resizableOnTop = true;
  @Input() resizableOnBottom = true;

  @Output() width = new EventEmitter<number>();
  @Output() height = new EventEmitter<number>();
  @Output() left = new EventEmitter<number>();
  @Output() top = new EventEmitter<number>();
  @Output() resizing = new EventEmitter<boolean>();

  private ne: any;
  private boundarySize = 8;

  private overlay: any;

  private topIsResizable = false;
  private rightIsResizable = false;
  private bottomIsResizable = false;
  private leftIsResizable = false;
  private mouseXOnStart: number;
  private mouseYOnStart: number;
  private elemTopOnStart: number;
  private elemWidthOnStart: number;
  private elemHeightOnStart: number;
  private elemLeftOnStart: number;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.ne = el.nativeElement;
  }

  ngOnInit() {
    this.renderer.setStyle(this.ne, 'height', '50px');
    this.renderer.setStyle(this.ne, 'width', '30%');
    this.width.next(this.ne.offsetWidth);
    this.height.next(this.ne.offsetHeight);
    this.createOverlay();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    this.setResizeCursors(event);
    if (this.topIsResizable) {
      const currentHeight = this.resizeTop(event);
      this.height.next(currentHeight);
    }
    if (this.rightIsResizable) {
      const currentWidth = this.resizeRight(event);
      this.width.next(currentWidth);
    }
    if (this.bottomIsResizable) {
      const currentHeight = this.resizeBottom(event);
      this.height.next(currentHeight);
    }
    if (this.leftIsResizable) {
      const currentWidth = this.resizeLeft(event);
      this.width.next(currentWidth);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    this.setResizeMode(event);
    if (this.isInsideBoundary(event)) {
      this.makeElementTransparent();
      this.enableOverlay();
      this.resizing.emit(true);
    }
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.makeElementOpaque();
    this.disableOverlay();
    this.topIsResizable = this.rightIsResizable = this.bottomIsResizable = this.leftIsResizable = false;
    this.resizing.emit(false);
  }

  private makeElementTransparent() {
      this.renderer.setStyle(this.ne, 'opacity', 0.5);
  }

  private makeElementOpaque() {
    this.renderer.removeStyle(this.ne, 'opacity');
  }

  private createOverlay() {
    this.overlay = this.renderer.createElement('div');
    this.renderer.setStyle(this.overlay, 'position', 'fixed');
    this.renderer.setStyle(this.overlay, 'padding', 0);
    this.renderer.setStyle(this.overlay, 'margin', 0);
    this.renderer.setStyle(this.overlay, 'border', 0);
    this.renderer.setStyle(this.overlay, 'top', 0);
    this.renderer.setStyle(this.overlay, 'left', 0);
    this.renderer.setStyle(this.overlay, 'width', '100%');
    this.renderer.setStyle(this.overlay, 'height', '100%');
    this.renderer.setStyle(this.overlay, 'background', 'rgba(0,0,0,0)');
  }

  private enableOverlay() {
    this.renderer.appendChild(this.ne, this.overlay);
  }

  private disableOverlay() {
    this.renderer.removeChild(this.ne, this.overlay);
  }

  private setResizeMode(event) {
    if (this.isInsideTopRightBoundary(event)) {
      this.makeTopResizable(event);
      this.makeRightResizable(event);
    } else if (this.isInsideBottomRightBoundary(event)) {
      this.makeBottomResizable(event);
      this.makeRightResizable(event);
    } else if (this.isInsideBottomLeftBoundary(event)) {
      this.makeBottomResizable(event);
      this.makeLeftResizable(event);
    } else if (this.isInsideTopLeftBoundary(event)) {
      this.makeTopResizable(event);
      this.makeLeftResizable(event);
    } else if (this.isInsideTopBoundary(event)) {
      this.makeTopResizable(event);
    } else if (this.isInsideRightBoundary(event)) {
      this.makeRightResizable(event);
    } else if (this.isInsideBottomBoundary(event)) {
      this.makeBottomResizable(event);
    } else if (this.isInsideLeftBoundary(event)) {
      this.makeLeftResizable(event);
    }
  }

  private makeTopResizable(event) {
    this.topIsResizable = true;
    this.mouseYOnStart = event.clientY;
    this.elemTopOnStart = this.ne.getBoundingClientRect().top;
    this.elemHeightOnStart = this.ne.offsetHeight;
  }

  private makeRightResizable(event) {
    this.rightIsResizable = true;
    this.mouseXOnStart = event.clientX;
    this.elemWidthOnStart = this.ne.offsetWidth;
  }

  private makeBottomResizable(event) {
    this.bottomIsResizable = true;
    this.mouseYOnStart = event.clientY;
    this.elemHeightOnStart = this.ne.offsetHeight;
  }

  private makeLeftResizable(event) {
    this.leftIsResizable = true;
    this.mouseXOnStart = event.clientX;
    this.elemLeftOnStart = this.ne.getBoundingClientRect().left;
    this.elemWidthOnStart = this.ne.offsetWidth;
  }

  private resizeTop(event): number {
    const currentTop = this.elemTopOnStart + (event.clientY - this.mouseYOnStart);
    const tempHeight = this.elemHeightOnStart - (event.clientY - this.mouseYOnStart);
    const currentHeight = tempHeight > 0 ? tempHeight : 0;
    if (tempHeight >= 0) {
      this.renderer.setStyle(this.ne, 'top', currentTop + 'px');
    }
    this.renderer.setStyle(this.ne, 'height', currentHeight + 'px');
    return currentHeight;
  }

  private resizeRight(event): number {
    const tempWidth = this.elemWidthOnStart + (event.clientX - this.mouseXOnStart);
    const currentWidth = tempWidth > 0 ? tempWidth : 0;
    this.renderer.setStyle(this.ne, 'width', currentWidth + 'px');
    return currentWidth;
  }

  private resizeBottom(event): number {
    const tempHeight = this.elemHeightOnStart + (event.clientY - this.mouseYOnStart);
    const currentHeight = tempHeight > 0 ? tempHeight : 0;
    this.renderer.setStyle(this.ne, 'height', currentHeight + 'px');
    return currentHeight;
  }

  private resizeLeft(event): number {
    const currentLeft = this.elemLeftOnStart + (event.clientX - this.mouseXOnStart);
    const tempWidth = this.elemWidthOnStart - (event.clientX - this.mouseXOnStart);
    const currentWidth = tempWidth > 0 ? tempWidth : 0;
    if (tempWidth >= 0) {
      this.renderer.setStyle(this.ne, 'left', currentLeft + 'px');
    }
    this.renderer.setStyle(this.ne, 'width', currentWidth + 'px');
    return currentWidth;
  }

  private setResizeCursors(event) {
    if (this.isInsideTopRightBoundary(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'nesw-resize');
    } else if (this.isInsideBottomRightBoundary(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'nwse-resize');
    } else if (this.isInsideBottomLeftBoundary(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'nesw-resize');
    } else if (this.isInsideTopLeftBoundary(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'nwse-resize');
    } else if (this.isInsideTopOrBottomBoundary(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'row-resize');
    } else if (this.isInsideLeftOrRightBoundary(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'col-resize');
    } else {
      this.renderer.removeStyle(this.ne, 'cursor');
    }
  }

  private isInsideBoundary(event) {
    return this.isInsideTopOrBottomBoundary(event) || this.isInsideLeftOrRightBoundary(event);
  }

  private isInsideTopOrBottomBoundary(event) {
    return this.isInsideTopBoundary(event) || this.isInsideBottomBoundary(event);
  }

  private isInsideLeftOrRightBoundary(event) {
    return this.isInsideLeftBoundary(event) || this.isInsideRightBoundary(event);
  }

  private isInsideTopRightBoundary(event): boolean {
    return this.isInsideTopBoundary(event) && this.isInsideRightBoundary(event);
  }

  private isInsideBottomRightBoundary(event): boolean {
    return this.isInsideBottomBoundary(event) && this.isInsideRightBoundary(event);
  }

  private isInsideBottomLeftBoundary(event): boolean {
    return this.isInsideBottomBoundary(event) && this.isInsideLeftBoundary(event);
  }

  private isInsideTopLeftBoundary(event): boolean {
    return this.isInsideTopBoundary(event) && this.isInsideLeftBoundary(event);
  }

  private isInsideTopBoundary(event): boolean {
    return this.resizableOnTop && (this.ne.getBoundingClientRect().top + this.boundarySize) > event.clientY;
  }

  private isInsideRightBoundary(event): boolean {
    return this.resizableOnRight && (this.ne.getBoundingClientRect().right - this.boundarySize) < event.clientX;
  }

  private isInsideBottomBoundary(event): boolean {
    return this.resizableOnBottom && (this.ne.getBoundingClientRect().bottom - this.boundarySize) < event.clientY;
  }

  private isInsideLeftBoundary(event): boolean {
    return this.resizableOnLeft && (this.ne.getBoundingClientRect().left + this.boundarySize) > event.clientX;
  }

}
