/*
import React, { Component } from 'react'
import { dummyPublishedImages } from '../assets/assets'
import { useState, useEffect } from "react";
import Loading from "../pages/Loading";
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';



const Community = () => {
    const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const {axios} = useAppContext()

  const fetchImages = async () => {
    try{
      const {data} = await axios.get('/api/user/published-images')
      if(data.success){
        setImages(data.images)
      } else{
        toast.error(data.message)
      }

    }catch(error){
      toast.error(error.message)

    }
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll'>
     <h2 className='text-xl font-semibold mb-6 text-gray-800 dark:text-purple-100 '> Community Images </h2> 
     {images.length>0 ? (
      <div className='flex flex-wrap max-sm:justify-center gap-5'> 
      {images.map((item, index) =>(
     <a href='' key={index} href={item.imageUrl} target='_blank' className='relative  group block rounded-lg overflow-hidden border border-gray-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow duration-300'>
      <img src={item.imageUrl} alt="" className='w-full h-40 md:h-50 2xl:h-62 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out ' />
      <p className='absolute bottom-0 right-0 text-xs bg-black/50 backdrop-blur text-white px-4 py-1 roun ded-tl-xl opacity-0 group-hover:opacity-100 transition duration-300'> Created by {item.userName}</p>
     </a>
      )

      )}

      </div>
     ): (
      <p className='text-center text-gray-600 dark:text-purple-200 mt-10'> No images Available </p>
     )}
      
    </div>
  )
}

export default Community 
*/
import { useState, useEffect } from "react";
import Loading from "../pages/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Community = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const { axios } = useAppContext();

  const fetchImages = async () => {
    try {
      const { data } = await axios.get("/api/user/published-images");

      console.log("API Response:", data);

      if (data.success) {
        setImages(data.images || []);
      } else {
        setImages([]);
        toast.error(data.message);
      }
    } catch (error) {
      setImages([]);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6 pt-12 xl:px-12 2xl:px-20 w-full h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-purple-100">
        Community Images
      </h2>

      {Array.isArray(images) && images.length > 0 ? (
        <div className="flex flex-wrap gap-5 max-sm:justify-center">
          {images.map((item, index) => (
            <a
              key={index}
              href={item.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group block rounded-lg overflow-hidden border border-gray-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={item.imageUrl}
                alt="Community"
                className="w-64 h-40 md:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <p className="absolute bottom-0 left-0 w-full bg-black/50 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Created by {item.userName}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-purple-200 mt-10">
          No Images Available
        </p>
      )}
    </div>
  );
};

export default Community;