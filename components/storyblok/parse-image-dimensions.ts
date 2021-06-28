interface Dimensions {
  height: number,
  width: number
}

export default function parseImageDimensions (storyblokUrl: string): Dimensions {
  const dimensionsString = storyblokUrl.split('/')[5];

  const dimensions = dimensionsString.split('x');

  return {
    width: parseInt(dimensions[0]),
    height: parseInt(dimensions[1])
  }
}
