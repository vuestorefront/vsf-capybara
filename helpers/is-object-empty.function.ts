export default function isObjectEmpty (object: any) {
  for (const key in object) {
    return false;
  }

  return true;
}
