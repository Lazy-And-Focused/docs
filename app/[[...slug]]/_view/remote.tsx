import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import { Callout, Tabs } from "nextra/components";

import { notFound } from "next/navigation";
import {
  convertToPageMap,
  mergeMetaWithPageMap,
  normalizePageMap,
} from "nextra/page-map";
import { evaluate } from "nextra/evaluate";
import { compileMdx } from "nextra/compile";

import {
  type RemoteConfig,
  remotes,
} from "@/app/(remote)/_test-remote/[[...slug]]/_config/remotes";

type Props = {
  params: Promise<{
    slug?: string[];
  }>;
};

function getMdxPages(remote: RemoteConfig) {
  const { mdxPages } = convertToPageMap({
    filePaths: remote.files,
    basePath: remote.localUrl,
  });
  return mdxPages;
}

const { wrapper: Wrapper, ...components } = getMDXComponents({
  $Tabs: Tabs,
  Callout,
});

export async function RemoteModeComponent(props: Props) {
  const { slug } = await props.params;
  const remote = remotes.find((remote) => {
    return slug?.join("/")?.startsWith(remote.localUrl);
  });

  if (!remote) {
    return notFound();
  }

  const mdxPages = getMdxPages(remote);

  const route = slug?.join("/").replace(remote.localUrl + "/", "") ?? "";
  const filePath = mdxPages[route];

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
      <MDXContent {...props} params={props.params} />
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
