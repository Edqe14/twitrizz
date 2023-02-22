/* eslint-disable no-underscore-dangle */
import Link from 'next/link';
import useSWR, { mutate } from 'swr';

export default function PopularTags() {
  const { data } = useSWR<{ data: PopularTag[] }>('/tag/popular');

  return (
    <section className="border border-dodger-blue-300 w-72 rounded-2xl divide-y">
      <h2 className="text-xl font-semibold tracking-tighter px-6 py-4">
        Popular Tags
      </h2>

      {data?.data.map((tag) => (
        <Link
          key={tag.id}
          className="block px-6 py-4"
          href={`/search?q=${encodeURIComponent(`#${tag.name}`)}`}
          onClick={() =>
            mutate(`/tweet/search?q=${encodeURIComponent(`#${tag.name}`)}`)
          }
        >
          <h3 className="font-semibold text-lg text-dodger-blue-600 mb-1">
            #{tag.name}
          </h3>

          <p className="text-xs text-blue-bayoux-100">
            <span className="text-blue-bayoux-300 font-medium">
              {tag._count.tagged}
            </span>{' '}
            tweets
          </p>
        </Link>
      ))}
    </section>
  );
}
