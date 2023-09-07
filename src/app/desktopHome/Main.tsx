'use client'

import { useGqlClient } from '@/hooks/UseGqlClient';
import { useManualQuery, useQuery } from 'graphql-hooks';
import React, { useEffect } from 'react';
import NotificationCard from './NotificationCard';
import { FaArrowUp } from 'react-icons/fa';
import { Notification } from '@/gql/graphql';
import AuthConfig from '@/firebase/oauth.config';
import HomeCard from './HomeCard';

const GET_NOTIFICATIONS = `
query Notifications($where: NotificationWhere, $options: NotificationOptions) {
    notifications(where: $where, options: $options) {
      title
      description
      createdAt
    }
  }
`
const GET_PROJECT = `
query Projects($where: ProjectWhere) {
    projects(where: $where) {
      id
    }
  }
`
const GET_MODULE_TICKET = `
query ModuleTickets($where: ModuleTicketWhere, $options: ModuleTicketOptions) {
    moduleTickets(where: $where, options: $options) {
      id
      ticket
      status
      createdAt
    }
  }
`



const Main = () => {

    // STATES
    const [totalTickets, setTotalTickets] = React.useState<any>(0)
    const [pendingTickets, setPendingTickets] = React.useState<any>(0)
    const [completedTickets, setCompletedTickets] = React.useState<any>(0)
    const [latestTickets, setLatestTickets] = React.useState<any>('')

    // HOOKS 
    const client = useGqlClient()
    const { user } = AuthConfig()


    // getting data based on user
    useEffect(() => {
        getModuleTicketCount()
        getPendingTicket()
        getCompletedTicket()
        getLatestTicket()
    }, [user?.email])


    console.log(pendingTickets)



    // queries
    const [moduleTicketDataFn, state] = useManualQuery(GET_MODULE_TICKET, { client })
    const { data: notificationsData, error: notificationError, loading: notificationLoading } = useQuery(GET_NOTIFICATIONS, {
        client,
        revalidateOnMount: 3600,
        revalidateOnReconnect: 3600,
        revalidateOnFocus: false,
        variables: {
            "where": {
                "type_IN": ["CLIENT", "GENERAL"]
            },
            "options": {
                "limit": 3,
                "sort": [
                    {
                        "createdAt": "DESC"
                    }
                ]
            }
        }
    })
    const { data: projectData, error: projectDataError, loading: projectDataLoading } = useQuery(GET_PROJECT, {
        client,
        revalidateOnMount: 3600,
        revalidateOnReconnect: 3600,
        revalidateOnFocus: false,
        variables: {
            "where": {
                "clientOrdered": {
                    "userIs": {
                        "email": user?.email || 'no email'
                    }
                }
            }

        }
    })



    // fetching functions
    const getModuleTicketCount = async () => {
        const { data } = await moduleTicketDataFn({
            variables: {
                "where": {
                    "clientHas": {
                        "userIs": {
                            "email": user?.email || 'no email'
                        }
                    }

                }
            }
        })

        data.moduleTickets.length && setTotalTickets(data?.moduleTickets?.length)
    }
    const getPendingTicket = async () => {
        const { data } = await moduleTicketDataFn({
            variables: {
                "where": {
                    "status_IN": ["PENDING", "ACCEPTED", "UNDER_REVIEW"],
                    "clientHas": {
                        "userIs": {
                            "email": user?.email || 'no email'
                        }
                    }

                }
            }
        })
        data.moduleTickets.length && setPendingTickets(data?.moduleTickets?.length)
    }
    const getCompletedTicket = async () => {
        const { data } = await moduleTicketDataFn({
            variables: {
                "where": {
                    status: "COMPLETED",
                    "clientHas": {
                        "userIs": {
                            "email": user?.email || 'no email'
                        }
                    }

                }
            }
        })
        data.moduleTickets.length && setCompletedTickets(data?.moduleTickets?.length)
    }
    const getLatestTicket = async () => {
        const { data } = await moduleTicketDataFn({
            variables: {
                "where": {
                    "clientHas": {
                        "userIs": {
                            "email": user?.email || 'no email'
                        }
                    }
                },
                "options": {
                    "sort": [
                        {
                            "createdAt": "DESC"
                        }
                    ],
                    "limit": 3
                }
            }
        })
        data.moduleTickets.length && setLatestTickets(data?.moduleTickets)
    }



    //render
    return (
        <div className='p-4 h-full max-h-screen  flex flex-col space-y-4   '>
            {/* top cards section */}
            <section className='grid grid-cols-5 xl:grid-cols-4 gap-4 h-[120px]'>
                <div className='mb-5'>
                    <HomeCard title='Total Projects' value={projectData?.projects?.length || '00'} />
                </div>
                <div className='mb-5'>
                    <HomeCard title='Tickets' value={`${totalTickets < 10 ? `0${totalTickets}` : totalTickets}` || '00'} />
                </div>
                <div className='mb-5'>
                    <HomeCard title='Pending' value={`${pendingTickets < 10 ? `0${pendingTickets}` : pendingTickets}` || '00'} />
                </div>
                <div className='mb-5'>
                    <HomeCard title='Completed' value={`${completedTickets < 10 ? `0${completedTickets}` : completedTickets}` || '00'} />
                </div>

            </section>
            {/* sections  */}

            <div className='grid grid-cols-1 md:grid-cols-3  lg:grid-cols-5 lg:grid-rows-4 h-full  max-h-full gap-2'>
                {/* notification */}
                <section className='lg:col-span-2 lg:row-span-full border border-desktopPrimaryLight rounded-md h-full space-y-3 p-2 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch max-h-full'>
                    <p className='text-desktopText font-medium text-xl'>Notification</p>
                    <div className='h-full '>
                        {
                            notificationsData?.notifications && notificationsData?.notifications?.map((notification: Notification, i: number) =>
                                <div key={i}>
                                    <NotificationCard data={notification} />
                                </div>
                            )
                        }
                    </div>
                </section>
                {/* emty -1 */}
                <section className='lg:col-span-1 lg:row-span-full  border border-desktopPrimaryLight h-full max-h-full'>
                    <div className='h-full w-full grid grid-rows-3 gap-2'>
                        <div className='row-span-2 bg-gray-100 h-full w-full'>

                        </div>
                        <div className=' bg-gray-100 h-full w-full'>

                        </div>

                    </div>
                </section>
                {/* Tasks and weather */}

                <section className='lg:col-span-2 lg:row-span-full border border-desktopPrimaryLight h-full max-h-full'>
                    <div className='h-full w-full grid grid-rows-4 gap-2'>
                        <div className='row-span-2  h-full w-full p-2'>
                            <p className='text-desktopText font-medium text-xl'>Tickets Unsloved</p>
                            <div className='space-y-3'>
                                {
                                    latestTickets && latestTickets?.map((item: any, i: number) =>
                                        <div key={i} className='w-full flex items-center justify-between px-3 py-2 border-b'>
                                            <div className='flex items-center  space-x-3'>
                                                <div className='h-3 w-3 rounded-full bg-green-500'></div>
                                                <div className='text-sm'>

                                                    <p className='text-desktopText text-xs xl:text-base'>{item?.ticket}</p>
                                                    <p className='text-desktopTextLight text-[10px] xl:text-sm'>{item?.createdAt}</p>
                                                </div>
                                            </div>

                                            <div className='flex items-center justify-center space-x-3'>

                                                <button className='bg-primary/10 text-primary text-[10px] xl:text-sm px-4 py-1 rounded-2xl'>
                                                    {item?.status}
                                                </button>

                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                        </div>
                        <div className=' bg-gray-100 h-full w-full'>

                        </div>
                        {/* weather */}
                        <div className=' bg-white h-full w-full max-h-full grid place-content-center  overflow-hidden '>

                            <div className="bg-white max-h-full p-2 bg-opacity-80 h-full flex space-x-12 items-center  ">
                                <div className=''>
                                    <svg className="h-14 xl:h-20 w-24 xl:w-32" viewBox="0 -32 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m62.640625 137.230469c2.804687-46.371094 41.292969-83.113281 88.371094-83.113281 37.964843 0 70.347656 23.902343 82.929687 57.476562 32.695313.394531 59.082032 27.003906 59.082032 59.792969 0 33.035156-26.78125 59.816406-59.816407 59.816406-13.828125 0-154.71875 0-168.925781 0-25.960938 0-47.007812-21.046875-47.007812-47.007813 0-25.410156 20.167968-46.097656 45.367187-46.964843zm0 0" fill="#f0f5f7" /><path d="m293.023438 171.390625c0 23.898437-14.027344 44.53125-34.292969 54.105469 3.652343-7.738282 5.699219-16.390625 5.699219-25.519532 0-32.789062-26.382813-59.402343-59.078126-59.792968-12.585937-33.578125-44.964843-57.476563-82.933593-57.476563-17.121094 0-33.109375 4.859375-46.65625 13.28125 15.625-25.136719 43.480469-41.867187 75.25-41.867187 37.960937 0 70.347656 23.898437 82.925781 57.46875 32.699219.398437 59.085938 27.011718 59.085938 59.800781zm0 0" fill="#dde9ed" /><path d="m460.949219 249.117188c-3.160157-52.179688-46.46875-93.523438-99.445313-93.523438-42.722656 0-79.160156 26.894531-93.320312 64.671875-36.792969.445313-66.484375 30.390625-66.484375 67.289063 0 37.175781 30.136719 67.308593 67.308593 67.308593h190.09375c29.214844 0 52.894532-23.683593 52.894532-52.894531 0-28.597656-22.691406-51.875-51.046875-52.851562zm0 0" fill="#c4e1e8" /><path d="m512 301.964844c0 29.214844-23.6875 52.902344-52.902344 52.902344h-4.097656c3.835938-7.324219 6.007812-15.660157 6.007812-24.496094 0-28.59375-22.691406-51.875-51.050781-52.855469-3.15625-52.175781-46.472656-93.523437-99.445312-93.523437-7.144531 0-14.109375.75-20.820313 2.179687 18.121094-18.847656 43.59375-30.578125 71.8125-30.578125 52.976563 0 96.289063 41.339844 99.445313 93.527344 28.359375.96875 51.050781 24.25 51.050781 52.84375zm0 0" fill="#a4d5dd" /><path d="m428.652344 193.21875c0 65.496094-53.09375 118.589844-118.589844 118.589844-65.5 0-118.59375-53.09375-118.59375-118.589844 0-65.5 53.09375-118.59375 118.59375-118.59375 65.496094 0 118.589844 53.09375 118.589844 118.59375zm0 0" fill="#f6cb43" /><path d="m310.066406 311.808594c-65.5 0-118.59375-53.09375-118.59375-118.59375 0-57.445313 40.84375-105.359375 95.082032-116.253906-1.535157 7.601562-2.335938 15.457031-2.335938 23.511718 0 65.5 53.089844 118.589844 118.589844 118.589844 8.054687 0 15.910156-.800781 23.511718-2.332031-10.910156 54.234375-58.820312 95.078125-116.253906 95.078125zm0 0" fill="#fab03c" /><g fill="#f8e98e"><path d="m495.550781 200.945312h-25.542969c-4.265624 0-7.726562-3.460937-7.726562-7.726562 0-4.269531 3.460938-7.726562 7.726562-7.726562h25.542969c4.269531 0 7.726563 3.457031 7.726563 7.726562 0 4.265625-3.457032 7.726562-7.726563 7.726562zm0 0" /><path d="m448.585938 120.972656c-2.667969 0-5.265626-1.386718-6.695313-3.867187-2.136719-3.695313-.871094-8.421875 2.828125-10.554688l22.121094-12.769531c3.695312-2.132812 8.417968-.871094 10.550781 2.828125 2.136719 3.695313.871094 8.417969-2.828125 10.550781l-22.121094 12.773438c-1.214844.703125-2.542968 1.039062-3.855468 1.039062zm0 0" /><path d="m390.027344 62.425781c-1.308594 0-2.636719-.332031-3.855469-1.035156-3.695313-2.136719-4.960937-6.859375-2.828125-10.554687l12.773438-22.121094c2.132812-3.695313 6.855468-4.964844 10.554687-2.828125 3.695313 2.132812 4.960937 6.859375 2.824219 10.554687l-12.769532 22.121094c-1.429687 2.476562-4.027343 3.863281-6.699218 3.863281zm0 0" /><path d="m310.0625 40.996094c-4.269531 0-7.726562-3.460938-7.726562-7.726563v-25.542969c0-4.265624 3.457031-7.726562 7.726562-7.726562 4.265625 0 7.722656 3.460938 7.722656 7.726562v25.542969c.003906 4.265625-3.457031 7.726563-7.722656 7.726563zm0 0" /><path d="m230.09375 62.425781c-2.667969 0-5.265625-1.386719-6.695312-3.863281l-12.773438-22.121094c-2.132812-3.695312-.867188-8.421875 2.828125-10.554687 3.695313-2.132813 8.421875-.867188 10.554687 2.828125l12.769532 22.121094c2.136718 3.695312.871094 8.421874-2.828125 10.554687-1.214844.703125-2.542969 1.035156-3.855469 1.035156zm0 0" /></g><path d="m259.25 249.117188c-3.160156-52.179688-46.46875-93.523438-99.445312-93.523438-42.722657 0-79.160157 26.894531-93.320313 64.671875-36.792969.445313-66.484375 30.390625-66.484375 67.289063 0 37.171874 30.136719 67.308593 67.308594 67.308593h190.09375c29.214844 0 52.898437-23.683593 52.898437-52.898437-.003906-28.59375-22.695312-51.871094-51.050781-52.847656zm0 0" fill="#c4e1e8" /><path d="m310.300781 301.964844c0 29.214844-23.6875 52.902344-52.902343 52.902344h-4.097657c3.835938-7.324219 6.007813-15.660157 6.007813-24.496094 0-28.59375-22.691406-51.875-51.050782-52.855469-3.15625-52.175781-46.472656-93.523437-99.445312-93.523437-7.144531 0-14.109375.75-20.820312 2.179687 18.121093-18.847656 43.59375-30.578125 71.8125-30.578125 52.976562 0 96.289062 41.339844 99.449218 93.527344 28.355469.96875 51.046875 24.25 51.046875 52.84375zm0 0" fill="#a4d5dd" /><path d="m418.566406 342.792969c-3.15625-52.179688-46.46875-93.523438-99.441406-93.523438-42.726562 0-79.164062 26.894531-93.324219 64.671875-36.789062.445313-66.480469 30.394532-66.480469 67.289063 0 37.175781 30.132813 67.308593 67.308594 67.308593h190.09375c29.210938 0 52.894532-23.683593 52.894532-52.894531 0-28.597656-22.691407-51.875-51.050782-52.851562zm0 0" fill="#f0f5f7" /><path d="m469.621094 395.640625c0 29.214844-23.6875 52.902344-52.902344 52.902344h-4.097656c3.835937-7.324219 6.007812-15.660157 6.007812-24.496094 0-28.59375-22.691406-51.875-51.050781-52.855469-3.15625-52.175781-46.472656-93.523437-99.449219-93.523437-7.144531 0-14.109375.75-20.820312 2.179687 18.125-18.84375 43.597656-30.578125 71.816406-30.578125 52.976562 0 96.289062 41.339844 99.445312 93.527344 28.359376.96875 51.050782 24.25 51.050782 52.84375zm0 0" fill="#dde9ed" /><path d="m392.191406 336.9375c-3.488281 0-6.652344-2.382812-7.503906-5.921875-.894531-3.71875-2.117188-7.386719-3.636719-10.898437-1.695312-3.917969.105469-8.464844 4.023438-10.160157 3.917969-1.695312 8.464843.109375 10.160156 4.023438 1.871094 4.328125 3.375 8.84375 4.476563 13.421875 1 4.152344-1.558594 8.320312-5.707032 9.320312-.605468.144532-1.214844.214844-1.8125.214844zm0 0" fill="#f0f5f7" /><path d="m373.371094 302.578125c-2.03125 0-4.058594-.796875-5.574219-2.378906-12.867187-13.40625-30.152344-20.789063-48.671875-20.789063-4.265625 0-7.726562-3.457031-7.726562-7.726562 0-4.265625 3.460937-7.722656 7.726562-7.722656 22.765625 0 44.011719 9.070312 59.820312 25.542968 2.953126 3.074219 2.855469 7.96875-.222656 10.921875-1.5 1.4375-3.425781 2.152344-5.351562 2.152344zm0 0" fill="#f0f5f7" /><path d="m78.875 372.9375c2.257812-37.304688 33.222656-66.859375 71.09375-66.859375 30.546875 0 56.59375 19.226563 66.71875 46.234375 26.304688.320312 47.53125 21.726562 47.53125 48.105469 0 26.578125-21.542969 48.121093-48.121094 48.121093-11.125 0-124.46875 0-135.902344 0-20.882812 0-37.816406-16.929687-37.816406-37.816406 0-20.441406 16.222656-37.085937 36.496094-37.785156zm0 0" fill="#f0f5f7" /><path d="m264.21875 400.421875c0 26.347656-21.1875 47.75-47.457031 48.109375 7.875-8.574219 12.679687-19.996094 12.679687-32.542969 0-26.375-21.222656-47.785156-47.535156-48.105469-10.121094-27.003906-36.167969-46.238281-66.71875-46.238281-3.609375 0-7.152344.273438-10.621094.792969 12.324219-10.21875 28.144532-16.355469 45.402344-16.355469 30.546875 0 56.59375 19.222657 66.714844 46.234375 26.3125.320313 47.535156 21.722656 47.535156 48.105469zm0 0" fill="#dde9ed" /></svg>
                                    <p className="text-center text-gray-500 mt-2 text-sm">Cloudy</p>
                                </div>
                                <div>
                                    <p className="md:text-4xl text-6xl xl:text-7xl font-bold text-right text-gray-900">12°</p>
                                    <p className="text-gray-500 text-[10px] lg:text-xs xl:text-sm">Manhattan, NY </p>
                                </div>
                            </div>


                        </div>


                    </div>
                </section>
            </div>
        </div>
    );
};

export default Main;