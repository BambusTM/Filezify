import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IFile } from './File';

export type PermissionType = 'read' | 'write';

export interface IPermission extends Document {
  userId: IUser['_id'];
  fileId: IFile['_id'];
  permissionType: PermissionType;
  grantedAt: Date;
}

const PermissionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileId: {
    type: Schema.Types.ObjectId,
    ref: 'File',
    required: true,
  },
  permissionType: {
    type: String,
    enum: ['read', 'write'],
    required: [true, 'Permission type is required'],
  },
  grantedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index for userId and fileId to ensure uniqueness
PermissionSchema.index({ userId: 1, fileId: 1 }, { unique: true });

const Permission = mongoose.models.Permission || mongoose.model<IPermission>('Permission', PermissionSchema);

export default Permission; 