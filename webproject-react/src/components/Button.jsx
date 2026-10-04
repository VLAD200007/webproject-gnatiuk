export function Button({ variant = 'primary', disabled = false, onClick, children }) {
  return (
    <button
      className={`button button--${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}