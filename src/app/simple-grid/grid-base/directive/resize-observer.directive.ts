// npm i resize-observer-polyfill

import { Directive, ElementRef, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';

const entriesMap = new WeakMap();

const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    if (entriesMap.has(entry.target)) {
      const comp = entriesMap.get(entry.target);
      comp._resizeCallback(entry);
    }
  }
});

// tslint:disable-next-line: directive-selector
@Directive({ selector: '[resizeObserver]' })
export class ResizeObserverDirective implements OnDestroy {
  // tslint:disable-next-line:no-output-native
  @Output()
  resize = new EventEmitter();

  constructor(private el: ElementRef) {
    const target = this.el.nativeElement;
    entriesMap.set(target, this);
    ro.observe(target);
  }

  _resizeCallback(entry) {
       this.resize.emit(entry);
  }

  ngOnDestroy() {
    const target = this.el.nativeElement;
    ro.unobserve(target);
    entriesMap.delete(target);
  }
}
