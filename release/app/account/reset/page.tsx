import { redirect } from 'next/navigation';
import { currentUser } from '../../../lib/supabase';
import { ActionForm } from '../../../components/forms';
import { Heading } from '../../../components/ui';
import { resetAction } from '../../actions';
export default async function Reset() {
  if (!(await currentUser())) redirect('/recover');
  return (
    <div className="container auth-page">
      <Heading eyebrow="Account security" title="Choose a new password." />
      <ActionForm action={resetAction} label="Update password">
        <label>
          New password
          <input
            name="password"
            type="password"
            required
            minLength={12}
            maxLength={128}
            autoComplete="new-password"
          />
        </label>
        <label>
          Confirm new password
          <input
            name="confirm"
            type="password"
            required
            minLength={12}
            maxLength={128}
            autoComplete="new-password"
          />
        </label>
      </ActionForm>
    </div>
  );
}
