import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // Type of notification (e.g., 'form_submit', 'service_event')
    message: { type: String, required: true }, // Notification message
    data: { type: mongoose.Schema.Types.Mixed, required: false }, // Additional data related to the notification
    isRead: { type: Boolean, default: false }, // Read status of the notification
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const NotificationModel = mongoose.model("notification", notificationSchema);

export default NotificationModel;
