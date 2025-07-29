export const generateMailOptions = ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  return {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    ...(html && { html }),
  };
};
