'use client'
import AuthConfig from '@/firebase/oauth.config';

import React, { useEffect, useState } from 'react';
import ViewModal from './ViewModal';
import Loading from '@/app/loading';
import { useGqlClient } from '@/hooks/UseGqlClient';
import { useMutation } from 'graphql-hooks';
import { toast } from 'react-hot-toast';
import Pagination from '@/components/Pagination';
import GetModules from '@/shared/graphQl/queries/modules';
import { getEmployerEmail } from '@/shared/getEmployerEmail';



const UPDATE_MODULE_STATUS = `
mutation UpdateModuleTickets($where: ModuleTicketWhere, $update: ModuleTicketUpdateInput, $disconnect: ModuleTicketDisconnectInput) {
    updateModuleTickets(where: $where, update: $update, disconnect: $disconnect) {
      moduleTickets {
        id
      }
      info {
        relationshipsDeleted
      }
    }
  }
  
`







// component
const NewModules = () => {
    //states
    const [modules, setModules] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentModuleId, setCurrentModuleId] = useState('')
    const [loading, setLoading] = useState(false)
    const [labEmail, setLabEmail] = useState('')
    // pagination states
    const [pageLimit, setPageLimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalModules, setTotalModules] = useState(0)


    // hooks
    const { user, authLoading } = AuthConfig()
    const client = useGqlClient()

    // UPDATING MODULE STATUS
    const [updateModuleStatusFn, updateStatus] = useMutation(UPDATE_MODULE_STATUS, { client })


    // getting module data
    useEffect(() => {
        getLabEmail()
        getModulesData()
        getTotalModulesCount()
    }, [currentPage, labEmail, user?.email]);




    // getting lab email if employee is logged in
    const getLabEmail = async () => {
        if (user?.email) {
            const email = await getEmployerEmail(user?.email)
            setLabEmail(email)
        }

    }


    // update module status
    const updateModule = async (status: string, id: string) => {

        if (status === 'REJECTED') {
            const { data } = await updateModuleStatusFn({
                variables: {
                    where: {
                        id: id
                    },
                    update: {
                        status: status
                    },
                    disconnect: {
                        vendorHas: {
                            where: {
                                node: {
                                    userIs: {
                                        email: labEmail || "no email"
                                    }
                                }
                            }
                        }
                    }
                }
            })
            if (data.updateModuleTickets.moduleTickets.length) {
                console.log('updated')
                getModulesData()
                toast.success('Module updated successfully')
            }
        }
        else {
            const { data } = await updateModuleStatusFn({
                variables: {
                    where: {
                        id: id
                    },
                    update: {
                        status: status
                    }
                }
            })
            if (data.updateModuleTickets.moduleTickets.length) {
                console.log('updated')
                getModulesData()
                toast.success('Module updated successfully')
            }
        }







    }


    //getting total modules

    const getTotalModulesCount = async () => {


        const where = {
            vendorHas: {
                userIs: {
                    email: labEmail || "no email"
                }
            },
            status: "ASSIGNED"
        }
        const modules = await GetModules(where)
        if (modules?.length) {
            setTotalModules(modules?.length)
            setTotalPages(Math.ceil(modules?.length / pageLimit))
        }

    }

    // get module data
    const getModulesData = async () => {
        setLoading(true)
        const where = {
            vendorHas: {
                userIs: {
                    email: labEmail || "no email"
                }
            },
            status: "ASSIGNED"
        }
        const options = {
            sort: [
                {
                    createdAt: "DESC"
                }
            ],
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


    console.log(modules, 'modules', labEmail)


    if (loading || updateStatus.loading || authLoading) return <Loading />

    return (
        <>
            <table className="w-full ">
                <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-white dark:text-gray-400 dark:bg-gray-800">
                        <th className="px-4 py-3">Serial</th>
                        <th className="px-4 py-3">Ticket-Id</th>
                        <th className="px-4 py-3">Module Title</th>
                        <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800 ">

                    {modules?.length ?
                        (modules?.map((module: any, index: number) =>

                            <tr key={module?.id} className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">

                                <td className="px-4 py-3 text-sm">{index + 1}</td>
                                <td className="px-4 py-3 text-sm">{module?.ticket}</td>
                                <td className="px-4 py-3 text-sm">{module?.forModule
                                    ?.title || 'N/A'}</td>
                                <td className="px-4 py-3 text-sm space-x-2 text-center">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(true)
                                            setCurrentModuleId(module?.forModule?.id)
                                        }}
                                        className='px-3 py-1 bg-primary text-white rounded'>
                                        View
                                    </button>
                                    <button
                                        onClick={() => {
                                            updateModule('ACCEPTED', module?.id)
                                        }}
                                        className='px-3 py-1 bg-green-600 text-white rounded'>
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => {
                                            updateModule('REJECTED', module?.id)
                                        }}
                                        className='px-3 py-1 bg-red-600 text-white rounded'>
                                        Reject
                                    </button>

                                </td>

                            </tr>

                        ))


                        :
                        (
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                                <td className="px-4 py-3 text-sm" colSpan={4}>No modules found</td>
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

export default NewModules;