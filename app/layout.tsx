import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";

import { getPageMap } from "nextra/page-map";
import { pageMaps as remotePageMaps } from "@/app/_remote-page-map";

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

const pageMap = [...(await getPageMap()), ...remotePageMaps].reduce(
  (acc: any[], obj: any) => {
    const existingIndex = acc.findIndex(
      (item: { name: any }) => item.name === obj.name
    );

    if (existingIndex > -1) {
      acc[existingIndex] = {
        ...obj,
        ...acc[existingIndex],
        children: [...acc[existingIndex].children, ...obj.children],
      };
    } else {
      acc.push(obj);
    }

    return acc;
  },
  []
);

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
