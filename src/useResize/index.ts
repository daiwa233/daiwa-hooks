import { useEffect } from 'react';
import { UseResizeConfig, UseResizeProps } from './type';
import { isFun, isNumber, isObject, isString } from '../util';
import ResizeObserver from 'resize-observer-polyfill';
import { genResizeCallback } from './util';

const EMPTY_TARGET_KEY = 'empty';

const useResizeInternal = (config: UseResizeConfig) => {
  const { resizeConfig, target } = config;

  useEffect(() => {
    if (!Array.isArray(resizeConfig)) {
      throw new Error(`UseResizeConfig Error: expected array but got ${typeof resizeConfig}`);
    }

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

const genUseResize = () => {
  const configs: Record<string | symbol, UseResizeProps[]> = {};
  return (onBreakpoint: (broken: boolean) => void, breakpoint: number, target?: string | Element) => {
    if (!target) {
      if (!configs[EMPTY_TARGET_KEY]) {
        configs[EMPTY_TARGET_KEY] = [];
      }
      configs[EMPTY_TARGET_KEY].push({ onBreakpoint, breakpoint });
    } else if (isString(target)) {
      if (!configs[target]) {
        configs[target] = [];
      }
      configs[target].push({ onBreakpoint, breakpoint });
    } else if (isObject(target)) {
      const key: any = Symbol(target.toString());
      configs[key] = ([] as UseResizeProps[]).concat({ onBreakpoint, breakpoint, target });
    } else {
      throw new Error('the type of target is not expected');
    }

    Object.keys(configs).forEach((key) => {
      if (typeof key === 'symbol') {
        useResizeInternal({ resizeConfig: configs[key], target: configs[key][0].target });
      } else if (key === EMPTY_TARGET_KEY) {
        useResizeInternal({ resizeConfig: configs[key] });
      } else {
        useResizeInternal({ resizeConfig: configs[key], target: key });
      }
    });
  };
};

const useResize = genUseResize();

export default useResize;
