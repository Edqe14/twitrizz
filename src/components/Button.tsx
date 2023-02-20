import classNames from 'classnames';
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';

// eslint-disable-next-line prettier/prettier
const Button = forwardRef<HTMLButtonElement, DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>>((props, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={classNames(
        'bg-dodger-blue hover:bg-dodger-blue-600 transition-colors duration-200 ease-in-out text-white rounded-full px-8 py-3 text-lg font-semibold',
        props.className,
      )}
    />
  );
});

Button.displayName = 'Button';

export default Button;
