import { act, renderHook } from '@testing-library/react-hooks';

import useResize from '../';
import { isString } from '../../util';

function triggerResize(value: number, target?: string | Element) {
  if (!target) {
    target = document.body;
  } else if (isString(target)) {
    target = document.querySelector(target) || document.body;
  }
  ((target as any).mockWidth as number) = value;

  target.dispatchEvent(new Event('resize'));
}

describe('useResize', () => {
  beforeEach(() => {
    triggerResize(1000);
  });

  it('should call incoming callback', () => {
    const mockFn = jest.fn();
    const mockFnA = jest.fn();
    const mockFnB = jest.fn();

    renderHook(() => useResize(mockFn, 100));

    act(() => {
      triggerResize(90);
    });

    expect(mockFn.mock.calls.length).toBe(1);

    renderHook(() => useResize(mockFnA, 100));

    renderHook(() => useResize(mockFnB, 100));

    act(() => {
      triggerResize(1000);
    });

    expect(mockFn.mock.calls.length).toBe(2);
    expect(mockFnA.mock.calls.length).toBe(1);
    expect(mockFnB.mock.calls.length).toBe(1);
  });

  it('should call incoming callback and it will received a boolean value', () => {
    let mockBroken = true;
    const mockFn = jest.fn((broken: boolean) => (mockBroken = broken));
    renderHook(() => useResize(mockFn, 100));

    act(() => {
      triggerResize(90);
    });
    expect(mockBroken).toBeFalsy();
    expect(mockFn.mock.calls.length).toBe(1);

    act(() => {
      triggerResize(1000);
    });

    expect(mockBroken).toBeTruthy();
    expect(mockFn.mock.calls.length).toBe(2);
  });

  it('should work fine when target is a string selector', () => {
    act(() => {
      const el = document.createElement('div');
      el.classList.add('mock');
      document.body.appendChild(el);
    });

    act(() => {
      triggerResize(1000, '.mockA');
    });

    const mockFn = jest.fn();

    renderHook(() => useResize(mockFn, 100, '.mockA'));

    act(() => {
      triggerResize(90, '.mockA');
    });

    expect(mockFn.mock.calls.length).toBe(1);
  });

  it('should do nothing when the parameters are incomplete', () => {
    const mockFn = jest.fn();
    // disabled for test
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    renderHook(() => useResize(mockFn));

    act(() => {
      triggerResize(90);
    });

    expect(mockFn.mock.calls.length).toBe(0);
  });

  it('should responsive with document.body when target is not found', () => {
    const mockFn = jest.fn();

    renderHook(() => useResize(mockFn, 100, '.mockB'));

    act(() => {
      triggerResize(90, document.body);
    });

    expect(mockFn.mock.calls.length).toBe(1);
  });
});
