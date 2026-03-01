import { model, Schema } from 'mongoose';
import { IAppointment } from './appointmentInterface';

const appointmentSchema = new Schema<IAppointment>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  service: { type: Schema.Types.ObjectId, required: true, ref: 'Service' },
  date: { type: Date, required: true },
});

export const Appointment = model<IAppointment>(
  'Appointment',
  appointmentSchema,
);
