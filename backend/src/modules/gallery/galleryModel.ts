import { Schema, model } from 'mongoose';
import { IGallery, IGalleryImage } from './galleryInterface';

const galleryImageSchema = new Schema<IGalleryImage>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    { _id: true },
);

const gallerySchema = new Schema<IGallery>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        images: {
            type: [galleryImageSchema],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

export const Gallery = model<IGallery>('Gallery', gallerySchema);