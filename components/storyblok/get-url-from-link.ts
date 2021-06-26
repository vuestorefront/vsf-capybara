import { LinkField, LinkType } from 'src/modules/vsf-storyblok-module';

export default function getUrlFromLink (
  link: LinkField
): string {
  return link.linktype === LinkType.URL
    ? link.url
    : '/' + link.cached_url
}
