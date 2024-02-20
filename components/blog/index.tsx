"use client"
import { useBlogContext } from '@/context/blog'
import { IBlog } from '@/data/interfaces'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type props = {
   blog: IBlog,
   setBlog: React.Dispatch<React.SetStateAction<IBlog>>,
   isEdit: boolean,
   handleEdit: () => {}
}

export default function FullBlog({ blog, setBlog, isEdit, handleEdit }: props) {
   const [isAuthor, setIsAuthor] = useState(false)
   const { data: session } = useSession()

   useEffect(() => {
      if (session && blog._id && session?.user?.id === blog.author?._id) {
         setIsAuthor(true)
      } else {
         setIsAuthor(false)
      }
      console.log("isAuthor=", session, blog, isAuthor)
   }, [session])

   const onChange = (e: any) => {
      setBlog({
         ...blog,
         [e.target.name]: e.target.value
      })
   }
   if (!blog.mediaUrl) {
      return <section className="h-screen flex justify-center items-center">
         <progress className="progress w-12"></progress>
      </section>
   }
   return (
      <section>
         <div className="container mx-auto px-5 md:px-0 w-full md:w-10/12 lg:w-5/12 font-work">
            <div className="py-5">
               {isAuthor &&
                  <span className="float-right cursor-pointer" onClick={handleEdit}>
                     {isEdit ?
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                           <path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V15a.75.75 0 0 0 1.5 0V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                           <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                        </svg>
                     }
                  </span>}
               <div className="w-fit text-white px-2.5 py-1 bg-primary text-xs md:text-sm rounded-md mb-2 md:mb-4 font-medium">
                  {blog.tag}
               </div>
               {isEdit ?
                  <input type="text" name='title' value={blog.title} onChange={onChange} className="text-3xl font-semibold input input-bordered input-lg px-3 w-full" />
                  :
                  <h3 className="text-base-content font-semibold text-xl md:text-2xl lg:text-4xl leading-5 md:leading-10 ">
                     {blog.title}
                  </h3>
               }
               <div className="mt-3 md:mt-6 flex items-center gap-5 text-base-content/60">
                  <div className=" flex items-center gap-3">
                     <div className="avatar">
                        <div className="w-9 rounded-full">
                           <Image
                              src={`${blog.author?.image}`}
                              alt="avatar"
                              width={100}
                              height={100}
                           />
                        </div>
                     </div>
                     <a
                        href="/"
                        className=" text-xs md:text-sm font-medium hover:text-primary transition hover:duration-300"
                     >
                        {blog.author?.username}
                     </a>
                  </div>
                  <p className="text-xs md:text-sm">{moment(blog.updatedAt).format('MMMM D, YYYY')}</p>
               </div>
            </div>
            <div className="mt-4">
               <Image
                  width="800"
                  height="462"
                  alt={`blog_image`}
                  className={`rounded-xl`}
                  src={`${blog.mediaUrl}`}
               />
            </div>

            <div className="my-8">
               {isEdit ?
                  <textarea value={blog.content} onChange={onChange} name='content' className="textarea textarea-bordered h-80 w-full" placeholder="Content"></textarea>
                  :
                  blog.content
               }
            </div>
         </div>
      </section>
   )
}
