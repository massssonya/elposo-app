import { InputHTMLAttributes, ReactNode } from 'react';
import styles from './SelectionControl.module.css';

interface SelectionControlProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type: 'checkbox' | 'radio';
  children?: ReactNode;
  containerClassName?: string; 
}

export const SelectionControl = ({
  type,
  children,
  checked,
  containerClassName,
  className,
  ...props
}: SelectionControlProps) => {
  
  const containerClass = [
    styles.container,
    checked ? styles.checked : '',
    containerClassName || ''
  ].join(' ');

  const controlClass = [
    styles.control,
    type === 'radio' ? styles.radio : styles.checkbox
  ].join(' ');

  return (
    <label className={containerClass}>
      <input
        type={type}
        checked={checked}
        className={styles.nativeInput}
        {...props}
      />
      <div className={controlClass} />
      {children && <span className={styles.labelContent}>{children}</span>}
    </label>
  );
};
