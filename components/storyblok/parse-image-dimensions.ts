interface Dimensions {
  height: number,
  width: number
}

export default function parseImageDimensions (storyblokUrl: string): Dimensions {
  // "https://s3.amazonaws.com/a.storyblok.com/f/109999/500x500/c01cfb137f/pet_socks.png"
  // "https://a.storyblok.com/f/109999/1080x1080/485ba42bde/petsies_homepage_images_1_.png"
  const [, resource] = storyblokUrl.split('/a.storyblok.com');
  const dimensionsString = resource.split('/')[3];

  const dimensions = dimensionsString.split('x');

  return {
    width: parseInt(dimensions[0]),
    height: parseInt(dimensions[1])
  }
}
