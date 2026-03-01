import { CONFIG } from "@/config";
import { MdDeleteForever } from "react-icons/md";

interface GalleriesProps {
    galleries: { name: string; file: File }[];
    setGalleries: React.Dispatch<
        React.SetStateAction<{ name: string; file: File }[]>
    >;
    galleriesUrl?: string[];
    setGalleriesUrl?: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Galleries({
    galleries,
    setGalleries,
    galleriesUrl,
    setGalleriesUrl,
}: GalleriesProps) {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        const newImages = files.map((file) => ({
            name: file.name,
            file: file,
        }));

        // check file size max size 1MB
        const maxSizeInBytes = 1 * 1024 * 1024;
        const filteredImages = newImages?.filter((image) => {
            if (image.file.size > maxSizeInBytes) {
                alert(
                    `File ${image.name} is too large. Maximum size is 1MB. Please choose a smaller file.`
                );
                return false;
            }
            return true;
        });

        setGalleries((prevGalleries) => [...prevGalleries, ...filteredImages]);
    };

    const removeImage = (index: number) => {
        const updatedGallery = galleries.filter((_, i) => i !== index);
        setGalleries(updatedGallery);
    };

    const removeGalleryUrl = (index: number) => {
        if (!galleriesUrl || !setGalleriesUrl) return;
        const updatedGallery = galleriesUrl.filter((_, i) => i !== index);
        setGalleriesUrl(updatedGallery);
    };

    return (
        <div className="rounded border border-border p-4">
            <label className="text-sm">
                Edit Gallery
            </label>

            <div className="mt-2 text-sm">
                <div className="flex flex-wrap space-x-2">
                    {(galleriesUrl?.length ?? 0) > 0 &&
                        galleriesUrl?.map((img, index) => (
                            <div
                                key={index}
                                className="relative mb-2 h-14 w-20 overflow-hidden rounded object-cover"
                            >
                                <img
                                    src={CONFIG.API_PATH + img}
                                    alt={img}
                                    className="h-full w-full rounded border object-cover"
                                />

                                <button
                                    onClick={() => removeGalleryUrl(index)}
                                    className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/60 text-base-100 opacity-0 duration-300 hover:text-red-500 hover:opacity-100"
                                >
                                    <MdDeleteForever className="text-2xl" />
                                </button>
                            </div>
                        ))}

                    {galleries?.length > 0 &&
                        galleries?.map((img, index) => (
                            <div
                                key={index}
                                className="relative mb-2 h-14 w-20 overflow-hidden rounded object-cover"
                            >
                                <img
                                    src={URL.createObjectURL(img?.file)}
                                    alt={img?.name}
                                    className="h-full w-full rounded border object-cover"
                                />

                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/60 text-base-100 opacity-0 duration-300 hover:text-red-500 hover:opacity-100"
                                >
                                    <MdDeleteForever className="text-2xl" />
                                </button>
                            </div>
                        ))}

                    <div className="relative flex h-14 w-32 cursor-pointer items-center justify-center rounded border-2 border-dashed border-primary bg-primary/10">
                        <input
                            type="file"
                            multiple
                            className="absolute z-50 h-full w-full cursor-pointer"
                            style={{ opacity: 0, top: 0, left: 0, cursor: "pointer" }}
                            onChange={handleFileChange}
                        />

                        <span className="text-primary">+ Add more</span>
                    </div>
                </div>
            </div>
        </div>
    );
}