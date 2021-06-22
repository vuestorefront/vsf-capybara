import { ComponentWidthCalculator, SizeValue } from 'src/modules/vsf-storyblok-module';
import BreakpointSpec from './interfaces/breakpoint-spec.interface';

export default function generateBreakpointsSpecs (
  imageUrl: string,
  componentWidthCalculator: ComponentWidthCalculator,
  mobileImageUrl?: string,
  width?: string | number
): BreakpointSpec[] {
  const result: BreakpointSpec[] = [];

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
  let sourceItem: BreakpointSpec | undefined;

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

    sourceItem = {
      breakpoint: breakpoints[sizeKey],
      width,
      src
    };

    result.push(sourceItem);
  }

  return result;
}
