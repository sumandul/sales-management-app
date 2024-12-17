// import firebaseAdmin from "../firebase/index.js";
import NotificationModel from "../models/Notification.js";

class NotificationController {
  //create service
  static createNotification = async (req, res, next) => {
    try {
      const { type, message, data } = req.body;

      const notification = new NotificationModel({
        type,
        message,
        data,
      });

      await notification.save();

      const notificationMessage = {
        notification: {
          title: "New Notification",
          body: message,
        },
        topic: "admin",
      };

      try {
        // await firebaseAdmin.messaging().send(notificationMessage);
        res.status(200).send("Notification sent");
      } catch (error) {
        res.status(500).send("Error sending notification");
      }
    } catch (error) {
      next({ message: error.message, statusCode: error.statusCode || 400 });
    }
  };
}

export default NotificationController;
