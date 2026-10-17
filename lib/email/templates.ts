import { formatDateToReadableString } from 'lib/helpers';
import type {
  BookingFormValues,
  ContactFormValues,
  ReviewFormValues,
} from 'lib/forms/schemas';

// The browser sends dates as ISO strings (JSON).
type BookingEmail = Omit<BookingFormValues, 'eventDate'> & {
  eventDate: string;
  selectCoach?: string;
};

export const reviewTemplate = (review: ReviewFormValues) => {
  const {
    fullName,
    email,
    phone,
    rating,
    explanation,
    improvements,
    recommend,
    comments,
  } = review;

  const subject = 'Someone left a review on unleashedpotentiallifecoaching.com';
  const body = `
  <h2>There was a recent submission to the review form on unleashedpotentiallifecoaching.com/</h2>
  <p style="margin-bottom:35px; font-size: 18px;"><u>Here are the details:</u></p>
  <p style="margin-bottom:12px; font-size: 18px;"><strong>Full name: </strong>${fullName}</p>
  <p style="margin-bottom:12px; font-size: 18px;"><strong>Email: </strong>${email}</p>
  <p style="margin-bottom:12px; font-size: 18px;"><strong>Phone: </strong>${phone}</p>
  <p style="margin-bottom:12px; font-size: 18px;"><strong>Rate our services: </strong>${rating}</p>
  <p style="margin-bottom:12px; font-size: 18px;"><strong>What did you like best?</strong></p>
  <p>${explanation}</p>
  <p style="margin-bottom:12px; font-size: 18px;"><strong>How can we improve?</strong></p>
  <p>${improvements}</p>
  <p style="margin-bottom:12px; font-size: 18px;"><strong>Would you recommend us to your friends? </strong>${recommend}</p>
  <p style="margin-bottom:12px; font-size: 18px;"><strong>Anything else you would like to add?</strong></p>
  <p>${comments}</p>
`;
  console.log({
    body,
  });
  return {
    body,
    subject,
  };
};

export const contactTemplate = (contact: ContactFormValues) => {
  const emailSubject =
    'Someone contacted you on unleashedpotentiallifecoaching.com';

  const { fullName, email, message } = contact;
  const body = `
      <h2>There was a recent submission to the contact form on unleashedpotentiallifecoaching.com/</h2>
      <p style="margin-bottom:35px; font-size: 18px;"><u>Here are the details:</u></p>
      <p style="margin-bottom:12px; font-size: 18px;"><strong>Full name: </strong>${fullName}</p>
      <p style="margin-bottom:12px; font-size: 18px;"><strong>Email: </strong>${email}</p>
      <p style="margin-bottom:12px; font-size: 18px;"><strong>Brief Message</strong></p>
      <p>${message}</p>
    `;

  return {
    subject: emailSubject,
    body,
  };
};

export const bookingTemplate = (booking: BookingEmail) => {
  const {
    comments,
    email,
    fullName,
    phone,
    selectCoach = 'Jess Rebelo',
    eventDate,
  } = booking;

  const bookingDate = formatDateToReadableString(eventDate);

  const bookingSubject = `Someone has booked time with ${selectCoach} from unleashedpotentiallifecoaching.com`;
  const body = `
      <h2>Details on the recent booking request from ${selectCoach}</h2>
      <p style="margin-bottom:35px; font-size: 18px;"><u>Here are the details:</u></p>
      <p style="margin-bottom:12px; font-size: 18px;"><strong>Full name: </strong>${fullName}</p>
      <p style="margin-bottom:12px; font-size: 18px;"><strong>Email: </strong>${email}</p>
      <p style="margin-bottom:12px; font-size: 18px;"><strong>Phone: </strong>${phone}</p>
      <p style="margin-bottom:12px; font-size: 18px;"><strong>Date/Time: </strong>${bookingDate}</p>
      <p style="margin-bottom:12px; font-size: 18px;"><strong>Additional comments</strong></p>
      <p>${comments}</p>
    `;

  return {
    subject: bookingSubject,
    body,
  };
};
