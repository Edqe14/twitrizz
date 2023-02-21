import tokenizeHashtags from '@/lib/helpers/tokenizeHashtags';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  DetailedHTMLProps,
  FormEventHandler,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function SearchInput({
  className,
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string[]>([]);

  useEffect(() => {
    if (router.query.q) {
      setToken(tokenizeHashtags(router.query.q as string));
    }
  }, [router.query]);

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const t = ev.currentTarget.value;
    setToken(tokenizeHashtags(t));
  };

  const submit: FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();

    router.push(`/search?q=${encodeURIComponent(token.join(' '))}`);
  };

  return (
    <form
      onSubmit={submit}
      className={classNames(
        'relative h-12 w-72 rounded-full overflow-hidden text-zinc-700 border-pattens-blue border-2 text-lg focus:outline-none transition-colors duration-300 ease-in-out',
        className,
      )}
    >
      <input
        onChange={handleChange}
        defaultValue={router.query.q}
        className="z-[5] w-full h-full px-4 py-2 outline-none text-transparent caret-black bg-transparent tracking-tight"
      />

      <section
        ref={ref}
        className="absolute inset-0 px-4 py-2 z-[-1] flex gap-[5px] items-center"
      >
        {token.length === 0 && (
          <span className="text-blue-bayoux-200">Search</span>
        )}
        {token.map((t) =>
          t.startsWith('#') ? (
            <span className="text-dodger-blue-600" key={t}>
              {t}
            </span>
          ) : (
            t
          ),
        )}
      </section>
    </form>
  );
}
