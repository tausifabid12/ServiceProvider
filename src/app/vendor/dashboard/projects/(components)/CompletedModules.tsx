'use client'
import { currentUser } from '@/firebase/oauth.config';
import GetModules from '@/shared/queries/modules';
import React, { useEffect, useState } from 'react';
import ViewModal from './ViewModal';
import Loading from '@/app/loading';
import Pagination from '@/components/Pagination';



// component
const CompletedModules = () => {
    //states
    const [modules, setModules] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentModuleId, setCurrentModuleId] = useState('')
    const [moduleStatus, setModuleStatus] = useState('')
    const [loading, setLoading] = useState(false)
    // pagination states
    const [pageLimit, setPageLimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalModules, setTotalModules] = useState(0)

    // hooks
    const user = currentUser()



    // getting module data
    useEffect(() => {
        getModulesData()
        getTotalModulesCount()
    }, [currentPage]);

    // functions


    // get module data
    const getModulesData = async () => {
        setLoading(true)

        const where = {
            vendorHas: {
                userIs: {
                    email: user?.email
                }
            },
            status: "COMPLETED"
        }
        const options = {
            limit: pageLimit,
            offset: (currentPage - 1) * pageLimit

        }

        const modules = await GetModules(where, options)
        if (modules) {
            setLoading(false)
            setModules(modules)
        } else {
            setLoading(false)
            setModules([])
        }
    }

    //getting total modules
    const getTotalModulesCount = async () => {
        const where = {
            vendorHas: {
                userIs: {
                    email: user?.email
                }
            },
            status: "COMPLETED"
        }
        const modules = await GetModules(where)
        if (modules?.length) {
            setTotalModules(modules?.length)
            setTotalPages(Math.ceil(modules?.length / pageLimit))
        }

    }






    if (loading) return <Loading />

    return (
        <>
            <table className="w-full">
                <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-white dark:text-gray-400 dark:bg-gray-800">
                        <th className="px-4 py-3">Serial</th>
                        <th className="px-4 py-3">Ticket-Id</th>
                        <th className="px-4 py-3">Module Title</th>
                        <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">

                    {modules && modules?.map((module: any, index: number) =>

                        <tr key={module?.id} className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">

                            <td className="px-4 py-3 text-sm">{index + 1}</td>
                            <td className="px-4 py-3 text-sm">{module?.ticket}</td>
                            <td className="px-4 py-3 text-sm">{module?.forModule
                                ?.title || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm" >{module?.status}</td>


                        </tr>

                    )
                    }
                </tbody>
                <ViewModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} currentModuleId={currentModuleId} />
            </table>
            <div className='w-full flex items-center justify-center'>
                {totalModules! > pageLimit &&
                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />}

            </div>
        </>
    );
};

export default CompletedModules;