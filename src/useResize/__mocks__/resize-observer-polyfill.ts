/**
 * just for useResize usage
 */
export default class {
  callback?: (entries: any) => void;
  target: Element;
  constructor(callback: (entries: any) => void) {
    this.callback = callback;
    this.target = document.body;
  }
  observe(target) {
    this.target = target || document.body;
    target.addEventListener('resize', this._internal);
  }

  _internal = (e) => {
    const { target } = e;
    this.callback && this.callback([{ contentRect: { width: target.mockWidth } }]);
  };

  disconnect() {
    this.target.removeEventListener('resize', this._internal);
    delete this.callback;
  }
}
