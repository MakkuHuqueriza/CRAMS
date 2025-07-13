import * as React from "react";

type ContactUsEmailTemplateProps = {
  name: string;
  email: string;
  message: string;
};

const ContactUsEmailTemplate: React.FC<ContactUsEmailTemplateProps> = ({
  name,
  email,
  message,
}) => (
  <div>
    <h2>New Contact Us Message</h2>
    <ul>
      <li>
        <strong>Name:</strong> {name}
      </li>
      <li>
        <strong>Email:</strong> {email}
      </li>
    </ul>
    <p>
      <strong>Message:</strong>
    </p>
    <p>{message}</p>
  </div>
);

export default ContactUsEmailTemplate;
