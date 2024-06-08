import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MainHeader from '../../Components/Header/Header';
import { auth, db } from '../../Database/config';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PlusCircleIcon
} from "@heroicons/react/24/solid";

const Home = () => {
    const navigate = useNavigate();

    const [business, setBusiness] = useState(null);
    const [products, setProducts] = useState([]);

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
            const docRef = db.collection("Business").doc(userId);
            const docSnapshot = await docRef.get();
            if (docSnapshot.exists) {
                setBusiness(docSnapshot.data());
                getProductsForBusiness(docRef);
            } else {
                console.log("Business details not found for the user.");
            }
        } catch (error) {
            console.error("Error fetching business details:", error);
        }
    };

    const getProductsForBusiness = async (businessRef) => {
        try {
            const productsRef = businessRef.collection("Products");
            const querySnapshot = await productsRef.get();
            const productsData = [];
            querySnapshot.forEach((doc) => {
                productsData.push(doc.data());
            });
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const toAddProductPage = () => {
        return navigate('/add-product');
    }

    return (
        <div className="flex flex-col">
            <MainHeader />
            <div className="flex items-center sm:px-20 px-6 py-4 justify-between">
                <h1 className="font-bold uppercase flex flex-col">
                    <div className='text-gray-900 text-2xl'>{business && business.businessname} </div>
                    <div className='text-xs text-gray-500'>{business && business.businessType}</div>
                </h1>
                <div className='bg-black text-white sm:text-sm text-[12px] rounded px-4 py-2 cursor-pointer font-medium flex gap-2 items-center' onClick={toAddProductPage}>
                    <PlusCircleIcon className='w-6 h-6' />
                    <div onClick={toAddProductPage}>Add a Product</div>
                </div>
            </div>
        </div>
    );
}

export default Home;