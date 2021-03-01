import React from "react";

const OtherUserMessage = ({ message }) => {
  return (
    <div className="message-bubble message-bubble-other">
      <p className="message-bubble-text">{message.message}</p>
      <p className="message-bubble-username">@{message.sender_name}</p>
    </div>
  );
};

export default OtherUserMessage;
