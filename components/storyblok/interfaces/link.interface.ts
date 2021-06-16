export default interface LinkInterface {
  id: string,
  url: string,
  linktype: string,
  fieldtype: string,
  cached_url: string,
  story?: {
    name: string,
    id: number,
    uuid: string,
    slug: string,
    full_slug: string,
    url: string
  }
}
