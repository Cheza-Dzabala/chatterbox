import React from "react";

const AuthUserMessage = ({ message }) => {
  return (
    <div className="message-bubble message-bubble-user">
      <p className="message-bubble-text">{message.message}</p>
      <p className="message-bubble-username">@{message.sender_name}</p>
    </div>
  );
};

export default AuthUserMessage;
