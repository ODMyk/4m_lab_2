import classes from "./style.module.scss";

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

export const Button = ({
  children,
  onPress,
  className = "",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      className={`${classes.button} ${className}`}
      onClick={onPress}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
