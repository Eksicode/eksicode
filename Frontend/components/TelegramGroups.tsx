
import Link from 'next/link';
import type { InferGetStaticPropsType, GetStaticProps } from 'next'

interface Group {
  id: number;
  name: string;
  logo: string;
  link: string;
  stargazers_count: number;
}

type TelegramGroupsProps = {
  groups?: Group[];
};

const InferGetStaticPropsType: GetStaticProps = async () => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js');
  
  //const res = await fetch('http://localhost:3000/api/groups');
  //const res = await fetch('https://api.eksicode.org/telegrams?_sort=ListOrder:ASC');
  const groups = await res.json() as Group[];
  return { props: { groups } };
};

export default function TelegramGroups({ groups }: TelegramGroupsProps) {
  return (
    <div className="flex items-center sm:basis-full basis-3/4 h-16 mx-10 sm:mx-4 justify-center">
      sdfds
      {groups?.map((group) => (
        <Link key={group.id} href={`/telegram/${group.link}`}>
          <div className="flex items-center gap-2 hover:opacity-75">
            <img src={group.logo} alt={group.name} className="w-8 h-8 rounded-full" />
            <div className="text-md">{group.name}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
