import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "@/mdx-components";

export const generateStaticParams = generateStaticParamsFor("slug");

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata(props: Props) {
  const { slug } = await props.params;
  const { metadata } = await importPage(slug);

  return {
    ...metadata,
    title: `${metadata.title} ◌ Lazy And Focused`,
  };
}

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props: Props) {
  const { slug } = await props.params;
  const result = await importPage(slug);

  const { default: MDXContent, toc, metadata } = result;

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={props.params} />
    </Wrapper>
  );
}
