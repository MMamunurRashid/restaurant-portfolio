import { model, Schema } from 'mongoose';
import { IAppointment } from './appointmentInterface';

const appointmentPackageSnapshotSchema = new Schema(
  {
    package: { type: Schema.Types.ObjectId, ref: 'Package' },
    title: { type: String, required: true },
    price: { type: Number },
    services: [{ type: String }],
    thumbnail: { type: String },
  },
  { _id: false },
);

const appointmentTableSnapshotSchema = new Schema(
  {
    table: { type: Schema.Types.ObjectId, ref: 'DiningTable' },
    tableNumber: { type: String, required: true },
    capacity: { type: Number, required: true },
    area: { type: String },
  },
  { _id: false },
);

const appointmentSchema = new Schema<IAppointment>(
  {
    reservationCode: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    packages: [{ type: Schema.Types.ObjectId, ref: 'Package' }],
    packageSnapshot: [appointmentPackageSnapshotSchema],
    assignedTable: { type: Schema.Types.ObjectId, ref: 'DiningTable' },
    tableSnapshot: appointmentTableSnapshotSchema,
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guestCount: { type: Number, required: true, default: 2, min: 1 },
    notes: { type: String, trim: true },
    adminNotes: { type: String, trim: true },
    cancelReason: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
      default: 'pending',
      index: true,
    },
    isRead: { type: Boolean, required: true, default: false },
    source: { type: String, enum: ['website', 'admin'], default: 'website' },
    contactedAt: { type: Date },
    confirmedAt: { type: Date },
    cancelledAt: { type: Date },
    completedAt: { type: Date },
    noShowAt: { type: Date },
    tableAssignedAt: { type: Date },
    reminderSentAt: { type: Date },
  },
  { timestamps: true },
);

export const Appointment = model<IAppointment>(
  'Appointment',
  appointmentSchema,
);
