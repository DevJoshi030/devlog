import type { GetStaticProps, GetStaticPaths, NextPage } from "next";
import fs from "fs";
import Link from "next/link";
import Image from "next/image";
import matter from "gray-matter";

type Post = {
  slug: string;
  frontmatter: {
    [key: string]: any;
  };
};

type Props = {
  posts: Post[];
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const files = fs.readdirSync("src/posts");

//   const paths = files.map((fileName) => ({
//     params: {
//       slug: fileName.replace(".md", ""),
//     },
//   }));
//   return {
//     paths: paths,
//     fallback: "blocking",
//   };
// };

export const getStaticProps: GetStaticProps = async () => {
  const files = fs.readdirSync("src/posts");

  const posts = files.map((fileName) => {
    const slug = fileName.replace(".md", "");
    const readFile = fs.readFileSync(`src/posts/${fileName}`, "utf-8");
    const { data: frontmatter } = matter(readFile);
    return {
      slug,
      frontmatter,
    };
  });
  return {
    props: { posts },
    revalidate: 5,
  };
};

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-0">
      {posts.map(({ slug, frontmatter }) => (
        <div
          key={slug}
          className="border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col"
        >
          <Link href={`/posts/${slug}`}>
            <a>
              <Image
                width={650}
                height={340}
                alt={frontmatter.title}
                src={`/${frontmatter.socialImage}`}
              />

              <h1 className="p-4">{frontmatter.title}</h1>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
