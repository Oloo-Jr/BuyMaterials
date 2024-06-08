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
    const [loading, setIsLoading] = useState(true);

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
                setIsLoading(false);
            } else {
                console.log("Business details not found for the user.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching business details:", error);
            setIsLoading(false);
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

    const showButtons = (rowData) => {
        return (
          <div className="flex flex-row gap-2 items-center justify-between">
            <EyeIcon
            //   onClick={() => redirectToView(rowData.id)}
              className="w-5 h-5 text-gray-500 cursor-pointer"
            />
            <PencilIcon
            //   onClick={() => redirectToUpdate(rowData.id)}
              className="w-5 h-5 text-green-500 cursor-pointer"
            />
            <TrashIcon
            //   onClick={() => confirm(rowData.id)}
              className="w-5 h-5 text-red-500 cursor-pointer"
            />
          </div>
        );
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
            <div className='flex flex-col gap-4 sm:p-12 p-2'>
                <DataTable
                    className='text-sm'
                    value={products}
                    stripedRows
                    paginator
                    rows={10}
                    emptyMessage="No products added"
                    loading={loading}
                    rowsPerPageOptions={[10, 25, 50]}
                    tableStyle={{ minWidth: "50rem" }}
                >
                    <Column
                        className="border"
                        header="#"
                        body={(e, i) => i.rowIndex + 1}
                    ></Column>
                    <Column
                        className="border"
                        header="Name"
                        body={(rowData) => `${rowData.title}`}
                    ></Column>
                    <Column
                        className="border"
                        header="Price"
                        body={(rowData) => `Ksh. ${rowData.price}`}
                    ></Column>
                    <Column
                        className="border"
                        header="Quantity"
                        body={(rowData) => `${rowData.quantity}`}
                    ></Column>
                    <Column
                        className="border"
                        header="Description"
                        body={(rowData) => `${rowData.description}`}
                    ></Column>
                    <Column
                        className="border"
                        header="Actions"
                        body={showButtons}
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
}

export default Home;