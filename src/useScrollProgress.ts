import { useEffect, useState, useRef, useCallback } from 'react';

const MIN_VAL = 0,
      MAX_VAL = 100,
      DEFAULT_DETECT_VALUE = false,
      DEFAULT_USE_TARGET_ELEMENT = false,
      DEFAULT_PRECISION = 3;

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

interface ScrollOptions {
  detectByElementBottom?: boolean;
  precision?: number;
}

interface TargetElementOptions extends ScrollOptions {
  targetElement?: React.MutableRefObject<any>;
}

interface UseTargetElementOptions extends ScrollOptions {
  useTargetElement?: boolean;
}

type UseScrollOptions = XOR<TargetElementOptions, UseTargetElementOptions>;

type ScrollValues = {
  progressString: string;
  progressNumber: number;
  targetElement?: React.MutableRefObject<any>;
}

type UseScrollProgress = (options?: UseScrollOptions) => ScrollValues;

export const useScrollProgress: UseScrollProgress = (options = {}) => {
  const {
    targetElement = null,
    useTargetElement = DEFAULT_USE_TARGET_ELEMENT,
    detectByElementBottom = DEFAULT_DETECT_VALUE,
    precision = DEFAULT_PRECISION,
  } = options;
  const [ scrollPercentage, setScrollPercentage ] = useState(0);

  const targetElementRef = useRef<any>(null);
  const prevScrolledValue = useRef<null | number>(null);
  const prevHeightValue = useRef<null | number>(null);

  const getDocumentDimensions = useCallback(() => {
    const element = document.documentElement;

    const scrolled = document.body.scrollTop || element.scrollTop;
    const height = element.scrollHeight - element.clientHeight;

    return { scrolled, height }
  }, []);


  const getTargetElementDimensions = useCallback(() => {
    const element = useTargetElement ? targetElementRef.current : targetElement?.current;

    const { top, height } = element.getBoundingClientRect();
    const scrolled = Math.max(top * -1, 0);

    return {
      scrolled,
      height: ((height < window.innerHeight) || !detectByElementBottom) ? height : height - window.innerHeight
    }
  }, [detectByElementBottom, useTargetElement])


  const getDimensions = useCallback(() => {
    return (targetElement || useTargetElement) ? getTargetElementDimensions() : getDocumentDimensions()
  }, [ targetElement, useTargetElement, getTargetElementDimensions, getDocumentDimensions ])

  const setScrollValue = useCallback(() => {
    const { scrolled, height } = getDimensions();

    // Getting previous values from refs
    const prevScrolled = prevScrolledValue.current;
    const prevHeight = prevHeightValue.current;

    // Preventing second rerender if doc.height changes and scroll appears or hides
    // By default it will be renders twice:
    // 1. On document height changes (calling setScrollValue from observer)
    // 2. On scrollbar hides or appears (calling setScrollValue from 'scroll' listener)
    if (
      prevScrolled !== null &&
      prevScrolled === scrolled &&
      prevHeight !== null &&
      prevHeight === height
    ) {
      return;
    }

    // Updating "cached" values
    prevScrolledValue.current = scrolled;
    prevHeightValue.current = height;

    // Returning MIN_VAL if there is nothing to scroll
    const scrollPercentageValue = Math.min(height > 0 ? (scrolled / height * MAX_VAL) : MIN_VAL, MAX_VAL);

    setScrollPercentage(+scrollPercentageValue.toFixed(precision));
  }, [getDimensions]);


  // Observe the body's height
  useEffect(() => {
    // create an Observer instance
    // @ts-ignore
    const resizeObserver = new ResizeObserver(setScrollValue);

    const observableElement = targetElement ? targetElement.current : document.documentElement;

    // start observing a DOM node
    resizeObserver.observe(observableElement)

    return () => {
      resizeObserver.unobserve(observableElement);
    }
  }, [targetElement, setScrollValue]);


  useEffect(() => {
    window.addEventListener('scroll', setScrollValue);
    return () => window.removeEventListener('scroll', setScrollValue);
  }, [setScrollValue]);


  return {
    progressString: `${scrollPercentage}%`,
    progressNumber: scrollPercentage,
    ...(useTargetElement ? { targetElement: targetElementRef } : null),
  };
};