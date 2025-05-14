'use client';

import {useGetAllPostsQuery, useGetPostQuery} from '@/redux/store/services/api';

export default function Home() {
     // @ts-ignore
    const { data, error, isLoading } = useGetAllPostsQuery();
    // @ts-ignore
    const { data: data2, error: error2, isLoading: isLoading2 } = useGetPostQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Posts</h1>
          <h2>{data2.title}</h2>
        <ul className="space-y-2">

          {data.map((post: any) => (
              <li key={post.id} className="border p-4 rounded">
                <h2 className="font-semibold">{post.title}</h2>
                  <p>{post.id}</p>
                <p>{post.body}</p>
              </li>
          ))}
        </ul>
      </div>
  );
}
