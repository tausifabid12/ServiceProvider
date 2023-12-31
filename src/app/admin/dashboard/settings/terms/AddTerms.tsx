'use client'

import React, { Fragment, useState } from 'react';
import Editor from '@/components/Editor';


import { EditorState, convertToRaw } from 'draft-js';


import { addTermsVariables } from './Main';


interface IAddProductProps {
    setTab: (tab: number) => void
    addNewTermsFn: (input: addTermsVariables) => void

}





const AddTerms = ({ setTab, addNewTermsFn }: IAddProductProps) => {
    // states

    const [title, setTitle] = useState('')
    const [termsEditorState, setTermsEditorState] = useState(() =>
        EditorState.createEmpty()
    );





    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const inputData = {
            title: title.toLowerCase(),
            content: JSON.stringify(convertToRaw(termsEditorState.getCurrentContent())),
        }

        addNewTermsFn(inputData)
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


                        <div className='col-span-2'>
                            <p className='text-dimText mb-4'> Description </p>
                            <Editor setEditorState={setTermsEditorState} editorState={termsEditorState} />
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

export default AddTerms;