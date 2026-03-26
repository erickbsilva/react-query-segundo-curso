"use client";

import { CardPost } from "@/components/CardPost";
import { CommentList } from "@/components/CommentList";
import styles from "./page.module.css";

const PagePost = ({ params }) => {
  const { slug } = params;

  const post = null;

  const postRating = null;

  return (
    <div>
      {post && (
        <>
          <CardPost
            post={post}
            rating={postRating?.rating}
            category={postRating?.category}
            highlight={true}
          />
          <h3 className={styles.subtitle}>Código:</h3>
          <div className={styles.code}>
            <div dangerouslySetInnerHTML={{ __html: post.markdown }} />
          </div>
          <CommentList comments={post.comments} slug={slug} />
        </>
      )}
    </div>
  );
};

export default PagePost;
