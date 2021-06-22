import { ImageSourceItem } from 'src/modules/budsies';
import { ComponentWidthCalculator, SizeValue } from 'src/modules/vsf-storyblok-module';
import parseImageDimensions from './parse-image-dimensions';

export default function generateImageSourcesList (
  imageUrl: string,
  componentWidthCalculator: ComponentWidthCalculator,
  doesSupportWebp = true,
  mobileImageUrl?: string,
  width?: string | number
): ImageSourceItem[] {
  const result: ImageSourceItem[] = [];

  const breakpoints = componentWidthCalculator.getBreakpoints();
  const widths = componentWidthCalculator.getWidths();

  let fixedWidth: number | undefined;

  if (width) {
    const value = width.toString().replace(/\px$/, '');
    if (!isNaN(Number(value))) {
      fixedWidth = Number(value);
    }
  }

  let previousWidth = 0;
  let sourceItem: ImageSourceItem | undefined;

  for (const size in widths) {
    const sizeKey = size as SizeValue;

    let width = fixedWidth || widths[sizeKey];

    if (width === previousWidth && sourceItem) {
      sourceItem.breakpoint = breakpoints[sizeKey];
      continue;
    }

    previousWidth = width;

    let src = imageUrl;
    if (
      [SizeValue.xsmall, SizeValue.small].includes(sizeKey) &&
          mobileImageUrl
    ) {
      src = mobileImageUrl;
    }

    const filters = doesSupportWebp ? '/filters:format(webp)' : '';

    const [, resource] = src.split('//a.storyblok.com');
    let dimensions = parseImageDimensions(src);
    const ratio = dimensions.height / dimensions.width;

    sourceItem = {
      breakpoint: breakpoints[sizeKey],
      aspectRatio: 1 / ratio,
      srcset: []
    };

    for (const density of [1, 1.5, 2, 3]) {
      const adjustedWidth = Math.round(width * density / 10) * 10;
      const adjustedHeight = Math.round(adjustedWidth * ratio);

      let mod = '/fit-in';
      mod += `/${adjustedWidth}x${adjustedHeight}`;
      mod += filters;

      const resizedUrl = 'https://img2.storyblok.com' + mod + resource;

      sourceItem.srcset.push(`${resizedUrl}${density > 1 ? ' ' + density + 'x' : ''}`);
    }

    result.push(sourceItem);
  }

  return result;
}
