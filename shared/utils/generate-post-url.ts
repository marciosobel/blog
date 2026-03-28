/** RegEx to extract the post name from a URL by taking the part between the first and last slashes */
const regex = /[^\/]+\/(.+)\/[^\/]+/;

export default function (post: string, locale: string): string {
  const name = post.match(regex)![1];
  return `/${name}`;
}
