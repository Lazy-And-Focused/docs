import type { Folder, PageMapItem } from "nextra";

import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";

import { getPageMap } from "nextra/page-map";
import { pageMap as remotePageMap } from "@/shared/lib/remote-page-maps";

import "nextra-theme-docs/style.css";

const banner = (
  <Banner storageKey="warn-docs-in-dev-06-08-2025">
    ⚠ Документация в разработке
  </Banner>
);
const navbar = <Navbar logo={<b>LAF/Documentation</b>} />;
const footer = (
  <Footer>2025-{new Date().getFullYear()} © Lazy And Focused</Footer>
);

const pageMap = [...(await getPageMap()), ...remotePageMap].reduceRight(
  (acc: PageMapItem[], obj: PageMapItem) => {
    const existingIndex = acc.findIndex((item) => {
      return "name" in item && "name" in obj && item.name === obj.name;
    });

    if (existingIndex > -1) {
      acc[existingIndex] = {
        ...acc[existingIndex],
        ...obj,

        children: [
          ...((acc[existingIndex] as Folder<PageMapItem>).children || []),
          ...((obj as Folder<PageMapItem>).children || []),
        ],
      };
    } else {
      acc.push(obj);
    }

    return acc;
  },
  []
);

console.log(pageMap);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={pageMap}
          footer={footer}
          docsRepositoryBase="https://github.com/Lazy-And-Focused/docs/tree/main"
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
