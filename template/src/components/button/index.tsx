import React from 'react';

import styles from './button.module.scss';

export enum ButtonType {
  Default = 'default',
  Primary = 'primary'
}

interface ButtonProps {
  type: ButtonType;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type = ButtonType.Default, children, ...props }) => (
  <button class={`${styles.button} ${styles[type]}`} {...props}>{children}</button>
);

export default Button;
