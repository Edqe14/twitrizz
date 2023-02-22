import Button from '@/components/Button';
import Head from '@/components/Head';
import Input from '@/components/Input';
import Logo from '@/components/Logo';
import useUser from '@/hooks/useUser';
import fetcher from '@/lib/helpers/axios';
import unauthOnlyGetServerProps from '@/lib/helpers/unauthOnlyGetServerProps';
import { useForm } from '@mantine/form';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => {
        if (!value.length) return 'E-mail is required';
        if (!value.includes('@')) return 'E-mail is invalid';
      },
      password: (value) => {
        if (!value.length) return 'Password is required';
      },
    },
  });

  const onSubmit = form.onSubmit(async (values) => {
    try {
      setLoading(true);

      await fetcher('/auth/login', {
        method: 'POST',
        data: values,
      });

      router.push('/');
      useUser.getState().fetchUser();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const error = err as AxiosError;
      const data = error.response?.data as
        | { errors: { [key: string]: string } }
        | undefined;

      if (data?.errors) {
        form.setErrors(data.errors);
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      <Head title="Login - Twitrizz" />

      <main className="w-screen h-screen">
        <section className="w-1/2 mx-auto h-full flex flex-col items-center py-52">
          <Logo width={64} className="mb-24" />

          <form onSubmit={onSubmit}>
            <Input
              {...form.getInputProps('email')}
              className="w-[25rem] mb-3"
              label="E-mail"
              type="text"
              maxLength={75}
            />

            <Input
              {...form.getInputProps('password')}
              className="w-[25rem] mb-16"
              label="Password"
              type="password"
            />

            <Button
              loading={loading}
              type="submit"
              className="w-full block mb-4"
            >
              Login
            </Button>

            <p className="text-blue-bayoux">
              Don&apos;t have an account?{' '}
              <Link className="text-dodger-blue-600" href="/register">
                Register
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = unauthOnlyGetServerProps();
