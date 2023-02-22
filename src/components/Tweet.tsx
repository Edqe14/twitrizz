/* eslint-disable no-underscore-dangle */
/* eslint-disable @next/next/no-img-element */
import { USER_IMAGE_PLACEHOLDER } from '@/lib/constants';
import { Tweet } from '@prisma/client';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { Chat, DotsThree, Pencil, Trash } from 'phosphor-react';
import useUser from '@/hooks/useUser';
import { Menu } from '@mantine/core';
import fetcher from '@/lib/helpers/axios';
import openComposeTweet from '@/lib/helpers/openComposeTweet';
import { showNotification } from '@mantine/notifications';
import router from 'next/router';
import tokenizeHashtags from '@/lib/helpers/tokenizeHashtags';
import { useAsync } from 'react-use';
import TweetMediaPreview from './TweetMediaPreview';
import Twemoji from './Twemoji';

type Props = Tweet & {
  _count: {
    replies: number;
  };
  author: {
    id: string;
    username: string;
    image: string | null;
  };
} & { mutate?: () => void };

export default function TweetRenderer(props: Props) {
  // eslint-disable-next-line no-shadow
  const user = useUser(({ user }) => user);
  const tokens = tokenizeHashtags(props.text);

  const replyTo = useAsync(async () => {
    if (!props.replyToId) return;

    return fetcher
      .get<{ tweet: TweetPreview }>(`/tweet/${props.replyToId}`)
      .then((res) => res.data);
  }, [props.replyToId]);

  return (
    <section className="flex p-5 gap-4">
      <Link href={`/u/${props.author.username}`} className="flex-shrink-0">
        <img
          src={props.author.image ?? USER_IMAGE_PLACEHOLDER}
          alt=""
          className="w-12 h-12 rounded-full bg-pattens-blue-50"
        />
      </Link>

      <Link href={`/tweet/${props.id}`} className="flex-grow">
        <section className="flex items-center gap-2">
          <Link href={`/u/${props.author.username}`}>
            <h3 className="font-semibold text-base text-blue-bayoux-700">
              {props.author.username}
            </h3>
          </Link>

          <p className="text-xs text-blue-bayoux-200">•</p>

          <span className="text-xs text-blue-bayoux-500">
            {DateTime.fromJSDate(props.createdAt).toLocaleString(
              DateTime.DATE_MED,
            )}
          </span>
        </section>

        {props.replyToId && replyTo.value && (
          <p className="text-sm text-blue-bayoux-300 my-1">
            Replying to{' '}
            <span className="text-dodger-blue-600">
              @{replyTo.value.tweet.author.username}
            </span>
          </p>
        )}

        <Twemoji className="font-poppins text-lg text-zinc-800 mb-1">
          {tokens.map((t) =>
            t.startsWith('#') ? (
              <Link
                className="text-dodger-blue-600"
                href={`/search?q=${encodeURIComponent(t)}`}
                key={t}
              >
                {t}
              </Link>
            ) : (
              t
            ),
          )}
        </Twemoji>

        {props.mediaUrl && <TweetMediaPreview media={props.mediaUrl} />}

        <section className="mt-2">
          <p className="text-blue-bayoux-200 flex items-center gap-2">
            <Chat />
            <span className="text-xs">{props._count.replies}</span>
          </p>
        </section>
      </Link>

      {user?.id === props.author.id && (
        <Menu position="bottom-end" width={150}>
          <Menu.Target>
            <DotsThree
              size={24}
              weight="bold"
              className="text-blue-bayoux-700 cursor-pointer"
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              color="blue"
              icon={<Pencil size={16} />}
              onClick={() =>
                openComposeTweet({
                  edit: true,
                  id: props.id,
                  onClose: props.mutate,
                  mediaUrl: props.mediaUrl,
                  text: props.text,
                })
              }
            >
              Edit
            </Menu.Item>

            <Menu.Item
              color="red"
              icon={<Trash size={16} />}
              onClick={async () => {
                try {
                  await fetcher.delete(`/tweet/${props.id}`);
                  await router.push('/');

                  showNotification({
                    title: 'Success',
                    message: 'Tweet deleted',
                    color: 'green',
                  });
                } catch {
                  showNotification({
                    title: 'Error',
                    message: 'Something went wrong',
                    color: 'red',
                  });
                }
              }}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </section>
  );
}
