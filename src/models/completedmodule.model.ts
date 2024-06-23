import { model, Schema, Document } from 'mongoose';
import { ICompletedModule } from '../interfaces/user.interface';

const CompletedModuleSchema: Schema<ICompletedModule> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'LearningModule', required: true },
    completedAt: { type: Date, default: Date.now }
});

const CompletedModule = model<ICompletedModule>('CompletedModule', CompletedModuleSchema);

export default CompletedModule;