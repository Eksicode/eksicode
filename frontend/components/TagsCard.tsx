import React from 'react'

interface Tag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
  icon: string;
  description: string;
}

function TagsCard(tag: Tag) {
  return (
    <div className="relative flex items-center flex-col justify-center text-gray-700 bg-white border border-gray-200 shadow-md bg-clip-border rounded-xl w-52 p-2 m-2">
      {/* <Image
        src={group.logo}
        alt="eksi-code-logo"
        className="h-20 w-20 rounded-full"
        width="80"
        height="80"
      /> */}
      <div className="p-4 text-center">
        <h4 className="mb-2 font-sans text-lg antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          {tag.name}
        </h4>
        <p className="block font-sans text-base antialiased font-medium leading-relaxed text-transparent bg-clip-text bg-gradient-to-tr from-blue-gray-600 to-blue-gray-400">
          {tag.postCount}
        </p>
      </div>
      <p>{tag.description}</p>
      <div>{tag.icon}</div>
    </div>
  )
}

export default TagsCard