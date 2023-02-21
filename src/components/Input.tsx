import classNames from 'classnames';
import { nanoid } from 'nanoid/non-secure';
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  forwardRef,
} from 'react';

// eslint-disable-next-line prettier/prettier
interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  // eslint-disable-next-line prettier/prettier
  labelProps?: DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
  label?: ReactNode;
  inputClassName?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLDivElement, Props>(
  (
    {
      id: propsId,
      labelProps,
      label,
      className,
      inputClassName,
      fullWidth,
      ...props
    },
    ref,
  ) => {
    const id = propsId ?? nanoid(8);
    const labelClassName = labelProps?.className;

    return (
      <section
        ref={ref}
        className={classNames(
          'flex flex-col gap-1',
          !fullWidth && 'w-min',
          className,
        )}
      >
        <label
          {...labelProps}
          className={classNames(
            'font-semibold text-blue-bayoux text-base',
            labelClassName,
          )}
          htmlFor={id}
        >
          {label}
        </label>

        <input
          {...props}
          className={classNames(
            'rounded-full text-zinc-700 border-2 text-lg px-4 py-2 focus:outline-none transition-colors duration-300 ease-in-out',
            props.error ? 'border-red-200' : 'border-pattens-blue',
            inputClassName,
          )}
          id={id}
        />

        {props.error && (
          <span className="text-red-500 text-sm font-medium">
            {props.error}
          </span>
        )}
      </section>
    );
  },
);

Input.displayName = 'Input';

export default Input;
