export abstract class MObject {
  public static getElementPixelSize(elRef: HTMLElement): DOMRect {
    return elRef.getBoundingClientRect();
  }
}
