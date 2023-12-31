'use client'

import React, { Fragment, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast';


interface IAddProductProps {
    currentData: any,
    setCurrentData: any,
    updateItem: any
}






const DataFrom = ({ currentData, setCurrentData, updateItem }: IAddProductProps) => {





    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const inputData = {
            title: currentData?.title,
            description: currentData?.description,
            url: currentData?.url
        }
        updateItem(inputData)


    }



    return (
        <>
            <div className='min-h-screen'>
                <form onSubmit={handleSubmit} className="bg-transparent">
                    <div className="grid grid-cols-1 lg:grid-cols-2  gap-5 text-dimText">
                        <div className=" p-1 col-span-2">
                            <label htmlFor="">Title</label>
                            <input
                                required
                                type="text"
                                name="title"
                                defaultValue={currentData?.title}
                                onChange={(e) => setCurrentData({ ...currentData, title: e.target.value })}
                                placeholder="title"
                                className="mt-2 w-full block  placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:primary focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:primary/10"
                            />
                        </div>
                        <div className=" p-1 col-span-2">
                            <label htmlFor="">Url</label>
                            <input
                                required
                                type="text"
                                name="url"
                                defaultValue={currentData?.url}
                                onChange={(e) => setCurrentData({ ...currentData, url: e.target.value })}
                                placeholder="url"
                                className="mt-2 w-full block  placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:primary focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:primary/10"
                            />
                        </div>


                        <div className='col-span-2'>
                            <p className='text-dimText mb-4'> Description </p>
                            <textarea
                                rows={5}
                                defaultValue={currentData.description}
                                onChange={(e) => setCurrentData({ ...currentData, description: e.target.value })}
                                className='mt-2 w-full block  placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:primary focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:primary/10'
                            />
                        </div>




                    </div>
                    <div className='mt-6 '>

                        <button className='px-4 py-1.5 bg-primary text-white font-semibold'>Update</button>
                    </div>
                </form>
            </div>

        </>

    );
};

export default DataFrom;