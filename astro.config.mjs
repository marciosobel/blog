// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeRewrite from "rehype-rewrite";
import GithubSlugger from "github-slugger";

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Nunito",
      cssVariable: "--font-nunito",
      weights: [400, 700],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
    },
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "gruvbox-light-soft",
        dark: "gruvbox-dark-soft",
      },
    },
    processor: unified({
      rehypePlugins: [
        [
          rehypeRewrite,
          {
            // @ts-ignore
            rewrite: (node, _index, parent) => {
              if (node.type !== "element") return;

              if (node.tagName === "a" && parent?.tagName === "p") {
                node.properties.className = ["md-link"];
                const href = node.properties.href || "";
                const isExternal =
                  href.startsWith("http://") || href.startsWith("https://");
                if (isExternal) {
                  node.properties.target = "_blank";
                  node.properties.rel = "noopener noreferrer";
                }
              }

              if (node.tagName === "h2") {
                const slugger = new GithubSlugger();
                const headingText = node.children
                  // @ts-ignore
                  .filter((child) => child.type === "text")
                  // @ts-ignore
                  .map((child) => child.value)
                  .join("");

                const id = node.properties.id || slugger.slug(headingText);
                const content = node.children;
                node.properties.className = ["md-heading"];

                node.children = [
                  {
                    type: "element",
                    tagName: "a",
                    properties: {
                      // @ts-ignore
                      href: `#${id}`,
                      className: ["underline-link"],
                    },
                    children: content,
                  },
                  {
                    type: "element",
                    tagName: "svg",
                    properties: {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "14",
                      height: "14",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      className: ["md-heading-icon"],
                    },
                    children: [
                      {
                        type: "element",
                        tagName: "path",
                        properties: {
                          d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
                        },
                      },
                      {
                        type: "element",
                        tagName: "path",
                        properties: {
                          d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
                        },
                      },
                    ],
                  },
                ];
              }
            },
          },
        ],
      ],
    }),
  },
});
