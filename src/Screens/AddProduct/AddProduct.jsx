import React, { useState, useRef, useEffect } from 'react';
import { db, storage, auth } from '../../Database/config';
import firebase from 'firebase/app';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../../Components/Header/Header';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default function AddProduct() {

  const navigate = useNavigate();
  const toast = useRef(null);

  const [loading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [quantityError, setQuantityError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const cancelUpload = () => {
    return navigate('/');
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return unsubscribe;
  }, []);

  const handleImageChange = (e) => {
    e.preventDefault();
    let pickedfile;
    if (e.target.files && e.target.files.length > 0) {
      pickedfile = e.target.files[0];
      setImage(pickedfile);
    }
  }

  const handleUpload = (e) => {
    e.preventDefault();



    if (!title) {
      return setNameError(true);
    }

    if (!price) {
      return setPriceError(true);
    }

    if (!quantity) {
      return setQuantityError(true);
    }

    if (!image) {
      return setImageError(true);
    }

    if (!description) {
      return setDescriptionError(true);
    }


    if (!image || !title || !description) {
      alert("Please fill in all fields before uploading.");
      return;
    }

    const serialNumber = Math.floor(100000 + Math.random() * 9000).toString();

    setIsLoading(true);
    const uploadTask = storage.ref("PostImage")
      .child(serialNumber)
      .put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(progress);
      },
      (err) => {
        console.log(err);
      },
      () => {
        storage.ref("PostImage")
          .child(serialNumber)
          .getDownloadURL()
          .then((imageUrl) => {
            db.collection('Business').doc(auth.currentUser.uid).collection("Products")
              .add({
                title: title,
                description: description,
                imageUrl: imageUrl,
                userId: auth.currentUser.uid,
                price: price,
                quantity: quantity,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              }).catch(function (error) {
                toast.current.show({
                  severity: "error",
                  summary: "Registration Failed",
                  detail: error,
                  life: 3000,
                });

                setIsLoading(false);
              });

            setTitle("");
            setDescription("");
            setImage("");
            setIsChecked(false);
            setPrice("");
            setQuantity("");

            toast.current.show({
              severity: "success",
              summary: "Product Saved",
              detail: "Product created successfully",
              life: 3000,
            });
            setIsLoading(false);
            return setTimeout(() => {
              navigate("/");
            }, 1000);
          });

      }
    )
  }



  return (
    <div className='flex flex-col'>
      <Toast ref={toast} position="bottom-left"></Toast>
      <MainHeader />
      <div className="flex gap-2 w-full justify-center text-2xl capitalize font-bold py-6">
        Add a Product
      </div>
      <div className="bg-gray-100 px-12 py-6 w-full">
        <div className="grid sm:grid-cols-4 grid-cols-1 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm">Product Name</label>
            <InputText
              value={title}
              onChange={function (e) {
                setNameError(false);
                setTitle(e.target.value);
              }}
              className="border border-gray-200 px-2 py-2 rounded capitalize"
              placeholder="Name of the product"
              autoFocus
              required
            />
            {nameError && (
              <div className="text-xs text-red-700 error">
                *Name of the product required
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Price (KSH)</label>
            <InputText
              value={price}
              onChange={function (e) {
                setPriceError(false);
                setPrice(e.target.value);
              }}
              className="border border-gray-200 px-2 py-2 rounded capitalize"
              placeholder="Price"
              keyfilter="money"
              required
            />
            {priceError && (
              <div className="text-xs text-red-700 error">
                *Price of the product required
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Quantity</label>
            <InputText
              value={quantity}
              onChange={function (e) {
                setQuantityError(false);
                setQuantity(e.target.value);
              }}
              className="border border-gray-200 px-2 py-2 rounded capitalize"
              placeholder="Product Quantity"
              keyfilter="alphanum"
              required
            />
            {quantityError && (
              <div className="text-xs text-red-700 error">
                *Quantity of the product required
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Upload Image</label>
            <InputText
              className="border border-gray-200 px-2 py-2 rounded capitalize"
              type="file"
              onChange={handleImageChange}
              accept="image/png, image/jpeg"
              placeholder="Upload Image"
              required
            />
            {imageError && (
              <div className="text-xs text-red-700 error">
                *Product Image Required
              </div>
            )}
          </div>
        </div>

        <div className='flex w-full my-5'>
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm">Description</label>
            <InputTextarea
              value={description}
              onChange={function (e) {
                setDescriptionError(false);
                setDescription(e.target.value);
              }}
              className="border border-gray-200 px-2 py-2 rounded capitalize"
              placeholder="Description"
              required
              rows={5}
              cols={30}
            />
            {descriptionError && (
              <div className="text-xs text-red-700 error">
                *Description of the product required
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between px-12 mt-6">
        <button
          disabled={loading}
          onClick={cancelUpload}
          className="bg-gray-400 justify-end flex text-white rounded px-4 py-3 font-medium gap-2"
        >
          Cancel
        </button>
        <div className="bg-black justify-end flex text-white rounded px-4 py-3 font-medium gap-2">
          <Button
            label="Upload Product"
            icon="pi pi-check"
            loading={loading}
            onClick={handleUpload}
          />
        </div>
      </div>


    </div>
  )
}
