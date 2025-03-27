import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IFile extends Document {
  ownerId: IUser['_id'];
  name: string;
  path: string;
  url?: string; // URL for Vercel Blob (optional)
  size: number;
  type: string;
  uploadedAt: Date;
  downloadCount: number;
  locked: boolean;
  comment: string;
}

const FileSchema: Schema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'File name is required'],
    trim: true,
  },
  path: {
    type: String,
    required: [true, 'File path is required'],
  },
  url: {
    type: String,
    default: null,
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
  },
  type: {
    type: String,
    required: [true, 'File type is required'],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  comment: {
    type: String,
    default: '',
  },
});

// Create index on ownerId to make queries faster
FileSchema.index({ ownerId: 1 });

// Create index on name for faster searching
FileSchema.index({ name: 'text' });

const File = mongoose.models.File || mongoose.model<IFile>('File', FileSchema);

export default File; 