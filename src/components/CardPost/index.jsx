import Image from "next/image";
import { Avatar } from "../Avatar";
import { Star } from "../icons/Star";
import styles from "./cardpost.module.css";
import Link from "next/link";
import { ThumbsUpButton } from "./ThumbsUpButton";
import { ModalComment } from "../ModalComment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";


export const CardPost = ({ post, highlight, rating, category, isFetching, currentPage }) => {

  const queryClient = useQueryClient();

  const thumbsMutation = useMutation({
    // mutationKey representa o identificador da mutation
    // mutationFn representa a funcao que ira executar a mutation
    // postData representa os dados da mutation
    // mutation para gravar os likes
    mutationFn: (postData) => {
      return fetch("http://localhost:3000/api/thumbs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`A resposta de rede não está ok. status ${response.status}`);
        }
        return response.json();
      });
    },
    // invalidação das queries
    // invalida as queries relacionadas ao post para atualizar o cache
    // onSuccess: () => {
    //   queryClient.invalidateQueries(["post", post.slug]);
    //   queryClient.invalidateQueries(["posts", currentPage]);
    // },
    onMutate: async (newData) => {
      const postQueryKey = ["post", post.slug];

      // cancelar queries em voo para detalhe do post
      await queryClient.cancelQueries(postQueryKey);

      const prevPost = queryClient.getQueryData(postQueryKey);

      // atualizar um único post
      if (prevPost) {
        queryClient.setQueryData(postQueryKey, {
          ...prevPost,
          likes: prevPost.likes + 1,
        });
      }

      return { prevPost };
    },
    onError: (error, variables) => {
      console.error(
        `Erro ao salvar o thumbsUp para o slug: ${variables.slug}`,
        { error }
      );
    }
  });

  // atualização otimista via UI
  // useEffect(() => {
  //     if (thumbsMutation.isPending && thumbsMutation.variables) {
  //         post.likes = post.likes + 1;
  //     }
  // }, [thumbsMutation.isPending, thumbsMutation.variables]);

  const submitCommentMutation = useMutation({
    mutationFn: (commentData) => {
      return fetch(`http://localhost:3000/api/comment/${post.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      })
    },
    onSuccess: () => {
      // invalida as queries relacionadas ao post para atualizar o cache
      queryClient.invalidateQueries(["post", post.slug]);
      queryClient.invalidateQueries(["posts", currentPage]);
    },
    onError: (error, variables) => {
      console.error(
        `Erro ao salvar o comentário para o slug: ${variables.slug}`,
        { error }
      );
    },
  })

  const onSubmitComment = (event) => {
    event.preventDefault();

    // Recupera os dados do formulário
    const formData = new FormData(event.target);
    // Recupera o texto do formulário
    const text = formData.get("text");

    // Envia o comentário para a API usando o mutation
    submitCommentMutation.mutate({ id: post.id, text });
  };

  return (
    <article className={styles.card} style={{ width: highlight ? 993 : 486 }}>
      <header className={styles.header}>
        <figure style={{ height: highlight ? 300 : 133 }}>
          <Image
            src={post.cover}
            fill
            alt={`Capa do post de titulo: ${post.title}`}
          />
        </figure>
      </header>
      <section className={styles.body}>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <Link href={`/posts/${post.slug}`}>Ver detalhes</Link>
      </section>
      <footer className={styles.footer}>
        <div className={styles.actions}>
          <form onClick={(event) => {
            event.preventDefault();
            thumbsMutation.mutate({ slug: post.slug });
          }}>
            <ThumbsUpButton disable={isFetching} />
            {thumbsMutation.isError && (
              <p className={styles.ThumbsUpButtonMessage}>Ops, ocorreu um erro: {thumbsMutation.error.message}</p>
            )}
            <p>{post.likes}</p>
          </form>
          <div>
            <ModalComment onSubmit={onSubmitComment} />
            <p>{post.comments.length}</p>
          </div>
          {rating && (
            <div style={{ margin: "0 3px" }}>
              <Star />
              <p style={{ marginTop: "1px" }}>{rating}</p>
            </div>
          )}
        </div>
        {category && (
          <div
            className={styles.categoryWrapper}
            style={{ fontSize: highlight ? "15px" : "12px" }}
          >
            <span className={styles.label}>Categoria: </span>{" "}
            <span className={styles.category}>{category}</span>
          </div>
        )}
        <Avatar imageSrc={post.author.avatar} name={post.author.username} />
      </footer>
    </article>
  );
};
