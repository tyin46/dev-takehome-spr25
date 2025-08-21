import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  requestorName: string;
  itemRequested: string;
  createdDate: Date;
  lastEditedDate?: Date;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
}

const RequestSchema: Schema = new Schema({
  requestorName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true
  },
  itemRequested: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastEditedDate: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'approved', 'rejected'],
    default: 'pending'
  }
});

// Index for efficient querying by status and date
RequestSchema.index({ status: 1, createdDate: -1 });

export default mongoose.models.Request || mongoose.model<IRequest>('Request', RequestSchema);
