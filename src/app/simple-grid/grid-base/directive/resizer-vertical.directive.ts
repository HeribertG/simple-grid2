import { Directive, HostListener, ElementRef, Input, OnInit, AfterViewInit, OnDestroy, EventEmitter, Output, Renderer2 } from '@angular/core';
import { MObject } from 'src/app/helpers/object-helper';


@Directive({
  selector: '[appResizerVerticale]'
})
export class ResizerVerticalDirective implements OnInit, AfterViewInit, OnDestroy {


  private diff = 0;

  oldX = 0;
  grabber = false;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2) { }


  @Input() leftElement: HTMLElement;
  @Input() parentElement: HTMLElement;
  @Input() rightElement: HTMLElement;
  @Input() minLeft: number | null;
  @Input() minRight: number | null;
  @Output() changeSize = new EventEmitter();

  right: number;

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
  }

  ngAfterViewInit(): void {
    this.resizerVertical(0);
  }

  ngOnDestroy(): void { }



  @HostListener('document:mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])


  onMouseMove(event) {
    if (!this.grabber) {
      return;
    }


    event.preventDefault();

    let clientX = 0;
    if (event.touches) {
      clientX = event.touches[0].clientX;
    } else {

      clientX = event.clientX;
    }
    // console.log('onMouseMove', event, clientX, this.right, this.oldX);

    this.resizerVertical(clientX - this.oldX);
    this.oldX = clientX;
    this.renderer.setStyle(document.body, 'cursor', 'e-resize');

  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.grabber = false;

    this.renderer.setStyle(document.body, 'cursor', 'default');

    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
  }

  resizerVertical(offsetX: number) {


    const leftRect = MObject.getElementPixelSize(this.leftElement);
    const parentRect = MObject.getElementPixelSize(this.parentElement);
    const boderRect = MObject.getElementPixelSize(this.el.nativeElement);

    this.right += offsetX ;

    let tmpLeftWidth = this.right - leftRect.left;

    if (this.minLeft) {
      if (tmpLeftWidth < this.minLeft) { tmpLeftWidth = this.minLeft; }
    }

    const tmpWidth = parentRect.width - boderRect.width;
    let tmpRightWidth = tmpWidth - tmpLeftWidth;
    if (this.minRight) {
      if (tmpRightWidth < this.minRight) {
        const diff = this.minRight - tmpRightWidth;
        tmpRightWidth = this.minRight;
        tmpLeftWidth -= diff;
        this.right -= diff;

      }
    }

    this.renderer.setStyle(this.leftElement, 'width', tmpLeftWidth + 'px');
    this.renderer.setStyle(this.el.nativeElement, 'left', this.right + 'px');

    this.renderer.setStyle(this.rightElement, 'width', tmpRightWidth + 'px');

    if (this.grabber) { this.dataChange(); }

  }


  @HostListener('document:mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event) {



    event.preventDefault();

    const targetElement = event.target as HTMLElement;
    if (targetElement === this.el.nativeElement as HTMLElement) {

      this.setRight(event.clientX);

      this.grabber = true;

      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'grey');

      if (event.touches) {

        this.oldX = event.touches[0].clientX;
      } else {

        this.oldX = event.clientX;
      }

    }
  }

  private setRight(deltaX: number) {
    const r: ClientRect = this.el.nativeElement.getBoundingClientRect();
    this.diff = deltaX - r.left;
    this.right = r.left + this.diff;
  }

  private dataChange() {
    this.changeSize.emit();
  }


}
