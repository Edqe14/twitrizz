import Button from '@/components/Button';
import Head from '@/components/Head';
import Input from '@/components/Input';
import Logo from '@/components/Logo';
import { useForm } from '@mantine/form';

export default function Login() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validateInputOnBlur: true,
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

  const onSubmit = form.onSubmit((values) => {
    // TODO: login
  });

  return (
    <>
      <Head title="Login" />

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

            <Button type="submit" className="w-full block">
              Login
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}
