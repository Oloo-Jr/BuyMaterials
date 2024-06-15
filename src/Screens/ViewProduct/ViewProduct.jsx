import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import MainHeader from '../../Components/Header/Header';
import { auth, db } from '../../Database/config';
import { PencilIcon } from "@heroicons/react/24/solid";
import { ProgressSpinner } from 'primereact/progressspinner';

const ViewProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [productData, setProductData] = useState([]);
    const [loading, setIsLoading] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate("/login");
            }
        });
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productRef = await db.collection("Products").doc(id).get();
                if (productRef.exists) {
                    setProductData(productRef.data());
                    setIsLoading(false);
                } else {
                    console.log("Product not found");
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const toEditProductPage = () => {
        return navigate('/edit-product/{id}');
    }

    return (
        <div className="flex flex-col">
            <MainHeader />
            <div className="flex items-center sm:px-20 px-6 py-4 justify-between">
                <h1 className="font-bold uppercase flex flex-col">
                    <div className='text-gray-900 text-2xl'></div>
                    <div className='text-xs text-gray-500 font-semibold'></div>
                </h1>
                <div className='bg-black text-white sm:text-sm text-[12px] rounded px-4 py-2 cursor-pointer font-medium flex gap-2 items-center' onClick={toEditProductPage}>
                    <PencilIcon className='w-4 h-4' />
                    <div onClick={toEditProductPage}>Edit Product Details</div>
                </div>
            </div>
            <div className='flex flex-col w-full sm:px-20 px-6 py-4'>
                {loading ?
                    <div className="card flex justify-content-center">
                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="5" />
                    </div>
                    :
                    <>Product Details</>}
            </div>
        </div>
    );
}

export default ViewProduct;