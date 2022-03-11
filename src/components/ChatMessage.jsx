function ChatMessage(props) {
  let message = props.message;
  let sender = props.username;
  const messageClass = message.username === sender ? "sent" : "received";
  const avatar = `https://avatars.dicebear.com/api/initials/${message.username}.svg`;
  const ts =
    new Date(message.timestamp).toLocaleDateString() +
    " " +
    new Date(message.timestamp).toLocaleTimeString();

  return (
    <div className={`message ${messageClass}`}>
      <a
        href={`https://kovan.etherscan.io/address/${message.sender}`}
        target="_blank"
      >
        <figure className={`figure figure-${messageClass}`}>
          <img className="avatar" src={avatar} alt="avatar" />
          <figcaption className="figure-caption">{message.username}</figcaption>
        </figure>
      </a>
      <div className={`message-text-${messageClass}`}>
        <p>{message.message}</p>
        <time className={`time-${messageClass}`}>{ts}</time>
      </div>
    </div>
  );
}

export default ChatMessage;
