import LinkField from './interfaces/link-field.interface';
import { LinkType } from './interfaces/link-type.value';

export default function getUrlFromLink (
  link: LinkField
): string {
  return link.linktype === LinkType.URL
    ? link.url
    : '/' + link.cached_url
}
