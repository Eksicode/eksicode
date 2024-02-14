import Link from "next/link";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { Key } from "react";

type Group = {
  id: number;
  name: string;
  logo: string;
};

export const getStaticProps = (async (context) => {
  const res = await fetch(
    // "https://api.eksicode.org/telegrams?_sort=ListOrder:ASC"
    'http://localhost:3000/api/groups'
  );
  console.log(res);
  const groups = await res.json();
  return { props: { groups } };
}) satisfies GetStaticProps<{
  groups: Group;
}>;

export default function TelegramGroups({
  groups,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="flex items-center sm:basis-full basis-3/4 h-16 mx-10 sm:mx-4 justify-center">
      {groups?.map(
        (group: {
          id: Key | null | undefined;
          logo: string | undefined;
          name: string | undefined;
        }) => (
          <div>
            <img src={group.logo} alt={group.name} className="w-8 h-8" />
            {group.name}
          </div>
        )
      )}
    </div>
  );
}
