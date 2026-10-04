export function Alert({ variant = 'warning', children }) {
  return (
    <div className={`alert alert--${variant}`} role="alert">
      {children}
    </div>
  );
}