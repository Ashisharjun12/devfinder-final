import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  githubUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true;
        return /^https?:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid GitHub repository URL`
    },
    default: null,
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  stage: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'],
    default: 'OPEN',
  },
  connectionRequests: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING'
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['OWNER', 'MEMBER'],
      default: 'MEMBER'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

ProjectSchema.index({ title: 'text', description: 'text' });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
