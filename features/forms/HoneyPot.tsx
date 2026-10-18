import { Field } from 'formik';

// A trap field. Real visitors never see it or tab to it, so only bots fill it.
// Hidden off-screen (not display:none), because some bots skip hidden inputs.
const Honeypot = ({ idPrefix }: { idPrefix: string }) => (
  <div
    aria-hidden="true"
    className="absolute -left-[9999px] h-px w-px overflow-hidden"
  >
    <label htmlFor={`${idPrefix}-website`}>Website</label>
    <Field
      type="text"
      id={`${idPrefix}-website`}
      name="website"
      tabIndex={-1}
      autoComplete="off"
    />
  </div>
);

export default Honeypot;
