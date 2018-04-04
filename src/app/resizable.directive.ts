import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2} from '@angular/core';

@Directive({selector: '[appResizable]'})
export class ResizableDirective implements OnInit {

  @Input() resizableOnLeft = true;
  @Input() resizableOnRight = true;
  @Input() resizableOnTop = true;
  @Input() resizableOnBottom = true;
  @Input() topOuterBoundary;
  @Input() rightOuterBoundary;
  @Input() bottomOuterBoundary;
  @Input() leftOuterBoundary;
  @Input() boundarySize = 8;

  @Output() width = new EventEmitter<number>();
  @Output() height = new EventEmitter<number>();
  @Output() left = new EventEmitter<number>();
  @Output() top = new EventEmitter<number>();
  @Output() resizing = new EventEmitter<boolean>();
  @Output() dragging = new EventEmitter<boolean>();

  private ne: any;

  private overlay: any;

  private topIsResizable = false;
  private rightIsResizable = false;
  private bottomIsResizable = false;
  private leftIsResizable = false;
  private isDraggable = false;
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
    this.emitInitialValues();
    this.applyInitialStylesToElement();
    this.createOverlay();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    this.setResizeCursors(event);
    this.setDragCursor(event);
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
    if (this.isDraggable) {
      const [currentLeft, currentTop] = this.dragElement(event);
      this.left.next(currentLeft);
      this.top.next(currentTop);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    this.setResizeMode(event);
    this.setDragMode(event);
    this.makeElementTransparent();
    this.enableOverlay();
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.makeElementOpaque();
    this.disableOverlay();
    this.topIsResizable = this.rightIsResizable = this.bottomIsResizable = this.leftIsResizable = false;
    this.isDraggable = false;
    this.resizing.emit(false);
    this.dragging.emit(false);
    this.top.next(this.ne.getBoundingClientRect().top);
    this.left.next(this.ne.getBoundingClientRect().left);
  }

  private emitInitialValues() {
    this.width.next(this.ne.offsetWidth);
    this.height.next(this.ne.offsetHeight);
    this.top.next(this.ne.getBoundingClientRect().top);
    this.left.next(this.ne.getBoundingClientRect().left);
    this.resizing.next(false);
    this.dragging.next(false);
  }

  private applyInitialStylesToElement() {
    this.renderer.setStyle(this.ne, '-webkit-transition', 'opacity 0.2s ease-in-out');
    this.renderer.setStyle(this.ne, '-moz-transition', 'opacity 0.2s ease-in-out');
    this.renderer.setStyle(this.ne, '-ms-transition', 'opacity 0.2s ease-in-out');
    this.renderer.setStyle(this.ne, '-o-transition', 'opacity 0.2s ease-in-out');
    this.renderer.setStyle(this.ne, 'transition', 'opacity 0.2s ease-in-out');
  }

  private makeElementTransparent() {
    this.renderer.setStyle(this.ne, 'opacity', 0.2);
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

  private makeDraggable(event) {
    this.isDraggable = true;
    this.elemTopOnStart = this.ne.getBoundingClientRect().top;
    this.elemLeftOnStart = this.ne.getBoundingClientRect().left;
    this.mouseXOnStart = event.clientX;
    this.mouseYOnStart = event.clientY;
  }

  private setDragMode(event) {
    if (this.isInsideDragArea(event)) {
      this.dragging.emit(true);
      this.makeDraggable(event);
    }
  }

  private setResizeMode(event) {
    if (this.isInsideBoundary(event)) {
      this.resizing.emit(true);
    }
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
   let currentTop = this.elemTopOnStart + (event.clientY - this.mouseYOnStart);
    let currentHeight = this.elemHeightOnStart - (event.clientY - this.mouseYOnStart);

    currentHeight = currentHeight > 0 ? currentHeight : 0;
    if (this.topOuterBoundary && currentTop < this.topOuterBoundary) {
      currentTop = this.topOuterBoundary;
      currentHeight = this.ne.getBoundingClientRect().bottom - this.topOuterBoundary;
    }
    if (currentHeight >= 0) {
      this.renderer.setStyle(this.ne, 'top', currentTop + 'px');
    }
    this.renderer.setStyle(this.ne, 'height', currentHeight + 'px');
    return currentHeight;
  }

  private resizeRight(event): number {
    let currentWidth = this.elemWidthOnStart + (event.clientX - this.mouseXOnStart);
    currentWidth = currentWidth > 0 ? currentWidth : 0;
    currentWidth = (this.rightOuterBoundary && (this.ne.getBoundingClientRect().left + currentWidth) > this.rightOuterBoundary) ?
      this.rightOuterBoundary - this.ne.getBoundingClientRect().left : currentWidth;
    this.renderer.setStyle(this.ne, 'width', currentWidth + 'px');
    return currentWidth;
  }

  private resizeBottom(event): number {
    let currentHeight = this.elemHeightOnStart + (event.clientY - this.mouseYOnStart);
    currentHeight = currentHeight > 0 ? currentHeight : 0;
    currentHeight = (this.bottomOuterBoundary && (this.ne.getBoundingClientRect().top + currentHeight) > this.bottomOuterBoundary) ?
      this.bottomOuterBoundary - this.ne.getBoundingClientRect().top : currentHeight;
    this.renderer.setStyle(this.ne, 'height', currentHeight + 'px');
    return currentHeight;
  }

  private resizeLeft(event): number {
    let currentLeft = this.elemLeftOnStart + (event.clientX - this.mouseXOnStart);
    let currentWidth = this.elemWidthOnStart - (event.clientX - this.mouseXOnStart);
    currentWidth = currentWidth > 0 ? currentWidth : 0;
    if (this.leftOuterBoundary && currentLeft < this.leftOuterBoundary) {
      currentLeft = this.leftOuterBoundary;
      currentWidth = this.ne.getBoundingClientRect().right - this.leftOuterBoundary;
    }
    if (currentWidth >= 0) {
      this.renderer.setStyle(this.ne, 'left', currentLeft + 'px');
    }
    this.renderer.setStyle(this.ne, 'width', currentWidth + 'px');
    return currentWidth;
  }

  private dragElement(event): [number, number] {
    let currentLeft = this.elemLeftOnStart + (event.clientX - this.mouseXOnStart);
    let currentTop = this.elemTopOnStart + (event.clientY - this.mouseYOnStart);
    [currentLeft, currentTop] =
      this.keepElementInBoundariesWhileDragging(currentLeft, currentTop, this.ne.offsetWidth, this.ne.offsetHeight);
    this.renderer.setStyle(this.ne, 'left', currentLeft + 'px');
    this.renderer.setStyle(this.ne, 'top', currentTop + 'px');
    return [currentLeft, currentTop];
  }

  private keepElementInBoundariesWhileDragging(left: number, top: number, width: number, height: number): [number, number] {

    let finalLeft = left;
    let finalTop = top;

    if (this.rightOuterBoundary && (left + width) > this.rightOuterBoundary) {
      finalLeft = this.rightOuterBoundary - width;
    }

    if (this.bottomOuterBoundary && (top + height) > this.bottomOuterBoundary) {
      finalTop = this.bottomOuterBoundary - height;
    }

    if (this.leftOuterBoundary && left < this.leftOuterBoundary) {
      finalLeft = this.leftOuterBoundary;
    }

    if (this.topOuterBoundary && top < this.topOuterBoundary) {
      finalTop = this.topOuterBoundary;
    }

    return [finalLeft, finalTop];
  }

  private setDragCursor(event) {
    if (this.isInsideDragArea(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'move');
    }
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

  private isInsideDragArea(event): boolean {
    return !this.isInsideBoundary(event);
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
