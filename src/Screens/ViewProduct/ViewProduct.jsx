import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import MainHeader from '../../Components/Header/Header';
import { auth, db } from '../../Database/config';
import { PencilIcon } from "@heroicons/react/24/solid";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';

const ViewProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate("/login");
            } else {
                getBusinessDetails(user.uid);
            }
        });
    }, []);

    const getBusinessDetails = async (userId) => {
        try {
            const businessRef = db.collection("Business").doc(userId);
            const businessSnapshot = await businessRef.get();
            if (businessSnapshot.exists) {
                const businessData = businessSnapshot.data();
                const productRef = businessRef.collection("Products").doc(id);
                const productSnapshot = await productRef.get();
                if (productSnapshot.exists) {
                    setProductData(productSnapshot.data());
                } else {
                    console.log("Product not found");
                }
            } else {
                console.log("Business details not found for the user.");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const toEditProductPage = () => {
        return navigate(`/edit-product/${id}`);
    };

    if (loading) {
        return (
            <div className="flex flex-col">
                <MainHeader />
                <div className="flex items-center sm:px-20 px-6 py-4 justify-between">
                    <h1 className="font-bold uppercase flex flex-col">
                        <Skeleton width="10rem" className="mb-2"></Skeleton>
                    </h1>
                    <div className='bg-black text-white sm:text-sm text-[12px] rounded px-4 py-2 cursor-pointer font-medium flex gap-2 items-center' onClick={toEditProductPage}>
                        <PencilIcon className='w-4 h-4' />
                        <div onClick={toEditProductPage}>Edit Product Details</div>
                    </div>
                </div>
                <div className='flex flex-col w-full sm:px-20 px-6 py-4'>
                    <div className="card flex justify-content-center">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="5" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <MainHeader />
            <div className="flex items-center sm:px-20 px-6 py-4 justify-between">
                <h1 className="font-bold uppercase flex flex-col">
                    <div className='text-gray-900 text-xl'>Product Details</div>
                    <div className='text-xs text-gray-500 font-semibold'>Manage Product Details and Stock Numbers.</div>
                </h1>
                <div className='bg-black text-white sm:text-sm text-[12px] rounded px-4 py-2 cursor-pointer font-medium flex gap-2 items-center' onClick={toEditProductPage}>
                    <PencilIcon className='w-4 h-4' />
                    <div onClick={toEditProductPage}>Edit Product Details</div>
                </div>
            </div>
            <div className='flex sm:flex-row flex-col gap-6 items-center w-full sm:px-20 px-6 py-4'>
                <img src={productData.imageUrl} alt='Image' className='w-56 h-auto mb-4'></img>
                <div className='flex flex-col gap-1'>
                    <div className='text-base font-normal'><strong>Name:</strong> {productData.title}</div>
                    <div className='text-base font-normal'><strong>Price:</strong> Ksh. {productData.price}</div>
                    <div className='text-base font-normal'><strong>Stock:</strong> {productData.quantity}</div>
                    <div className='text-base font-normal'><strong>Description:</strong> {productData.description}</div>
                </div>
            </div>
        </div>
    );
};

export default ViewProduct;
