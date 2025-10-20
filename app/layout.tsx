import type { Folder, PageMapItem } from "nextra";

import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";

import { pageMap as remotePageMap } from "@/shared/lib/remote-page-maps";
import { getPageMap } from "nextra/page-map";

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

const mergePageMapItems = (
  returnedArray: PageMapItem[],
  newItem: PageMapItem
) => {
  // Ищем элемент с таким же именем
  const existingIndex = returnedArray.findIndex(
    (item) => "name" in item && "name" in newItem && item.name === newItem.name
  );

  if (existingIndex > -1) {
    // Найден дубликат - объединяем
    const existingItem = returnedArray[existingIndex];

    // Создаём объединённый элемент с приоритетом локальных данных
    const mergedItem = {
      ...newItem, // Сначала берём удалённые свойства
      ...existingItem, // Перезаписываем локальными (приоритет)
    };

    // Обработка frontMatter с приоритетом локальных данных
    if ('frontMatter' in existingItem && 'frontMatter' in newItem) {
      (mergedItem as any).frontMatter = {
        ...(newItem as any).frontMatter,
        ...(existingItem as any).frontMatter,
      };
    }

    // Обработка children - объединяем рекурсивно
    if ('children' in existingItem || 'children' in newItem) {
      const existingChildren = (existingItem as any).children || [];
      const newChildren = (newItem as any).children || [];

      mergedItem.children = [...existingChildren, ...newChildren].reduce(
        mergePageMapItems,
        []
      );
    }

    returnedArray[existingIndex] = mergedItem;
  } else {
    // Элемент с таким именем не найден - просто добавляем
    returnedArray.push(newItem);
  }

  return returnedArray;
};

// Для отладки - посмотрим что у нас в pageMap
const localPageMap = await getPageMap();
console.log('Локальный pageMap:', localPageMap.length, 'элементов');
console.log('Удалённый pageMap:', remotePageMap.length, 'элементов');

const pageMap = [...localPageMap, ...remotePageMap].reduce(
  mergePageMapItems,
  []
);

console.log('Объединённый pageMap:', pageMap.length, 'элементов');

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