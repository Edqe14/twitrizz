import Button from '@/components/Button';
import Head from '@/components/Head';
import Input from '@/components/Input';
import Logo from '@/components/Logo';
import fetcher from '@/lib/helpers/axios';
import unauthOnlyGetServerProps from '@/lib/helpers/unauthOnlyGetServerProps';
import { useForm } from '@mantine/form';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Login() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    clearInputErrorOnChange: false,
    validate: {
      username: (value) => {
        if (!value.length) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
      },
      email: (value) => {
        if (!value.length) return 'E-mail is required';
        if (!value.includes('@')) return 'E-mail is invalid';
      },
      password: (value, values) => {
        if (!value.length) return 'Password is required';
        if (value !== values.confirmPassword) return 'Passwords do not match';
      },
      confirmPassword: (value, values) => {
        if (!value.length) return 'Confirm password is required';
        if (value !== values.password) return 'Passwords do not match';
      },
    },
  });

  useEffect(() => {
    if (!form.values.password && !form.values.confirmPassword) return;

    form.validateField('confirmPassword');
    form.validateField('password');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const onSubmit = form.onSubmit(async (values) => {
    try {
      await fetcher('/auth/register', {
        method: 'POST',
        data: values,
      });

      router.push('/setup');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const error = err as AxiosError;
      const data = error.response?.data as
        | { errors: { [key: string]: string } }
        | undefined;

      if (data?.errors) {
        form.setErrors(data.errors);
      }
    }
  });

  return (
    <>
      <Head title="Login" />

      <main className="w-screen h-screen">
        <section className="w-1/2 mx-auto h-full flex flex-col items-center justify-center -mt-8">
          <Logo width={64} height={64} className="mb-24" />

          <form onSubmit={onSubmit}>
            <Input
              {...form.getInputProps('username')}
              className="w-[25rem] mb-3"
              label="Username"
              type="text"
              maxLength={75}
            />

            <Input
              {...form.getInputProps('email')}
              className="w-[25rem] mb-3"
              label="E-mail"
              type="text"
              maxLength={75}
            />

            <Input
              {...form.getInputProps('password')}
              className="w-[25rem] mb-3"
              label="Password"
              type="password"
            />

            <Input
              {...form.getInputProps('confirmPassword')}
              className="w-[25rem] mb-16"
              label="Confirm Password"
              type="password"
            />

            <Button type="submit" className="w-full mb-4">
              Register
            </Button>

            <p className="text-blue-bayoux">
              Already have an account?{' '}
              <Link className="text-dodger-blue-600" href="/login">
                Login
              </Link>
            </p>
          </form>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = unauthOnlyGetServerProps();
