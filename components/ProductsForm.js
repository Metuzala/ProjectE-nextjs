import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    price: exictingPrice,
    description: exictingDescription,
    images: exictingImages,
}) {
    const [title, setTitle] = useState(existingTitle || "");
    const [description, setDescription] = useState(exictingDescription || "")
    const [images, setImages] = useState(exictingImages || [])
    const [price, setPrice] = useState(exictingPrice || "")
    const [goToProducts, setGoToProducts] = useState(false)
    const [isuploading, setIsUploading] = useState(false)
    const router = useRouter();


    async function saveProduct(e) {
        const data = { title, description, price, images };
        e.preventDefault();
        if (_id) {
            await axios.put("/api/products", { ...data, _id });
        } else {

            await axios.post("/api/products", data);
        }
        setGoToProducts(true)
    }
    if (goToProducts) {
        router.push("/products").then(() => {
            // do nothing, since the router has already navigated
        });
        return null; // return null here to avoid rendering the component
    }
    async function uploadImages(e) {
        const files = e.target?.files;
        if (files?.length > 0) {
            setIsUploading(true)
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false)
        }
    }
    function updateImagesOrder(images){
        setImages(images)
    }
    return (
        <form onSubmit={saveProduct}>
            <label htmlFor="">Product name</label>
            <input
                value={title}
                type="text"
                placeholder="product name"
                onChange={e => setTitle(e.target.value)} />
            <label>
                Photos
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable 
                list={images}
                 setList={updateImagesOrder}
                 className="flex flex-wrap gap-1"
                 >
                {!!images?.length && images.map(link => (
                    <div key={link} className="h-24">
                        <img src={link} alt="" className="rounded-lg" />
                    </div>
                ))}
                </ReactSortable>
                {isuploading && (
                    <div className="h-24">
                        <Spinner />
                    </div>
                )}
                <label className=" w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        onChange={uploadImages} />
                </label>
                {!images?.length && (
                    <div>No photos in this product</div>
                )}
            </div>

            <label htmlFor="">Description</label>
            <textarea
                vale={description}
                placeholder="description"
                onChange={e => setDescription(e.target.value)}></textarea>
            <label htmlFor="">Price (in EUR)
            </label>
            <input value={price}
                type="text"
                placeholder="price"
                onChange={e => setPrice(e.target.value)} />
            <button type="submit" className="btn-primary">Save</button>
        </form>
    )
};