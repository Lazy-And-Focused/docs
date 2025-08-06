import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

const banner = (
  <Banner storageKey="warn-docs-in-dev-06-08-2025">
    ⚠ Документация в разработке
  </Banner>
);
const navbar = <Navbar logo={<b>LAF's Documentation</b>} />;
const footer = <Footer>{new Date().getFullYear()} © Lazy And Focused.</Footer>;

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
          pageMap={await getPageMap()}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
