"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useBlogContext } from '@/context/blog';

export default function page() {
    const router = useRouter();
    const { addBlog } = useBlogContext()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [media, setMedia] = useState<any>(null)
    const [tag, setTag] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status == "unauthenticated") {
            router.push('/');
        }
    }, [status]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        const mediaUrl = await imageUpload()

        let blog = await addBlog({
            title,
            content,
            mediaUrl,
            userId: session?.user.id,
            tag
        })
        if (blog) {
            router.push('/')
            setSubmitting(false)
        }
    }

    const imageUpload = async () => {
        const data = new FormData()
        data.append('file', media)
        data.append('upload_preset', 'nextjsBlog')
        data.append('cloud_name', "ashish124")
        const res = await fetch(`https://api.cloudinary.com/v1_1/ashish124/image/upload`, {
            method: "POST",
            body: data
        })
        const res2 = await res.json()
        return res2.url
    }


    return (
        <main>
            <div className="container mx-auto">
                <form onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data">
                    <h1 className=''>Write</h1>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Title</span>
                        </div>
                        <input type="text" placeholder="Type here" value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered w-full max-w-xs" />
                    </label>
                    <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                            setMedia(file);
                        }
                    }} className="file-input w-full max-w-xs" />
                    {media && <Image src={URL.createObjectURL(media)} alt="img" width={200} height={100} />}

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Pick the Category</span>
                        </div>
                        <select className="select select-bordered" value={tag} onChange={(e) => setTag(e.target.value)}>
                            <option disabled value=''>Pick one</option>
                            <option value="Economy">Economy</option>
                            <option value="Business">Business</option>
                            <option value="Health">Health</option>
                            <option value="Sports">Sports</option>
                            <option value="Technology">Technology</option>
                            <option value="Others">Others</option>
                        </select>

                    </label>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Content</span>
                        </div>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="textarea textarea-bordered h-24" placeholder="Content"></textarea>
                    </label>
                    <button className="btn btn-neutral" disabled={submitting}>Publish</button>
                </form>
            </div>
        </main>
    )
}