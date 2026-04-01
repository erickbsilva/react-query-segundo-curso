import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReplyMutation = (slug) => {
  const queryClient = useQueryClient();

  const replyMutation = useMutation({
    mutationFn: (commentData) => {
      return fetch(
        `http://localhost:3000/api/comment/${commentData.comment.postId}/replies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commentData),
        }
      ).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }

        return response.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post", slug]);
    },
    onError: (error, variables) => {
      console.error(
        `Erro ao salvar resposta ao comentário para o slug: ${variables.slug}`,
        { error }
      );
    },
  });

  return {
    mutate: ({ comment, text }) => replyMutation.mutate({ comment, text }),
    status: replyMutation.status,
    error: replyMutation.error,
    isError: replyMutation.isError,
    isSuccess: replyMutation.isSuccess,
  };
};