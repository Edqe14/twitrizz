import Head from '@/components/Head';
import MainLayout from '@/components/layout/Main';
import protectedGetServerProps from '@/lib/helpers/protectedGetServerProps';

export default function Home() {
  return (
    <>
      <Head />

      <MainLayout></MainLayout>
    </>
  );
}

export const getServerSideProps = protectedGetServerProps();
