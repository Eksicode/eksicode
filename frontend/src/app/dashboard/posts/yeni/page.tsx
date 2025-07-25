import React from "react";
import NewPost from "@/components/NewPost";

function NewPostPage() {
  return (
    <>
      <div className="flex justify-between w-full items-center mb-5">
        <div>
          <h1 className="mt-2 w-full">Yeni Gönderi</h1>
        </div>
      </div>
      <NewPost />
    </>
  );
}

export default NewPostPage;
