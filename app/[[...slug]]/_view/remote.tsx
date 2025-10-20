import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import { Callout, Tabs } from "nextra/components";

import { notFound } from "next/navigation";
import { compileMdx } from "nextra/compile";
import { evaluate } from "nextra/evaluate";
import { convertToPageMap } from "nextra/page-map";

import {
  type RemoteConfig,
  remotes,
} from "@/shared/config/remotes";

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

  // Добавляем индексную страницу для корня удалённого репозитория
  const rootIndexPath = findRootIndex(remote.files);
  if (rootIndexPath) {
    mdxPages[""] = rootIndexPath;
  }

  return mdxPages;
}

// Функция для поиска индексного файла в корне
function findRootIndex(files: string[]): string | null {
  // Ищем файлы с именем index в корне
  const rootIndex = files.find(file => {
    const segments = file.split('/');
    // Файл в корне с именем index
    return segments.length === 1 &&
      (file === 'index.mdx' || file === 'index.md' || file === 'README.md' || file === 'readme.md');
  });

  if (rootIndex) return rootIndex;

  // Если нет явного index, берём первый файл в корне
  const rootFiles = files.filter(file => file.split('/').length === 1);
  return rootFiles[0] || null;
}

function normalizeRoute(route: string, remote: RemoteConfig): string {
  // Если route пустой или равен remote.localUrl - это корень
  if (!route || route === remote.localUrl) {
    return "";
  }

  // Убираем префикс remote.localUrl если он есть
  if (route.startsWith(remote.localUrl + '/')) {
    return route.slice(remote.localUrl.length + 1);
  }

  return route;
}

const { wrapper: Wrapper, ...components } = getMDXComponents({
  $Tabs: Tabs,
  Callout,
});

export async function RemoteModeComponent(props: Props) {
  const { slug } = await props.params;
  const path = slug?.join("/") || "";

  const remote = remotes.find((remote) => {
    return path.startsWith(remote.localUrl);
  });

  if (!remote) {
    return notFound();
  }

  const mdxPages = getMdxPages(remote);
  const route = normalizeRoute(path, remote);

  console.log('Remote debug:', { path, route, mdxPages: Object.keys(mdxPages) });

  const filePath = mdxPages[route];

  if (!filePath) {
    console.log('File not found for route:', route);
    notFound();
  }

  try {
    const data = await fetch(generateFileRemoteUrl(remote.url, filePath)).then(
      (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      }
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
  } catch (error) {
    console.error('Error loading remote content:', error);
    notFound();
  }
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

  // Обеспечиваем корректное соединение путей
  const docsPath = remoteUrl.docsPath.endsWith('/')
    ? remoteUrl.docsPath
    : remoteUrl.docsPath + '/';

  return `${base}${home}${docsPath}${filePath}`;