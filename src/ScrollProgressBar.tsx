import React, { useMemo } from 'react';
import { useScrollProgress } from './useScrollProgress';

const DEFAULT_STYLES = {
  POSITION: 'fixed',
  TOP: 0,
  LEFT: 0,
  HEIGHT: '5px',
  WIDTH: '100%',
  BACKGROUND_COLOR: '#EEEEEE',
  SHOW_BAR_SHADOW: true,
  SHOW_STRIPES: true,
  PROGRESS_COLOR_FROM: '#319197',
  COLORS: ['#319197', '#fb7319']
}

type ScrollOptions = {
  targetElement?: React.MutableRefObject<any>;
  detectByElementBottom?: boolean;
}

type ScrollProgressBarProps = {
  scrollOptions?: ScrollOptions
  styles?: Pick<React.CSSProperties, 'height' | 'width' | 'position' | 'top' | 'left'> & {
    backgroundColor?: React.CSSProperties['color'];
    colors?: React.CSSProperties['color'][];
    showStripes?: boolean;
    showBarShadow?: boolean;
  }
};

const ScrollProgressBar:React.FC<ScrollProgressBarProps> = ({ scrollOptions, styles = {} }) => {
  const { progressNumber } = useScrollProgress(scrollOptions);
  const {
    position = DEFAULT_STYLES.POSITION,
    top = DEFAULT_STYLES.TOP,
    left = DEFAULT_STYLES.LEFT,
    height = DEFAULT_STYLES.HEIGHT,
    width = DEFAULT_STYLES.WIDTH,
    backgroundColor = DEFAULT_STYLES.BACKGROUND_COLOR,
    colors = DEFAULT_STYLES.COLORS,
    showStripes = DEFAULT_STYLES.SHOW_STRIPES,
    showBarShadow = DEFAULT_STYLES.SHOW_BAR_SHADOW
  } = styles;

  const gradient = useMemo(() => {
    if (colors.length === 0) return DEFAULT_STYLES.COLORS;
    if (colors.length === 1) return [...colors, ...colors];
    return colors;
  }, [colors]);

  return (
    <>
      <progress max="100" value={progressNumber} />

      <style jsx>{`
        progress[value] {
          '-webkit-appearance': none;
          '-moz-appearance': none;
          appearance: none;
          border: none;
          color: blue;
        }

        progress[value]::-webkit-progress-bar {
          border-radius: 1px;
        }

        progress[value]::-webkit-progress-value {
          border-radius: 2px;
        }

        progress[value]::-moz-progress-bar {
          border-radius: 2px;
        }
      `}</style>

      <style jsx>{`
        progress[value] {
          position: ${position};
          top: ${top};
          left: ${left};
          height: ${height};
          width: ${width};
        }

        progress[value]::-webkit-progress-bar {
          background-color: ${backgroundColor};
          box-shadow: ${showBarShadow ? '0 1px 3px rgba(0, 0, 0, 0.15) inset' : 'unset'};
        }

        progress[value]::-webkit-progress-value {
          background-image:
            ${showStripes ? '-webkit-linear-gradient(-45deg, transparent 33%, rgba(0, 0, 0, .08) 33%, rgba(0,0, 0, .08) 66%, transparent 66%),' : ''}
            -webkit-linear-gradient(left, ${gradient.join(', ')});
            background-size: ${showStripes ? '40px 24px,' : ''} 100% 100%;
        };

        progress[value]::-moz-progress-bar {
          background-image:
            ${showStripes ? '-moz-linear-gradient(135deg, transparent 33%, rgba(0, 0, 0, .08) 33%, rgba(0,0, 0, .08) 66%, transparent 66%),' : ''}
            -moz-linear-gradient(left, ${gradient.join(', ')});
            background-size: ${showStripes ? '40px 24px,' : ''} 100% 100%;
        }
      `}</style>
    </>
  );
};

export default ScrollProgressBar;