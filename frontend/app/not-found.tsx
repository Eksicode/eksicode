import Link from "next/link";
import { ReactMatrixAnimation } from "react-matrix-animation";

function NotFound() {
  return (
    <div className="m-auto flex h-screen w-screen items-center justify-center bg-gray-950">
      <div className="m-auto text-center absolute text-eksiCodeMedium">
        <h1 className="text-4xl">404</h1>
        <h2>Not Found</h2>
        <p>Yanlış hapı yuttunuz</p>
        <p>Aradığınız sayfa bu evrende bulunamadı...</p>
        <Link href="/">Ana sayfaya dön</Link>
      </div>
      <ReactMatrixAnimation />
    </div>
  );
}

export default NotFound;
