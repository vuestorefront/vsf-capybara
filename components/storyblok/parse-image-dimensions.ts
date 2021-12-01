interface Dimensions {
  height: number,
  width: number
}

export default function parseImageDimensions (storyblokUrl: string): Dimensions {
  // "https://s3.amazonaws.com/a.storyblok.com/f/109999/500x500/c01cfb137f/pet_socks.png"
  const dimensionsString = storyblokUrl.split('/')[6];

  const dimensions = dimensionsString.split('x');

  return {
    width: parseInt(dimensions[0]),
    height: parseInt(dimensions[1])
  }
}
