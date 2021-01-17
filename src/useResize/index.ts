import { useEffect } from 'react';
import { UseResizeConfig } from './type';
import { isFun, isNumber, isObject, isString } from '../util';
import ResizeObserver from 'resize-observer-polyfill';
import { genResizeCallback } from './util';

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
  const configs = new Map();
  return (onBreakpoint: (broken: boolean) => void, breakpoint: number, target?: string | Element) => {
    if (!target) {
      if (!configs.has(document.body)) {
        configs.set(document.body, []);
      }
      configs.get(document.body).push({ onBreakpoint, breakpoint });
    } else if (isString(target) || isObject(target)) {
      if (!configs.has(target)) {
        configs.set(target, []);
      }
      configs.get(target).push({ onBreakpoint, breakpoint });
    } else {
      throw new Error('the type of target is not expected');
    }

    for (const key of configs.keys()) {
      useResizeInternal({ resizeConfig: configs.get(key), target: key });
    }

    useEffect(() => {
      return () => {
        const key = target || document.body;
        const arr = configs.get(key);
        if (arr.length > 1) {
          const idx = arr.findIndex((item) => item.onBreakpoint === onBreakpoint && item.breakpoint === breakpoint);
          idx && arr.splice(idx, 1);
        } else {
          configs.delete(key);
        }
      };
    }, []);
  };
};

const useResize = genUseResize();

export default useResize;
