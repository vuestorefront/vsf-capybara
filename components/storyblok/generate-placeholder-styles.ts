import parseImageDimensions from './parse-image-dimensions';

export default function generatePlaceholderStyles (
  imageUrl: string,
  mobileImageUrl: string,
  variableName: string
): Record<string, string> {
  const result: Record<string, string> = {};

  if (!imageUrl) {
    return result;
  }

  let dimensions = parseImageDimensions(imageUrl);

  let ratio = dimensions.height / dimensions.width * 100;

  result['--' + variableName] = ratio + '%';

  if (!mobileImageUrl) {
    return result;
  }

  dimensions = parseImageDimensions(mobileImageUrl);

  ratio = dimensions.height / dimensions.width * 100;

  result[`--${variableName}-mobile`] = ratio + '%';

  return result;
}
