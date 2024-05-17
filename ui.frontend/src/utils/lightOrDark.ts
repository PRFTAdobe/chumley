import { colord } from 'colord';

const lightOrDark = (color: string) => {
  const colorSpace = colord(color);
  if (colorSpace.isLight()) {
    return 'light';
  }
  if (colorSpace.alpha() <= 0.5) {
    return 'light';
  }
  return 'dark';
};

export default lightOrDark;
