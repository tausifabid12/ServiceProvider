import React, { Fragment, useState } from 'react';
import Editor from '@/components/Editor';


import { EditorState, convertToRaw } from 'draft-js';



import { useGqlClient } from '@/hooks/UseGqlClient';
import { useQuery } from 'graphql-hooks';
import { addVariables } from '../Main';


interface IAddProductProps {
    setTab: (tab: number) => void
    addNewFn: (input: addVariables) => void

}




// component
const AddNew = ({ setTab, addNewFn }: IAddProductProps) => {


    // states
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [description, setDescription] = useState('')


    // hooks
    const client = useGqlClient()




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const inputData = {
            title: title.toLowerCase(),
            description: description,
            url: url
        }

        addNewFn(inputData)
    }




    return (
        <>
            <div className='min-h-screen'>
                <form onSubmit={handleSubmit} className="bg-transparent">
                    <div className="grid grid-cols-1 lg:grid-cols-2  gap-5">
                        <div className=" p-1  col-span-2">
                            <label htmlFor="title" className="block  text-gray-700 text-sm mb-1">
                                Title
                            </label>
                            <input
                                required
                                type="text"
                                name="title"
                                defaultValue={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="title"
                                className="mt-2 w-full block  placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:primary focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:primary/10"
                            />
                        </div>
                        <div className=" p-1  col-span-2">
                            <label htmlFor="title" className="block  text-gray-700 text-sm mb-1">
                                Url
                            </label>
                            <input
                                required
                                type="text"
                                name="url"
                                defaultValue={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="url"
                                className="mt-2 w-full block  placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:primary focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:primary/10"
                            />
                        </div>


                        <div className='col-span-2'>
                            <p className='text-dimText mb-4'> Description </p>
                            <textarea
                                rows={5}
                                defaultValue={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className='mt-1 px-4 py-2 border border-gray-200 rounded-md w-full'
                            />
                        </div>

                    </div>
                    <div className='mt-6 '>

                        <button className='px-4 py-1.5 bg-primary text-white font-semibold'>Add New </button>
                    </div>
                </form>
            </div>

        </>

    );
};

export default AddNew;