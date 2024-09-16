"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function NewsFeed() {
  // Fetch posts for the "news" handle
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "news"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/news", // Updated route for "news" posts
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton className="w-full h-full" />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-center text-muted-foreground">
          No posts found for this user.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-center text-destructive">
          An error occurred while loading posts.
        </p>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5 w-full h-full"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center w-full">
          <Loader2 className="mx-auto my-3 animate-spin" />
        </div>
      )}
    </InfiniteScrollContainer>
  );
}
