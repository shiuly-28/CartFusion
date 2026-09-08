"use client"
import ProductCard from '@/component/ProductCard';
import UseGetAllProducts from '@/hooks/UseGetAllProductsData';
import { IProduct } from '@/model/product.model';
import { IUser } from '@/model/user.model';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { AnimatePresence, motion } from "motion/react"
import { div, p } from 'motion/react-client';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaRegStar, FaStar, FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';

function ViewProduct() {
    const params = useParams()
    const productId = params.id as string;
    UseGetAllProducts()
    const [reviewsRating, setReviewsRating] = useState(0)
    const [reviewsComment, setReviewsComment] = useState("")
    const [reviewsImage, setReviewsImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);

    const {allProductData} = useSelector((state:RootState) =>state.merchant)
    const router = useRouter()
    
    const  product:IProduct | undefined = allProductData?.find((p:IProduct)=>String(p._id) === String(productId))
    // console.log("PRODUCT DATA:", product)
  
    const images : string[]= [
        product?.image1,
        product?.image2,
        product?.image3,
        product?.image4
    ].filter((img): img is string => Boolean(img))

    const relatedProducts = allProductData.filter((p)=> p.category === product?.category
     && p._id !==product._id)

     const totalReviews = product?.reviews?.length ?? 0

     const avgRating = product && totalReviews>0 ?(
      product.reviews!.reduce((sum:number, r : {rating:number})=> sum + r.rating, 0)/totalReviews
     ).toFixed(1) : 0

        const handleAddCart = async(e: React.MouseEvent) => {
             e.stopPropagation()
           try {
             const result = await axios.post("/api/user/cart/add", {
               productId: productId,
               quantity: 1
             })
             console.log(result.data)
             alert("✅ Added to cart")
             router.push("/cart")
           }catch(error){
             console.log(error)
             alert("add to cart error")
           }
          }

    const [activeImage, setActiveImage] = useState(0)

    const handleSubmitReview = async () =>{
      const formData = new FormData()
      formData.append("productId",String(productId));
      formData.append("rating", String(reviewsRating))
      formData.append("comment", reviewsComment)
      if(reviewsImage){
        formData.append("image", reviewsImage)
      }
      setLoading(true)
      try{
        const result = await axios.post("/api/merchant/addReview", formData)
        setLoading(false)
        alert("✅ Review added successfully");
        setPreview(null)
        setReviewsComment("")
        setReviewsRating(0)
        setReviewsImage(null)
      }catch(error){
        console.log(error)
        setLoading(false)
        alert("Add review error")
      }
    }

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-900 
    via-black to-gray-900 px-4 p-10'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* left loop */}
            <div className='flex flex-col lg:flex-row gap-4'>
                {/* main image */}
                <div className='relative w-full lg:w-[450px] h-[420px] bg-black rounded-lg overflow-hidden
                flex items-center justify-center border border-white/10'>
                    {images.length > 0 && images[activeImage] &&
                        <Image  src={images[activeImage]} alt={product?.title ?? "product image"}
                    fill
                    className='object-contain'
                    priority/>}
                </div>

                {/* image thumbless */}
               <div className='flex flex-row lg:flex-col gap-3 justify-center'>
            {images.map((img, i) => (
           <div 
          key={i} 
          onClick={() => setActiveImage(i)} 
          className={`relative w-20 h-20 border-2 rounded-lg cursor-pointer 
          overflow-hidden flex items-center justify-center hover:scale-105 
          transition-all duration-200 ${
            activeImage === i
            ? "border-[#00684D] shadow-md"
            : "border-gray-200 dark:border-white/20 hover:border-gray-400"  
          }`}>
          <Image 
          src={img} 
          alt={`Product preview ${i + 1}`} 
          fill 
         className="object-cover"/>
        </div>
       ))}
      </div>
        </div>
          {/* Right bottom */}
          {product && <div>
            <h3 className='text-3xl text-white font-bold mb-3'>{product?.title}</h3>
            <p className='text-gray-500 font-bold'>{product?.category}</p>
            <p className='text-2xl text-[#00684D] font-bold'>৳ {product?.price}</p>
            <div className='flex items-center gap-2 mt-1 mb-4'>
              <div className='flex text-yellow-400'>
                {[1, 2, 3, 4, 5].map((i)=>(
                  i<= Math.round(Number(avgRating)) ?
                  <FaStar key={i}/>: <FaRegStar key={i}/>
                ))}
              </div>
              <span className='text-sm text-gray-400'>(avgRating / {totalReviews}) Reviews</span>
            </div>
            <p className='mb-4 text-gray-300'>{product?.description}</p>
            <p className='mb-3 text-gray-50'>
              Stock : {" "}<span className={product.stock > 0
                ? "text-[#00684D]"
                : "text-red-400"
              }>
                {product?.stock > 0 ? "In  Stock" : "Out of Stock"}
              </span>
            </p>
            <motion.button 
            onClick={handleAddCart}
            whileHover={{scale: 1.02}}
            whileTap={{scale:0.96}}
            className='w-full bg-[#00684D] hover:bg-[#045f47]
             py-3 rounded font-semibold transition text-white'
            >
              Add to Cart
            </motion.button>
          </div>}
        </div>

        {product && <div className='mt-10 bg-white/5 border border-white/10 rounded-lg p-6'>
          {product.isWearable && (
            <div className='mb-5'>
              <p className='font-semibold mb-2 text-white'>
                Available Sizes
              </p>
              <div className='flex flex-wrap gap-2'>
                {product.size?.map((s)=>(
                  <span key={s} className='px-3 py-1 border bg-white border-white/20 rounded'>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className='space-y-2 text-gray-300'>
            {typeof product.replacementDays == "number" && product.replacementDays > 0 && (
              <p>✅ {product.replacementDays} Days Replacement</p>
            )}
            {product.freeDelivery === true && <p>✅ Free Delivery</p>}
            {product.payOnDevelivery === true && <p>✅ Cash on Delivery Available</p>}
            {product.warranty && product.warranty !== "No warranty" &&
             <p>✅ warranty: {product.warranty}</p>}
          </div>
          {Array.isArray(product.detailsPoint) && product.detailsPoint.length > 0 && (
            <div className='mb-6'>
              <h3 className='font-semibold mb-2 text-white'>Hightlights</h3>
              <ul className='list-disc pl-5 space-y-1 text-gray-300'>
                {product.detailsPoint.map((p,i)=>(
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>}

        {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
          <div className='mt-12 bg-white/5 border border-white/10 rounded-lg p-6'>
            <h3 className='text-2xl font-bold mb-5 text-white'>Related Products</h3>
           <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5'>
             {relatedProducts.slice(0.8).map((rp)=>(
            <ProductCard key={rp._id?.toString()} product={rp}/>
            ))}
           </div>
          </div>
        )}

        <div className='mt-16 bg-white/5 border border-white/10 rounded-lg p-6'>
          <h2 className='text-white text-2xl font-bold mb-6'>Custom Reviews</h2>
          <div className='mb-8'>
            <p className='text-white font-semibold mb-2'>Add your Review</p>
            <div className='flex gap-2 mb-3 text-yellow-400'>
              {
                [1, 2, 3, 4, 5].map((i)=>(
                  <span className='cursor-pointer'
                   onClick={()=>setReviewsRating(i)} key={i}>
                    {i<= reviewsRating ? <FaStar/> : <FaRegStar/>}
                  </span>
                ))
              }
            </div>

            <textarea
            onChange={(e)=>setReviewsComment(e.target.value)} value={reviewsComment}
            placeholder='Write a reveiw...' className='w-full p-3 focus:ring-[#00684D] focus:outline-none 
            focus:ring-2 rounded bg-black text-white
            border border-white/20 mb-3' rows={3}/>

           <div className='flex flex-col'>
            <label className='text-white font-semibold mb-2'
            htmlFor='img'>Select Image for Review</label>
            <input type="file" accept='image/*' className='mb-3 bg-white text-black p-2 w-[200px] rounded-lg' id='img'
            onChange={(e)=>{
              const file = e.target.files?.[0]
              if(file){
                 setReviewsImage(file)
                setPreview(URL.createObjectURL(file))
              }
            }} />

            {preview && <Image src={preview} alt='preview' width={100} height={100}
            className='rounded mb-3'/>}
           </div>

           <motion.button
           whileHover={{scale:1.04}}
           whileTap={{scale: 0.97}}
           disabled = {loading}
           onClick={handleSubmitReview}
            className='bg-[#00684D] hover:bg-[#045f47] py-2 px-6 rounded 
           text-white font-semibold mt-4'>{loading ?
            <ClipLoader size={22} color='white'/> : "Submit Review"}</motion.button>
          </div>

              {product?.reviews && product.reviews.length > 0 ? (
               <h2 className='text-white font-semibold mb-2 text-2xl'>All Reviews</h2>
            
            ):(
              <h2 className='text-white font-semibold mb-2 text-2xl'>No Reviews found</h2>
            )
          }

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10'>
           
       {product?.reviews?.map((r, i) => {
  const reviewUser = r.user as IUser;   // 👈 এখানে type assert করো
  return (
    <div key={i} className='bg-white w-[250px] border border-black/10 rounded-lg p-5'>
      <div className='flex items-center gap-3 mb-2'>
        <div className='w-10 h-10 rounded-full flex items-center justify-center bg-black'>
          {reviewUser.image ? (
            <Image 
              src={reviewUser.image} 
              alt={reviewUser.name || "User"}
              width={40}
              height={40}
              className='rounded-full object-cover'
            />
          ) : (
            <FaUserCircle className='w-8 h-8'/>
          )}
        </div>
        <div>
          <p className='text-black font-semibold text-sm'>{reviewUser.name}</p>
          <div className='flex text-yellow-400 text-sm mt-1.5'>
            {[1, 2, 3, 4, 5].map((i) => (
              i <= r.rating ? <FaStar key={i}/> : <FaRegStar key={i}/>
            ))}
          </div>
        </div>

      </div>

      <p className='text-gray-900 text-sm mb-3'> {r.comment}</p>
      {r.image  ? <div className='w-[180px] h-[180px] border border-white/10 
      rounded-lg overflow-hidden bg-black'>
        <Image src={r.image} alt='Review Image' width={140} height={180}
        className='object-contain'/></div> : <div className='w-[180px] h-[180px] border border-white/10 
      rounded-lg overflow-hidden bg-gray-400 flex items-center justify-center text-white text-xl'>No Review Image</div>}
    </div>
  );
})}
          </div>
        </div>
      </div>


    </div>
  )
}

export default ViewProduct
