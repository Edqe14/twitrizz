/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/indent */
import useTweets from '@/hooks/useTweets';
import { Textarea, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeModal, openModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { pickBy } from 'lodash-es';
import { Paperclip, X } from 'phosphor-react';
import { useState } from 'react';
import Button from '@/components/Button';
import TweetMediaPreview from '@/components/TweetMediaPreview';
import { useAsync } from 'react-use';
import classNames from 'classnames';
import fetcher from './axios';

type Props = (
  | {
      edit: true;
      id: string;
      text?: string;
      mediaUrl?: string | null;
      replyToId?: string;
    }
  | {
      edit?: false;
      replyToId?: string;
    }
) & {
  onClose?: () => void;
};

const ComposeTweetContent = (props: Props) => {
  const form = useForm({
    initialValues: {
      text: props.edit ? props.text : '',
      replyToId: !props.edit ? props.replyToId : undefined,
      media: props.edit
        ? props.mediaUrl
        : (undefined as File | null | undefined),
    },
  });

  const replyingTo = useAsync(async () => {
    if (!props.replyToId) return null;

    return fetcher<{ tweet: TweetPreview & { replies: TweetPreviews } }>(
      `/tweet/${props.replyToId}`,
    ).then((res) => res.data);
  }, [props.replyToId]);

  // eslint-disable-next-line no-shadow
  const fetchTweets = useTweets(({ fetchTweets }) => fetchTweets);
  const [sending, setSending] = useState(false);
  const disabled = (!form.values.text && !form.values.media) || sending;
  const submit = form.onSubmit(async (values) => {
    if (!values.media && !values.text) return;

    const trimmed = pickBy(values, (v, key) => {
      if (props.edit && key === 'replyToId') return false;

      return v !== undefined;
    });
    const data = new FormData();

    Object.entries(trimmed).forEach(([key, value]) => {
      data.append(key, value as string | File);
    });

    try {
      setSending(true);

      await fetcher(props.edit ? `/tweet/${props.id}` : '/tweet', {
        method: props.edit ? 'PUT' : 'POST',
        data,
      });

      fetchTweets();
      closeModal('compose-tweet');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      showNotification({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    } finally {
      setSending(false);
    }
  });

  return (
    <section>
      {props.replyToId && (
        <p className="-mt-4 text-sm mb-3 text-zinc-400">
          Replying to{' '}
          <span className="text-blue-bayoux-400">
            @{replyingTo.value?.tweet.author.username}
          </span>
        </p>
      )}

      <form onSubmit={submit}>
        <Textarea
          placeholder="What are you thinking?"
          className="mb-4"
          maxLength={250}
          minRows={6}
          {...form.getInputProps('text')}
        ></Textarea>

        <input
          type="file"
          onChange={(e) =>
            form.setFieldValue('media', e?.target?.files?.[0] ?? null)
          }
          className="hidden"
          id="compose-input"
        />

        {/* Media */}
        {form.values.media && (
          <section className="mb-4 relative inline-block">
            <span
              className="absolute top-4 right-4 cursor-pointer z-10 mix-blend-difference"
              onClick={() => form.setFieldValue('media', null)}
            >
              <X className="text-white" weight="bold" size={24} />
            </span>

            <TweetMediaPreview media={form.values.media} />
          </section>
        )}

        <section className="flex justify-between">
          <Button
            loading={sending}
            disabled={disabled}
            type="submit"
            compact
            className="px-8 py-1 text-base"
          >
            {props.edit ? 'Save' : 'Tweet'}
          </Button>

          <section className="flex items-center">
            <Tooltip
              label="Add attachment"
              color="blue"
              withArrow
              arrowSize={6}
            >
              <label
                htmlFor="compose-input"
                className={classNames(
                  form.values.media &&
                    'opacity-50 cursor-not-allowed pointer-events-none',
                  'group hover:bg-dodger-blue p-1 rounded-full cursor-pointer transition-colors duration-100 ease-in-out',
                )}
              >
                <Paperclip
                  className="text-dodger-blue-600 group-hover:text-white transition-colors duration-100 ease-in-out"
                  size={22}
                  weight="regular"
                />
              </label>
            </Tooltip>
          </section>
        </section>
      </form>
    </section>
  );
};

const openComposeTweet = ({ onClose, ...options }: Props = {}) => {
  openModal({
    modalId: 'compose-tweet',
    // eslint-disable-next-line no-nested-ternary
    title: options.edit
      ? 'Edit tweet'
      : options.replyToId
      ? 'Reply tweet'
      : 'Post new tweet',
    children: <ComposeTweetContent {...options} />,
    size: 'lg',
    onClose,
  });
};

export default openComposeTweet;
