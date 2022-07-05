import type { GetStaticProps, GetStaticPaths, NextPage } from "next";
import fs from "fs";
import matter from "gray-matter";
import markdown from "@wcj/markdown-to-html";
import Head from "next/head";

type Props = {
  content: string;
  frontmatter: {
    [key: string]: any;
  };
};

type Params = {
  slug: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync("src/posts");

  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".md", ""),
    },
  }));
  return {
    paths: paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const fileName = fs.readFileSync(`src/posts/${params?.slug}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: { content, frontmatter },
    revalidate: 5,
  };
};

const Post: NextPage<Props> = ({ content, frontmatter }) => {
  return (
    <>
      <Head>
        <title>{frontmatter.title}</title>
        <meta content={frontmatter.title} property="og:title" />
      </Head>
      <div className="prose mx-auto">
        <h1>{frontmatter.title}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html: markdown(content).toString(),
          }}
        />
      </div>
    </>
  );
};

export default Post;
