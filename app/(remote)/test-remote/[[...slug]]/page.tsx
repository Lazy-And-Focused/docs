import { notFound } from "next/navigation";
import { compileMdx } from "nextra/compile";
import { Callout, Tabs } from "nextra/components";
import { evaluate } from "nextra/evaluate";
import {
  convertToPageMap,
  mergeMetaWithPageMap,
  normalizePageMap,
} from "nextra/page-map";
import { useMDXComponents as getMDXComponents } from "../../../../mdx-components";
import { remotes } from "./_config";

const remote = remotes[0];

const { mdxPages, pageMap: _pageMap } = convertToPageMap({
  filePaths: remote.files,
  basePath: remote.localUrl,
});

// `mergeMetaWithPageMap` is used to change sidebar order and title
const eslintPageMap = mergeMetaWithPageMap(_pageMap[0]!, {
  index: "Introduction",
});

export const pageMap = normalizePageMap(eslintPageMap);

const { wrapper: Wrapper, ...components } = getMDXComponents({
  $Tabs: Tabs,
  Callout,
});

type PageProps = Readonly<{
  params: Promise<{
    slug?: string[];
  }>;
}>;

export default async function Page(props: PageProps) {
  const params = await props.params;
  const route = params.slug?.join("/") ?? "";
  const filePath = mdxPages[route];

  if (!filePath) {
    notFound();
  }
  
  const response = await fetch(
    `https://raw.githubusercontent.com/${remote.url.user}/${remote.url.repo}/${remote.url.branch}/${remote.url.docsPath}${filePath}`
  );
  const data = await response.text();
  const rawJs = await compileMdx(data, {
    filePath,
    mdxOptions: { format: "detect" },
  });
  const { default: MDXContent, toc, metadata } = evaluate(rawJs, components);

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={rawJs}>
      <MDXContent />
    </Wrapper>
  );
}

export function generateStaticParams() {
  const params = Object.keys(mdxPages).map((route) => ({
    slug: route.split("/"),
  }));

  return params;
}
