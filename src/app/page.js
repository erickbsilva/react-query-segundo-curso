"use client";

import { CardPost } from "@/components/CardPost";
import { Spinner } from "@/components/Spinner";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home({ searchParams }) {
  const currentPage = parseInt(searchParams?.page || 1);
  const searchTerm = searchParams?.q;

  const isLoading = false;
  const isFetching = false;
  const posts = [];

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
