'use client';

import RouteErrorView from "@/components/RouteErrorView";
import SideMenu from "@/components/Nav/SideMenu";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function EtiketlerError({ error, reset }: ErrorProps) {
  return (
    <RouteErrorView
      error={error}
      reset={reset}
      pageTitle="Etiketler"
      context="Etiketler sayfası"
      sidebar={<SideMenu />}
    />
  );
}
