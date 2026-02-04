"use client";

import RouteErrorView from "@/components/RouteErrorView";
import SideMenu from "@/components/Nav/SideMenu";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PostError({ error, reset }: ErrorProps) {
  return (
    <RouteErrorView
      error={error}
      reset={reset}
      pageTitle="Gönderi"
      context="Gönderi detay sayfası"
      sidebar={<SideMenu />}
    />
  );
}
