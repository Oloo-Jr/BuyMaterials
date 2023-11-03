import React, { useState } from 'react';
import './AddProduct.css'
import {BsImageFill} from 'react-icons/bs'
import {GrTextAlignFull} from 'react-icons/gr'
import { db, storage, auth } from '../../Database/config';
import firebase from 'firebase/app';
import { useNavigate } from 'react-router-dom';
import MainHeader from '../../Components/Header/Header';

export default function AddProduct() {

    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (e) => {
      setIsChecked(e.target.checked);
    };


  const handleImageChange =(e) => {
    e.preventDefault();
    let pickedfile;
    if(e.target.files && e.target.files.length>0){
      pickedfile=e.target.files[0];
      setImage(pickedfile);
    }
  }

  const handleUpload = (e) => {
    e.preventDefault();

    if (!image || !title || !description) {
      alert("Please fill in all fields before uploading.");
      return;
  }

    const serialNumber = Math.floor(100000+Math.random()*9000).toString();

    const uploadTask=storage.ref("PostImage")
    .child(serialNumber)
    .put(image);
    uploadTask.on(
      "state_changed",
      (snapshot)=> {
        let progress=((snapshot.bytesTransferred/snapshot.totalBytes)*100);
        console.log(progress);
      },
      (err)=>{
        console.log(err);
      },
      ()=>{
        storage.ref("PostImage")
        .child(serialNumber)
        .getDownloadURL()
        .then((imageUrl)=>{
          db.collection('Business').doc(auth.currentUser.uid).collection("Products")
          .add({
            title: title,
            description:description,
            imageUrl: imageUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: auth.currentUser.uid,
            Instock: isChecked,
            price: price
          })
          //Reset
          setTitle("");
          setDescription("");
          setImage("");
          setIsChecked(false);
          setPrice(0)
          
           // Display the URL to the user (you can use a modal or a popup)
          alert('Upload Successful' );
        })

      }
    )
  }


  
  return (
    <div className='uploadScreen'>
        <MainHeader />
        <div className='uploadBody'>
            <div className='uploadCard'>
                <h1 className='uploadTitle'>Add Product</h1>
                <div className='uploadDescription'>
                    <GrTextAlignFull/>
                    <textarea value={title} onChange={(e) => setTitle(e.target.value)} 
                    className='uploadTextarea' placeholder='Product name'/>
                </div>
                <div className='uploadImage'>
                    <h5 className='ImageWord'><BsImageFill /> Add Image</h5>
                    <input onChange={handleImageChange} className='uploadImageBtn' type='file'/>
                </div>
                <div className='uploadDescription'>
                    <GrTextAlignFull/>
                    <textarea value={price} onChange={(e) => setPrice(e.target.value)} 
                    className='uploadTextarea' placeholder='Price'/>
                </div>
                <div className='uploadDescription'>
                    <GrTextAlignFull/>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} 
                    className='uploadTextarea' placeholder='Description'/>
                </div>
                <div className='uploadDescription'>
                    <label className='uploadTextarea'>
                        <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        />
                        Offer: 
                    </label>
                    </div>
                <button className='uploadButton' onClick={handleUpload}  >Upload Product</button>
            </div>
        </div>
    </div>
  )
}
