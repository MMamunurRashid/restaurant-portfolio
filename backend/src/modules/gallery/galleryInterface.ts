import { Types, Document } from "mongoose";

export interface IGalleryImage {
    _id?: Types.ObjectId;
    title: string;
    image: string; 
}

export interface IGallery {
    title: string;
    images: IGalleryImage[];
    isActive: boolean;
    order: number;
}