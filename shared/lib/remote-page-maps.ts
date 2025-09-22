import {
  convertToPageMap,
  mergeMetaWithPageMap,
  normalizePageMap,
} from "nextra/page-map";
import { remotes } from "@/shared/config/remotes";

export const pageMaps = remotes.map((remote) => {
  const { pageMap: _pageMap } = convertToPageMap({
    filePaths: remote.files,
    basePath: remote.localUrl,
  });
  const eslintPageMap = mergeMetaWithPageMap(_pageMap[0]!, {});
  const pageMap = normalizePageMap(eslintPageMap);

  return pageMap;
});
