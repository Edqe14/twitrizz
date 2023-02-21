/* eslint-disable @typescript-eslint/indent */
import { Loader } from '@mantine/core';
import classNames from 'classnames';
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean;
  compact?: boolean;
}

// eslint-disable-next-line prettier/prettier
const Button = forwardRef<HTMLButtonElement, Props>(({ loading, compact, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={classNames(
          'transition-colors duration-200 ease-in-out text-white flex flex-col justify-center items-center rounded-full text-lg font-semibold',
          props.className,
          props.disabled
            ? 'bg-dodger-blue-300'
            : 'bg-dodger-blue hover:bg-dodger-blue-600',
          !compact && 'px-8 py-3',
        )}
      >
        {loading ? (
          <Loader color="white" size="sm" className="my-1" />
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
