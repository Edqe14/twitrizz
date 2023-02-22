/* eslint-disable @next/next/no-img-element */
import cropImage from '@/lib/helpers/cropImage';
import { Input, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeModal, openModal } from '@mantine/modals';
import { ChangeEvent, useMemo, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import Button from '@/components/Button';
import useUser from '@/hooks/useUser';
import { Plus } from 'phosphor-react';
import { USER_IMAGE_PLACEHOLDER } from '../constants';
import fetcher from './axios';

const UserSettingsContent = () => {
  // firebase
  const { user, fetchUser } = useUser();
  const [sending, setSending] = useState(false);
  const form = useForm({
    initialValues: {
      image: null as Blob | File | null,
      bio: user?.bio as string | null,
    },
  });

  const disabled = (!form.values.image && !form.values.bio) || sending;

  const onImageChange = async (ev: ChangeEvent<HTMLInputElement>) => {
    const image = ev.target.files?.[0];
    if (!image) return;

    const cropped = await cropImage(image);
    form.setFieldValue('image', cropped);
  };

  const imageUrl = useMemo(
    () =>
      form.values.image
        ? URL.createObjectURL(form.values.image)
        : user?.image ?? USER_IMAGE_PLACEHOLDER,
    [form.values.image, user],
  );

  const submit = async () => {
    if (sending) return;

    setSending(true);

    const data = new FormData();

    if (form.values.image) data.append('image', form.values.image);
    if (form.values.bio) data.append('bio', form.values.bio);

    try {
      await fetcher.put('/user/@me', data);

      await fetchUser();

      closeModal('user-settings');
      showNotification({
        title: 'Saved',
        message: 'User profile changed',
        color: 'green',
      });
    } catch (e) {
      showNotification({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section>
      <Input.Wrapper label="Profile Picture" className="mb-2">
        <input
          onChange={onImageChange}
          type="file"
          className="hidden"
          id="image_upload"
          accept="image/png, image/jpeg, image/webp"
        />
        <label
          htmlFor="image_upload"
          className="relative border border-slate-300 rounded-xl p-3 w-44 group overflow-hidden"
        >
          <span className="opacity-0 group-hover:opacity-100 group-hover:cursor-pointer transition-opacity duration-100 ease-in-out absolute inset-0 flex justify-center items-center bg-blue-bayoux-50 bg-opacity-30">
            <Plus className="text-white" size={24} weight="bold" />
          </span>

          <img
            src={imageUrl}
            alt=""
            className="rounded-full bg-pattens-blue-50"
          />
        </label>
      </Input.Wrapper>

      <Textarea
        label="Bio"
        className="w-full mb-12"
        maxLength={250}
        minRows={4}
        {...form.getInputProps('bio')}
      ></Textarea>

      <Button
        loading={sending}
        className="w-full"
        onClick={submit}
        disabled={disabled}
      >
        Save
      </Button>
    </section>
  );
};

const openUserSettings = (onClose?: () => void) => {
  openModal({
    modalId: 'user-settings',
    title: 'User Settings',
    size: 'md',
    onClose,
    children: <UserSettingsContent />,
  });
};

export default openUserSettings;
