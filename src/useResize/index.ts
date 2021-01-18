import { useEffect } from 'react';
import { UseResizeConfig } from './type';
import { isFun, isNumber, isString } from '../util';
import ResizeObserver from 'resize-observer-polyfill';
import { genResizeCallback } from './util';

const useResizeInternal = (config: UseResizeConfig) => {
  const { resizeConfig, target } = config;

  useEffect(() => {
    const resizeCallbackArr = resizeConfig
      .filter(({ breakpoint, onBreakpoint }) => isNumber(breakpoint) && isFun(onBreakpoint))
      .map((config) => genResizeCallback(config));

    if (resizeCallbackArr.length === 0) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const {
          contentRect: { width },
        } = entry;
        resizeCallbackArr.forEach((callback) => {
          callback(width);
        });
      }
    });

    let observeTarget = (target as Element) || document.body;

    if (isString(target)) {
      observeTarget = document.querySelector(target as string) || document.body;
    }

    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.disconnect();
    };
  }, [resizeConfig, target]);

  // return nothing
};

const useResize = (onBreakpoint: (broken: boolean) => void, breakpoint: number, target?: string | Element) => {
  useResizeInternal({ resizeConfig: [{ onBreakpoint, breakpoint }], target });
};

export default useResize;
