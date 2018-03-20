import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[appBorder]'
})
export class BorderDirective implements OnInit {

  @Input() appBorder: string;
  @Input() boundary: number;
  @Output() pos = new EventEmitter<number>();
  private ne: any;
  private mousedown = false;
  private overlay: any;
  private direction: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.ne = this.el.nativeElement;
  }

  ngOnInit() {
    this.createOverlay();
    this.setDirection();
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(enter) {
    const cursor = this.direction === 'horizontal' ? 'row-resize' : 'col-resize';
    this.renderer.setStyle(this.ne, 'cursor', cursor);
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(enter) {
    this.renderer.removeStyle(this.ne, 'cursor');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event) {
    if (this.mousedown) {
      const axis = (this.direction === 'horizontal') ? 'top' : 'left';
      this.renderer.setStyle(this.ne, axis, this.checkBorder(this.direction === 'vertical' ? event.clientX : event.clientY) + 'px');

    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    this.mousedown = true;
    this.enableOverlay();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event) {
    this.mousedown = false;
    this.disableOverlay();
    this.pos.emit(this.direction === 'horizontal' ? this.ne.getBoundingClientRect().top : this.ne.getBoundingClientRect().left);
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

  private checkBorder(pos: number) {
    if (this.appBorder === 'left' || this.appBorder === 'top') {
      return pos >= this.boundary ? this.boundary : pos;
    } else {
      return pos <= this.boundary ? this.boundary : pos;
    }
  }

  private setDirection() {
    this.direction = (this.appBorder === 'left' || this.appBorder === 'right') ? 'vertical' : 'horizontal';
  }

}
