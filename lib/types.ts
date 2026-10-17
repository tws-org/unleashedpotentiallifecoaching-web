export interface IPageIds {
  page: string;
  id: string;
}

export type ContactForm = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

export type ReviewForm = {
  fullName: string;
  email: string;
  phone: string;
  rating: string;
  explanation: string;
  improvements: string;
  recommend: string;
  comments: string;
};

export type BookingForm = {
  eventDate: string;
  fullName: string;
  email: string;
  phone: string;
  rating: string;
  explanation: string;
  improvements: string;
  comments: string;
  subject: string;
  message: string;
  selectCoach: string;
};
