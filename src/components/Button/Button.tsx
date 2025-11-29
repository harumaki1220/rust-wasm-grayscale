import styles from './Button.module.css';

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export function Button({ onClick, children }: ButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}
