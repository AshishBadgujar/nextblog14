'use client'
import React from 'react'
import Link from 'next/link'
import { headerData } from '@/data/headerData'
import MobileNav from './MobileNav'
import Image from 'next/image'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import { useState, useEffect } from "react";

/**
 * Our Header is a reusable UI component that used to represent top navbar section of any website.
 *
 * @property website logo, all page title with navigation link, search field  and a theme changing button.
 *
 * @returns React component that can be easily integrated into any web application.
 */
const Header = () => {
   const { data: session } = useSession()

   const [providers, setProviders] = useState<any>(null)
   useEffect(() => {
      const setAuthProviders = async () => {
         const response = await getProviders()
         setProviders(response)
      }
      setAuthProviders()

   }, [])
   const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false)

   return (
      <header className="py-5">
         <div className="container mx-auto font-work">
            <div className="navbar grid grid-cols-12">
               <div className="col-span-3">
                  <Link href={`/`}>
                     <Logo className={`text-base-content`} />
                  </Link>
               </div>
               <nav className="hidden xl:block col-span-6">
                  <div className=" w-full flex items-center justify-center gap-10">
                     {headerData.map((item: any, index: number) => (
                        <div key={index}>
                           <Link
                              href={item.link}
                              className="link link-hover text-base text-base-content/80 hover:text-primary transition hover:duration-300"
                           >
                              {item.name}
                           </Link>
                        </div>
                     ))}
                  </div>
               </nav>
               <div className="flex items-center justify-end xl:justify-end gap-10 col-span-9 xl:col-span-3">
                  {/* Search Block */}
                  <div className="pl-4 pr-3 py-2 rounded-md hidden sm:flex items-center gap-4" >
                     <svg
                        className="cursor-pointer"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M6.90906 2C5.93814 2 4.98903 2.28791 4.18174 2.82733C3.37444 3.36674 2.74524 4.13343 2.37368 5.03045C2.00213 5.92746 1.90491 6.91451 2.09433 7.86677C2.28375 8.81904 2.75129 9.69375 3.43783 10.3803C4.12438 11.0668 4.99909 11.5344 5.95135 11.7238C6.90362 11.9132 7.89067 11.816 8.78768 11.4444C9.6847 11.0729 10.4514 10.4437 10.9908 9.63639C11.5302 8.8291 11.8181 7.87998 11.8181 6.90906C11.818 5.60712 11.3008 4.35853 10.3802 3.43792C9.45959 2.51731 8.211 2.00008 6.90906 2Z"
                           stroke="#52525B"
                           strokeWidth="1.5"
                           strokeMiterlimit="10"
                        />
                        <path
                           d="M10.5715 10.5716L14 14"
                           stroke="#52525B"
                           strokeWidth="1.5"
                           strokeMiterlimit="10"
                           strokeLinecap="round"
                        />
                     </svg>
                  </div>

                  {session?.user ?
                     <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
                        <div tabIndex={0} >
                           <div className="avatar hidden xl:block cursor-pointer">
                              <div className="w-12 rounded-full">
                                 <Image src={session?.user.image || ''} alt='' height={100} width={100} />
                              </div>
                           </div>
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                           <li> <Link href={`/author/${session?.user.id}`}>Profile</Link></li>
                           <li><button role='button' className='btn btn-neutral text-neutral-content' onClick={() => signOut()}>Logout</button></li>
                        </ul>
                     </div>

                     :
                     <>
                        {providers &&
                           Object.values(providers).map((provider) => (
                              <button className="btn btn-neutral hidden xl:block" key={provider.name} onClick={() => signIn(provider.id)} >Login</button>
                           ))
                        }
                     </>

                  }

                  {/* Responsive Sidebar Menu */}
                  <svg
                     onClick={() => setSidebarOpen(!sidebarOpen)}
                     className="cursor-pointer w-8 h-8 xl:hidden text-base-content"
                     width="20"
                     height="20"
                     viewBox="0 0 20 20"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        d="M3.33301 5H16.6663M3.33301 10H16.6663M3.33301 15H16.6663"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                  </svg>
               </div>
            </div>
            {/* Responsive Sidebar Layout */}
            <MobileNav
               sidebarOpen={sidebarOpen}
               setSidebarOpen={setSidebarOpen}
            />
         </div>
      </header>
   )
}

// Header logo svg component
export const Logo = ({ ...props }) => (
   <h4 className="text-xl text-base-content font-sans">
      Next<strong>Blog</strong>
   </h4>
)

// Site Favicon svg component
export const Favicon = ({ ...props }) => (
   <></>
)
export default Header
