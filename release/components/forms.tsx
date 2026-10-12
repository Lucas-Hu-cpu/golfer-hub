'use client';
import { useActionState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import type { ActionState } from '../app/actions';

export function Submit({
  children,
  className = 'button',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button className={className} disabled={pending} type="submit">
      {pending ? 'Saving...' : children}
    </button>
  );
}
export function ActionForm({
  action,
  children,
  label = 'Save',
  className = 'form',
}: {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  const [state, dispatch] = useActionState(action, {});
  return (
    <form action={dispatch} className={className}>
      {children}
      <Submit>{label}</Submit>
      <div aria-live="polite">
        {state.error && (
          <p className="notice error" role="alert">
            {state.error}
          </p>
        )}
        {state.message && <p className="notice success">{state.message}</p>}
      </div>
    </form>
  );
}
