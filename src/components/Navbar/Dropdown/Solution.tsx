'use client'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';


interface SolutionPage {
    solutionData: any
}


const Solution = ({ solutionData }: SolutionPage) => {

    const [currentSolution, setCurrentSolution] = useState('');


    useEffect(() => {
        setCurrentSolution(solutionData[0]?.title)
    }, [solutionData?.length])


    return (
        <Popover.Group className="hidden lg:flex lg:gap-x-12 mr-8">
            <Popover className="relative">
                <Popover.Button className="flex items-center outline-none border-none focus:outline-none gap-x-1 text-sm font-semibold leading-6 text-primaryText">
                    Solutions
                </Popover.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <Popover.Panel className="absolute mt-10 lg:-ml-24 top-full z-10 w-screen max-w-xl overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5">

                        <div className=" bg-white p-4 w-full  mx-auto grid grid-cols-1 md:grid-cols-3 shadow-lg rounded-md ">
                            <ul className="px-4 w-full  border-gray-300 border-b sm:border-r lg:border-b-0 pb-3 pt-3 lg:pt-3">
                                {/* <h3 className="font-bold text-xl text-primaryText text-bold mb-2">{title}</h3> */}
                                {
                                    solutionData && solutionData?.map((item: any, index: number) => (
                                        <li
                                            onClick={() => setCurrentSolution(item?.title || '')}
                                            onMouseOver={() => setCurrentSolution(item?.title || '')}
                                            key={item.id}
                                            className='cursor-pointer'
                                        >
                                            <div
                                                className={
                                                    `${currentSolution === item.title ?
                                                        'bg-gray-100 text-primary' : ''}    
                            flex items-center text-sm transition-all duration-300`}>
                                                <p className="block p-3   rounded ">{item.title}</p>
                                                <span className={`${currentSolution === item.title ? 'block' : 'hidden'} transition-all duration-200`}><MdKeyboardArrowRight /></span>
                                            </div>
                                        </li>
                                    ))
                                }


                            </ul>
                            <ul className="px-4 w-full md:col-span-2  border-gray-300  pb-6 pt-6 lg:pt-3">
                                {/* <h3 className="font-bold text-xl text-primaryText text-bold mb-2">Sub solution</h3> */}
                                <div className='grid grid-cols-2 text-xs capitalize '>
                                    {
                                        solutionData && solutionData?.find((Solution: any) => Solution.title === currentSolution)?.hasSubSolution?.length
                                            ?
                                            solutionData?.find((Solution: any) => Solution.title === currentSolution)?.hasSubSolution.map((sub: any) =>
                                                <li key={sub?.id}>
                                                    <Link href={`/solution/${sub?.slug}`} className="block p-3 hover:bg-gray-100 rounded text-primaryText hover:text-primaryText hover:underline" > {sub?.title}</Link>
                                                </li>
                                            )
                                            :
                                            <li>
                                                <p className="block p-3 hover:bg-gray-100 rounded text-primaryText hover:text-primaryText">No Sub Solution Available yet.</p>
                                            </li>
                                    }


                                </div>



                            </ul>

                        </div>
                    </Popover.Panel>
                </Transition>
            </Popover>

        </Popover.Group>
    );
};

export default Solution;