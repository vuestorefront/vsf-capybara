import parseImageDimensions from './parse-image-dimensions';

export default function getResizedImageUrl (
  imageUrl: string,
  width: number,
  doesSupportWebp = true
): string {
  const filters = doesSupportWebp ? '/filters:format(webp)' : '';

  // "https://s3.amazonaws.com/a.storyblok.com/f/109999/500x500/c01cfb137f/pet_socks.png"
  // "https://a.storyblok.com/f/109999/1080x1080/485ba42bde/petsies_homepage_images_1_.png"
  const [, resource] = imageUrl.split('/a.storyblok.com');
  let dimensions = parseImageDimensions(imageUrl);
  const ratio = dimensions.height / dimensions.width;

  const height = Math.round(width * ratio);

  let mod = '/fit-in';
  mod += `/${width}x${height}`;
  mod += filters;

  const resizedUrl = 'https://img2.storyblok.com' + mod + resource;

  return resizedUrl;
}
