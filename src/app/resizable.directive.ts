import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective implements OnInit {

  @Input() resizableOnLeft = true;
  @Input() resizableOnRight = true;
  @Input() resizableOnTop = true;
  @Input() resizableOnBottom = true;
  @Output() dim = new EventEmitter<[number, number]>();
  private ne: any;

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
    if (this.isInsideResizeBoundary(event)) {
      this.renderer.setStyle(this.ne, 'cursor', 'resize');
    } else {
      this.renderer.removeStyle(this.ne, 'cursor');
    }
  }

  private isInsideResizeBoundary(event) {
    return (this.resizableOnTop && event.clientY < this.getTopResizeBoundary()) ||
      (this.resizableOnRight && event.clientX > this.getRightResizeBoundary()) ||
      (this.resizableOnBottom && event.clientY > this.getBottomResizeBoundary()) ||
      (this.resizableOnLeft && event.clientX < this.getLeftResizeBoundary());
  }

  private getBottomResizeBoundary(): number {
    return this.ne.getBoundingClientRect().bottom - 16;
  }

  private getTopResizeBoundary(): number {
    return this.ne.getBoundingClientRect().top + 16;
  }

  private getLeftResizeBoundary(): number {
    return this.ne.getBoundingClientRect().left + 16;
  }

  private getRightResizeBoundary(): number {
    return this.ne.getBoundingClientRect().right - 16;
  }

}
