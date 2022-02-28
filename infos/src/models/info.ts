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

interface InfoModel extends mongoose.Model<InfoDoc> {
  build(attrs: InfoAttrs): InfoDoc;
}

const infoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
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

infoSchema.statics.build = (attrs: InfoAttrs) => {
  return new Info(attrs);
};

const Info = mongoose.model<InfoDoc, InfoModel>('Info', infoSchema);

export { Info };
