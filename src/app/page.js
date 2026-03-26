"use client";

import { useQuery } from "@tanstack/react-query";
import { CardPost } from "@/components/CardPost";
import { Spinner } from "@/components/Spinner";
import styles from "./page.module.css";
import Link from "next/link";

const fetchPosts = async ({ page }) => {
    const results = await fetch(`http://localhost:3000/api/posts?page=${page}`);
    
    const data = await results.json();
    
    return data;
};

export default function Home({ searchParams }) {
  const currentPage = parseInt(searchParams?.page || 1);
  const searchTerm = searchParams?.q;

  // queryKey é o identificador da query
  // queryFn representa a funcao que ira executar a query
  // data representa os dados da query
  // isLoading representa se a query esta sendo carregada
  // isFetching representa se a query esta sendo executada
  const { data: posts, isLoading, isFetching } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts({ page: currentPage }),
  });

  const ratingsAndCartegoriesMap = null;

  return (
    <main className={styles.grid}>
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
      {posts?.data?.map((post) => (
        <CardPost
          key={post.id}
          post={post}
          rating={ratingsAndCartegoriesMap?.[post.id]?.rating}
          category={ratingsAndCartegoriesMap?.[post.id]?.category}
          isFetching={isFetching}
        />
      ))}
      <div className={styles.links}>
        {posts?.prev && (
          <Link
            href={{
              pathname: "/",
              query: { page: posts?.prev, q: searchTerm },
            }}
          >
            Página anterior
          </Link>
        )}
        {posts?.next && (
          <Link
            href={{
              pathname: "/",
              query: { page: posts?.next, q: searchTerm },
            }}
          >
            Próxima página
          </Link>
        )}
      </div>
    </main>
  );
}
