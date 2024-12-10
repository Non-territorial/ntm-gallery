import { clsx } from 'clsx/lite';

export default function ShareButton({
  path,
  prefetch,
  shouldScroll,
  dim,
  className,
}: {
  path: string
  prefetch?: boolean
  shouldScroll?: boolean
  dim?: boolean
  className?: string
}) {
  return (
    <button
      className={clsx(
        className,
        dim ? 'text-dim' : 'text-medium',
        'inline-flex items-center gap-2'
      )}
      onClick={() => {
        console.log('ShareButton clicked!');
        alert(`This would initiate a BUY process for path: ${path}`);
      }}
    >
      <span>BUY</span>
    </button>
  );
}
