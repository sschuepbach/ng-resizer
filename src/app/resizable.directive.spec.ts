import {ResizableDirective} from './resizable.directive';
import {ElementRef, Renderer2} from '@angular/core';

describe('ResizableDirective', () => {
  it('should create an instance', () => {
    const renderer: Renderer2 = undefined;
    const elref: ElementRef = {nativeElement: undefined};
    const directive = new ResizableDirective(renderer, elref);
    expect(directive).toBeTruthy();
  });
});
