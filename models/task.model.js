const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    category: { type: String, required: true },
    status: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure userId is here
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('Task', TaskSchema);
