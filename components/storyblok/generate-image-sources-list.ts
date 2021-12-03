import { ImageSourceItem } from 'src/modules/budsies';
import BreakpointSpec from './interfaces/breakpoint-spec.interface';
import parseImageDimensions from './parse-image-dimensions';

export default function generateImageSourcesList (
  breakpointsSpecs: BreakpointSpec[],
  doesSupportWebp = true,
  forcedAspectRation?: number
): ImageSourceItem[] {
  const result: ImageSourceItem[] = [];

  for (const spec of breakpointsSpecs) {
    const filters = doesSupportWebp ? '/filters:format(webp)' : '';

    // "https://s3.amazonaws.com/a.storyblok.com/f/109999/500x500/c01cfb137f/pet_socks.png"
    // "https://a.storyblok.com/f/109999/1080x1080/485ba42bde/petsies_homepage_images_1_.png"
    const [, resource] = spec.src.split('/a.storyblok.com');
    let dimensions = parseImageDimensions(spec.src);
    const ratio = forcedAspectRation || (dimensions.height / dimensions.width);

    const sourceItem: ImageSourceItem = {
      breakpoint: spec.breakpoint,
      aspectRatio: 1 / ratio,
      srcset: []
    };

    for (const density of [1, 1.5, 2, 3]) {
      const adjustedWidth = Math.round(spec.width * density / 10) * 10;
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
