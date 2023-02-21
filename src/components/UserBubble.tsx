/* eslint-disable @next/next/no-img-element */
import useUser from '@/hooks/useUser';
import { USER_IMAGE_PLACEHOLDER } from '@/lib/constants';
import fetcher from '@/lib/helpers/axios';
import openUserSettings from '@/lib/helpers/openUserSettings';
import { Menu } from '@mantine/core';
import { useRouter } from 'next/router';
import { DotsThreeVertical, Pencil, SignOut } from 'phosphor-react';

export default function UserBubble() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <section className="bg-pattens-blue rounded-full p-2 pr-5 flex items-center gap-8">
      <section className="flex gap-3 items-center">
        <img
          src={user?.image ?? USER_IMAGE_PLACEHOLDER}
          alt=""
          className="rounded-full bg-pattens-blue-50 w-12"
        />

        <h3 className="font-semibold text-lg text-blue-bayoux">
          {user?.username}
        </h3>
      </section>

      <Menu position="top-end" offset={35} width={175}>
        <Menu.Target>
          <DotsThreeVertical
            className="text-blue-bayoux cursor-pointer"
            size={24}
            weight="bold"
          />
        </Menu.Target>

        <Menu.Dropdown className="translate-x-4">
          <Menu.Item
            color="blue"
            icon={<Pencil />}
            onClick={() => openUserSettings()}
          >
            Edit Profile
          </Menu.Item>

          <Menu.Item
            onClick={() =>
              fetcher('/auth/logout', { method: 'POST' }).then(() =>
                router.push('/login'),
              )
            }
            color="red"
            icon={<SignOut />}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </section>
  );
}
