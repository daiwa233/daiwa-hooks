export interface ResizeConfig {
  breakpoint: number;
  onBreakpoint: (broken: boolean) => void;
}

export interface UseResizeConfig {
  target?: string | Element;
  resizeConfig: ResizeConfig[];
}
