import { ResizeConfig } from './type';

export const genResizeCallback = ({ breakpoint, onBreakpoint }: ResizeConfig) => {
  let sizeBefore = 0;
  return (sizeNow: number) => {
    if (sizeNow > breakpoint && (sizeBefore < breakpoint || sizeBefore === 0)) {
      onBreakpoint(true);
      sizeBefore = sizeNow;
    } else if (sizeNow < breakpoint && (sizeBefore > breakpoint || sizeBefore === 0)) {
      onBreakpoint(false);
      sizeBefore = sizeNow;
    }
  };
};
