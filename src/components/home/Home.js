import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Picker from "emoji-picker-react";
import AuthUserMessage from "./bubbles/authUserMessage";
import OtherUserMessage from "./bubbles/otherUserMessage";

import "./styles/styles.css";
import axiosInstance from "../../utils/axios";

const Home = () => {
  const [user, setUser] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [inQ, setInQ] = useState({});
  const [offlineUser, setOfflineUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [showEmojis, setShowEmojies] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(newMessage + emojiObject.emoji);
  };

  const getUser = async () => {
    const unparsed = window.localStorage.getItem("user");
    const user = await JSON.parse(unparsed);
    setUser(user);
  };

  useEffect(() => {
    if (offlineUser !== null) {
      if (Object.keys(offlineUser).length > 0) {
        setOnlineUsers(
          onlineUsers.filter((user) => user.email !== offlineUser.email)
        );
      }
    }
  }, [offlineUser]);

  const onUserOffline = (user) => {
    console.log("User went offline", user);
    setOfflineUser(user);
  };

  useEffect(() => {
    if (Object.keys(inQ).length > 0) {
      if (!onlineUsers.some((usr) => usr.email === inQ.email)) {
        inQ.online = true;
        setOnlineUsers((users) => [...users, inQ]);
      }
    }
  }, [inQ]);

  const sendMessage = () => {
    socket.emit("messages", {
      sender_id: user.id,
      sender_name: user.username,
      message: newMessage,
    });
    setNewMessage("");
  };
  const subScribeToSocketIO = () => {
    socket.on("user_online", (data) => {
      data.forEach((item) => {
        if (item.email !== user.email) {
          setInQ(item);
        }
      });
    });
    socket.on("user_offline", (data) => {
      onUserOffline(data);
    });

    socket.on("new_message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });
  };

  useEffect(() => {
    if (socket !== null) {
      subScribeToSocketIO();
    }
  }, [socket]);

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      setSocket(
        io("http://localhost:3000", {
          withCredentials: false,
          extraHeaders: {
            Authorization: `Bearer ${user.token}`,
          },
        })
      );
    }
  }, [user]);

  const getMessages = () => {
    axiosInstance
      .get("/messages")
      .then((res) => {
        const data = res.data.data;
        data.forEach((msg) => {
          setMessages((messages) => [...messages, msg]);
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  useEffect(() => {
    getUser();
    getMessages();
    return () => {};
  }, []);
  return (
    <div className="container">
      <div className="menu-bar">
        <p>Welcome {user.name}</p>
        <button className="button button-danger">Logout</button>
      </div>
      <div className="chat-container">
        <div className="sidebar">
          <ul className="message-list">
            {onlineUsers.map((user) => {
              return (
                <li key={user.socketId} className="message-list-item">
                  {user.name}

                  <span
                    className={`dot ${
                      user.online ? "dot-online" : "dot-offline"
                    }`}
                  ></span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="chat-area">
          <div className="messages-view">
            {messages.map((message) => {
              return message.sender_id === user.id ? (
                <AuthUserMessage message={message} />
              ) : (
                <OtherUserMessage message={message} />
              );
            })}
          </div>
          <div className="input-bar ">
            <input
              className="input"
              name="message"
              placeholder="say something..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />

            <button
              className="button button-small button-primary"
              onClick={() => setShowEmojies(!showEmojis)}
            >
              emoji
            </button>
            <button
              className="button button-small button-primary"
              onClick={() => newMessage !== "" && sendMessage()}
            >
              Send
            </button>
          </div>
        </div>
        <span style={{ visibility: showEmojis ? "visible" : "hidden" }}>
          <Picker onEmojiClick={onEmojiClick} />
        </span>
      </div>
    </div>
  );
};

export default Home;
