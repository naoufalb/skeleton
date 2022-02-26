import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface InfoAttrs {
  title: string;
  content: string;
  userId: string;
}

interface InfoDoc extends mongoose.Document {
  title: string;
  content: string;
  userId: string;
  version: number;
  orderId?: string;
}

interface InfoModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const infoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
infoSchema.set('versionKey', 'version');
infoSchema.plugin(updateIfCurrentPlugin);

infoSchema.statics.build = (attrs: TicketAttrs) => {
  return new Info(attrs);
};

const Info = mongoose.model<TicketDoc, TicketModel>('Info', infoSchema);

export { Info };
