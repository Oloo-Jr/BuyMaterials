import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../Database/config';
import firebase from 'firebase/app';
import MainHeader from '../../Components/Header/Header';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';

const EditProduct = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [productData, setProductData] = useState({
        title: '',
        price: '',
        quantity: '',
        description: '',
        imageUrl: '',
    });

    const [nameError, setNameError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/login');
            } else {
                fetchProductData(user.uid);
            }
        });
    }, []);

    const fetchProductData = async (userId) => {
        try {
            const businessRef = db.collection('Business').doc(userId);
            const productRef = businessRef.collection('Products').doc(id);
            const productSnapshot = await productRef.get();
            if (productSnapshot.exists) {
                const data = productSnapshot.data();
                setProductData({
                    title: data.title,
                    price: data.price,
                    quantity: data.quantity,
                    description: data.description,
                    imageUrl: data.imageUrl,
                });
            } else {
                console.log('Product not found');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product data:', error);
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!productData.title) {
            setNameError(true);
            return;
        }

        if (!productData.price) {
            setPriceError(true);
            return;
        }

        if (!productData.quantity) {
            setQuantityError(true);
            return;
        }

        if (!productData.description) {
            setDescriptionError(true);
            return;
        }

        setLoading(true);

        try {
            let imageUrl = productData.imageUrl;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            await db
                .collection('Business')
                .doc(auth.currentUser.uid)
                .collection('Products')
                .doc(id)
                .update({
                    title: productData.title,
                    price: productData.price,
                    quantity: productData.quantity,
                    description: productData.description,
                    imageUrl: imageUrl,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });

            toast.current.show({
                severity: 'success',
                summary: 'Product Updated',
                detail: 'Product details updated successfully!',
                life: 3000,
            });

            setLoading(false);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error('Error updating product:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Update Failed',
                detail: 'Failed to update product details. Please try again.',
                life: 3000,
            });
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        navigate('/');
    };

    // File upload handling
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setImageFile(file);
    };

    const uploadImage = async (image) => {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`PostImage/${id}`);
        await fileRef.put(image);
        const imageUrl = await fileRef.getDownloadURL();
        return imageUrl;
    };

    return (
        <div className='flex flex-col'>
            <Toast ref={toast} position='bottom-left' />
            <MainHeader />
            <div className='flex gap-2 w-full justify-center text-2xl capitalize font-bold py-6'>
                Edit Product
            </div>
            <div className='bg-gray-100 px-12 py-6 w-full'>
                <div className='grid sm:grid-cols-4 grid-cols-1 gap-4'>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm'>Product Name</label>
                        <InputText
                            value={productData.title}
                            onChange={(e) => {
                                setNameError(false);
                                setProductData({ ...productData, title: e.target.value });
                            }}
                            className='border border-gray-200 px-2 py-2 rounded capitalize'
                            placeholder='Name of the product'
                            autoFocus
                            required
                        />
                        {nameError && <div className='text-xs text-red-700 error'>*Name of the product required</div>}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm'>Price (KSH)</label>
                        <InputText
                            value={productData.price}
                            onChange={(e) => {
                                setPriceError(false);
                                setProductData({ ...productData, price: e.target.value });
                            }}
                            className='border border-gray-200 px-2 py-2 rounded capitalize'
                            placeholder='Price'
                            keyfilter='money'
                            required
                        />
                        {priceError && (
                            <div className='text-xs text-red-700 error'>*Price of the product required</div>
                        )}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm'>Quantity</label>
                        <InputText
                            value={productData.quantity}
                            onChange={(e) => {
                                setQuantityError(false);
                                setProductData({ ...productData, quantity: e.target.value });
                            }}
                            className='border border-gray-200 px-2 py-2 rounded capitalize'
                            placeholder='Product Quantity'
                            keyfilter='alphanum'
                            required
                        />
                        {quantityError && (
                            <div className='text-xs text-red-700 error'>*Quantity of the product required</div>
                        )}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm'>Current Image</label>
                        {productData.imageUrl && (
                            <img src={productData.imageUrl} alt='Product' className='w-40 h-auto rounded-lg' />
                        )}
                        <input
                            type='file'
                            onChange={handleImageChange}
                            accept='image/png, image/jpeg'
                            className='border border-gray-200 px-2 py-2 rounded capitalize'
                        />
                    </div>
                </div>

                <div className='flex w-full my-5'>
                    <div className='flex flex-col gap-1 w-full'>
                        <label className='text-sm'>Description</label>
                        <InputTextarea
                            value={productData.description}
                            onChange={(e) => {
                                setDescriptionError(false);
                                setProductData({ ...productData, description: e.target.value });
                            }}
                            className='border border-gray-200 px-2 py-2 rounded capitalize'
                            placeholder='Description'
                            required
                            rows={5}
                            cols={30}
                        />
                        {descriptionError && (
                            <div className='text-xs text-red-700 error'>*Description of the product required</div>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex justify-between px-12 mt-6'>
                <button
                    disabled={loading}
                    onClick={cancelEdit}
                    className='bg-gray-400 justify-end flex text-white rounded px-4 py-3 font-medium gap-2'>
                    Cancel
                </button>
                <div className='bg-black justify-end flex text-white rounded px-4 py-3 font-medium gap-2'>
                    <Button
                        label='Update Product'
                        icon='pi pi-check'
                        loading={loading}
                        onClick={handleUpdate}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
