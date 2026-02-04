'use client';

import RouteErrorView from "@/components/RouteErrorView";
import SideMenu from "@/components/Nav/SideMenu";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AramaError({ error, reset }: ErrorProps) {
  return (
    <RouteErrorView
      error={error}
      reset={reset}
      pageTitle="Arama"
      context="Arama sayfası"
      sidebar={<SideMenu />}
    />
  );
}
