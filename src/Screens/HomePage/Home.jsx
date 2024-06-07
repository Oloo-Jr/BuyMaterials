import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MainHeader from '../../Components/Header/Header';
import { auth } from '../../Database/config';
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

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate("/login");
            }
        });
    }, []);

    const toAddProductPage = () => {
        return navigate('/add-product');
    }

    return (
        <div className="flex flex-col">
            <MainHeader />
            <div className="flex items-center sm:px-20 px-6 py-4 justify-between">
                <h1 className="font-bold text-lg uppercase">
                    <span className='text-red-500'>Hardware </span>Products Inventory
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