/** RegEx to extract the post name from a URL by taking the part between the first and last slashes */
const regex = /[^\/]+\/(.+)\/[^\/]+/;

/**
 * Extracts the post slug from the provided stem.
 * Invalid stems will result in a empty string or unknown strings.
 *
 * @example
 * ```ts
 * const stem = "blog/my-post-slug/pt";
 * const slug = extractPostSlug(stem);
 * console.log(slug); // "my-post-slug"
 * ```
 */
export default function (stem: string): string {
  const name = stem.match(regex)![1];
  return name ?? "";
}
