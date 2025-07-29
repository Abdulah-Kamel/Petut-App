import React, { useState } from "react";
import {
  sendNotificationToUser,
  sendNotificationToAllUsers,
  sendNotificationToDoctors,
} from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const NotificationManager = () => {
  const { currentUser } = useAuth();
  const [notification, setNotification] = useState({
    title: "",
    body: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendToAll = () => {
    sendNotificationToAllUsers(notification, currentUser?.uid);
  };

  const handleSendToDoctors = () => {
    sendNotificationToDoctors(notification, currentUser?.uid);
  };

  const handleSendToUser = (userId) => {
    sendNotificationToUser(userId, notification, currentUser?.uid);
  };

  return (
    <div className="notification-manager">
      <h2>Send Notification</h2>
      <input
        type="text"
        name="title"
        value={notification.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <textarea
        name="body"
        value={notification.body}
        onChange={handleChange}
        placeholder="Body"
      />
      <button onClick={handleSendToAll}>Send to All</button>
      <button onClick={handleSendToDoctors}>Send to Doctors</button>
      <button onClick={() => handleSendToUser("USER_ID")}>
        Send to Specific User
      </button>
    </div>
  );
};

export default NotificationManager;
