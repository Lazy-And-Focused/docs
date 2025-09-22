import { useMDXComponents as getMDXComponents } from "@/mdx-components";

import { Callout, Tabs } from "nextra/components";

import { compileMdx } from "nextra/compile";
import { evaluate } from "nextra/evaluate";
import {
  convertToPageMap,
  mergeMetaWithPageMap,
  normalizePageMap,
} from "nextra/page-map";
import { notFound } from "next/navigation";

import { remotes } from "./_config/remotes";

const remote = remotes[0];

const { mdxPages, pageMap: _pageMap } = convertToPageMap({
  filePaths: remote.files,
  // Не может быть типа `/path/to/hello`, только так: `/path-to-hello`...
  // ...надеюсь найдутся те, у кого есть свободное время на фикс
  basePath: "test-remote/" + remote.localUrl,
});

// `mergeMetaWithPageMap` используется для изменения sidebar order и заголовка
const eslintPageMap = mergeMetaWithPageMap(_pageMap[0]!, {
  // index: "Введение",
  // "file-structure": "Файловая структура",
  // route: "Роутинг",
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

export function generateStaticParams() {
  const params = Object.keys(mdxPages).map((route) => ({
    slug: route.split("/"),
  }));

  return params;
}

export default async function TestRemotePage({ params }: PageProps) {
  const { slug } = await params;
  const route = slug?.join("/").replace(remote.localUrl, "") ?? "";
  const filePath = mdxPages[route];

  console.log(route, filePath);

  if (!filePath) {
    notFound();
  }

  const data = await fetch(generateFileRemoteUrl(remote.url, filePath)).then(
    (res) => res.text()
  );
  const compiledFile = await compileMdx(data, {
    filePath,
    mdxOptions: { format: "detect" },
  });
  const {
    default: MDXContent,
    toc,
    metadata,
  } = evaluate(compiledFile, components);

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent />
    </Wrapper>
  );
}

function generateFileRemoteUrl(
  remoteUrl: {
    user: string;
    repo: string;
    branch: string;
    docsPath: string;
  },
  filePath: string
) {
  const base = "https://raw.githubusercontent.com/";
  const home = `${remoteUrl.user}/${remoteUrl.repo}/${remoteUrl.branch}/`;

  return `${base}${home}${remoteUrl.docsPath}${filePath}`;
}
