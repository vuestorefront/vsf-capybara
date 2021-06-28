import parseImageDimensions from './parse-image-dimensions';

export default function getResizedImageUrl (
  imageUrl: string,
  width: number,
  doesSupportWebp = true
): string {
  const filters = doesSupportWebp ? '/filters:format(webp)' : '';

  const [, resource] = imageUrl.split('//a.storyblok.com');
  let dimensions = parseImageDimensions(imageUrl);
  const ratio = dimensions.height / dimensions.width;

  const height = Math.round(width * ratio);

  let mod = '/fit-in';
  mod += `/${width}x${height}`;
  mod += filters;

  const resizedUrl = 'https://img2.storyblok.com' + mod + resource;

  return resizedUrl;
}
