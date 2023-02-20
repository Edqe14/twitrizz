import Button from '@/components/Button';
import Head from '@/components/Head';
import Input from '@/components/Input';
import Logo from '@/components/Logo';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

export default function Login() {
  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validateInputOnBlur: true,
    clearInputErrorOnChange: false,
    validate: {
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

  const onSubmit = form.onSubmit((values) => {
    // TODO: register
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

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}
