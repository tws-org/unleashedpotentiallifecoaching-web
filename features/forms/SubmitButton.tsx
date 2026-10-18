import { useFormikContext } from 'formik';
import Button from 'components/ui/Button';

interface Props {
  label: string;
  busyLabel: string;
}

// Waits for the Turnstile token, so nobody can submit before the check
// finishes and get a 403.
const SubmitButton = ({ label, busyLabel }: Props) => {
  const { isSubmitting, values } = useFormikContext<{
    turnstileToken?: string;
  }>();
  const verifying = !values.turnstileToken;

  return (
    <Button
      disabled={isSubmitting || verifying}
      label={isSubmitting ? busyLabel : verifying ? 'Verifying…' : label}
    />
  );
};

export default SubmitButton;
