import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({selector: '[appResizable]'})
export class ResizableDirective implements OnInit {

  @Input() resizableOnLeft = true;
  @Input() resizableOnRight = true;
  @Input() resizableOnTop = true;
  @Input() resizableOnBottom = true;
  @Output() dim = new EventEmitter<[number, number]>();
  private ne: any;
  private boundarySize = 8;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.ne = el.nativeElement;
  }

  ngOnInit() {
    this.renderer.setStyle(this.ne, 'height', '50px');
    this.renderer.setStyle(this.ne, 'width', '30%');
    this.dim.next([
                    this.ne.offsetWidth,
                    this.ne.offsetHeight
                  ]);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    if (this.isInsideTopRightBoundary(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'nesw-resize');
    } else if (this.isInsideBottomRightBoundary(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'nwse-resize');
    } else if (this.isInsideBottomLeftBoundary(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'nesw-resize');
    } else if (this.isInsideTopLeftBoundary(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'nwse-resize');
    } else if (this.isInsideTopBottomBoundaries(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'row-resize');
    } else if (this.isInsideLeftRightBoundaries(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'col-resize');
    } else {
      this.renderer.removeStyle(this.ne, 'cursor');
    }
  }

  private isInsideResizeBoundaries(event) {
    return this.isInsideLeftRightBoundaries(event) || this.isInsideTopBottomBoundaries(event);
  }

  private isInsideTopBottomBoundaries(event) {
    return this.isInsideTopBoundary(event) || this.isInsideBottomBoundary(event);
  }

  private isInsideLeftRightBoundaries(event) {
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
