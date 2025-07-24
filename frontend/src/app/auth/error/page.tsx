import AuthError from "@/components/Auth/AuthError";
import { Suspense } from "react";

function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthError />
    </Suspense>
  );
}

export default AuthErrorPage;
