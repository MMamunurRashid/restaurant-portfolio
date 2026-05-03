import { model, Schema } from 'mongoose';
import { IAppointment } from './appointmentInterface';

const appointmentSchema = new Schema<IAppointment>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  address: { type: String },
  packages: [{ type: Schema.Types.ObjectId, ref: 'Package' }],
  date: { type: Date, required: true },
  time: { type: String },
  notes: { type: String },
});

export const Appointment = model<IAppointment>(
  'Appointment',
  appointmentSchema,
);
