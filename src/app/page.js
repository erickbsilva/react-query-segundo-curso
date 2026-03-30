"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { CardPost } from "@/components/CardPost";
import { Spinner } from "@/components/Spinner";
import styles from "./page.module.css";
import Link from "next/link";

const fetchPosts = async ({ page }) => {
  const results = await fetch(`http://localhost:3000/api/posts?page=${page}`);

  const data = await results.json();

  return data;
};

export const fetchPostRating = async ({ postId }) => {
  const results = await fetch(`http://localhost:3000/api/post?postId=${postId}`);
  const data = await results.json();
  return data;
}

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
    // staleTime representa o tempo em ms que a query fica no cache
    staleTime: 2000,
    // gcTime limpa a memória de cache inativos
    // gcTime: 2000
    // refetchInterval atualiza a query a cada 2s
    // refetchInterval: 2000
    // refetchIntervalInBackground por padrão é true, o que força a atualizar a query em segundo plano quando acessa o navegador
    // refetchOnWindowFocus: false,
  });

  const postRatingQueries = useQueries({
    // queries paralelas
    // o useQueries vai gerar um array com os identificadores das queries
    // o queries vai ler o array da query anterior e ir executando as outras queries
    queries:
      posts?.data.length > 0
        ? posts.data.map((post) => ({
          queryKey: ["postHome", post.id],
          queryFn: () => fetchPostRating({ postId: post.id }),
          // só vai rodar a query se existir o id
          enabled: !!post.id,
        }))
        : [],
  });
 // 
  const ratingsAndCartegoriesMap = postRatingQueries?.reduce((acc, query) => {
    if (!query.isPending && query.data && query.data.id) {
      acc[query.data.id] = query.data;
    }
    return acc;
  }, {});

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
