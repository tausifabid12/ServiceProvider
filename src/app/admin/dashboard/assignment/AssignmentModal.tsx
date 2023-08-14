'use client'
import { Fragment, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dialog, Transition } from '@headlessui/react';
import AutoSelect from '@/components/AutoSelect';
import { useGqlClient } from '@/hooks/UseGqlClient';
import { useManualQuery, useMutation, useQuery } from 'graphql-hooks';
import { toast } from 'react-hot-toast';
import { generateUniqueId } from '@/shared/genarateUniqueId';




//props interface
interface IModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    currentProject: any
    refetchProjects: () => void
}

const GET_COUNTER = `query Query {
    counters {
        moduleCount
    }
  }`
const UPDATE_COUNTER = `
mutation UpdateCounters($update: CounterUpdateInput) {
    updateCounters(update: $update) {
      counters {
        moduleCount
      }
    }
  }


  `

const GET_VENDORS = `
query Users($where: UserWhere) {
    users(where: $where) {
      companyName
      id
    }
  }
`

const ASSIGN_MODULE = `
mutation Mutation($input: [ModuleTicketCreateInput!]!) {
    createModuleTickets(input: $input) {
      info {
        nodesCreated
      }
    }
  }

`


//component
function AssignmentModal({ isOpen, setIsOpen, currentProject, refetchProjects }: IModalProps) {

    //states
    const [selected, setSelected] = useState<any>({});

    //hooks
    const client = useGqlClient();


    // Fetch data from graphql
    const [counterFn, counterState] = useManualQuery(GET_COUNTER, { client })

    const { data: vendors, loading } = useQuery(GET_VENDORS, {
        client,
        variables: {
            where: {
                user_type: "SERVICE_PROVIDER",
                status: "APPROVED"
            }
        }
    })

    //  mutations
    const [assignModuleFn, state] = useMutation(ASSIGN_MODULE, { client });
    const [updateCounterFn, updateState] = useMutation(UPDATE_COUNTER, { client })


    // initializing  assign module

    const assignModule = async () => {
        const moduleTicket = await generateModuleTicket()
        const { data } = await assignModuleFn({
            variables: {
                input: [
                    {
                        vendorHas: {
                            connect: {
                                where: {
                                    node: {
                                        userIs: {
                                            companyName: selected.companyName,
                                            // id: null
                                        }
                                    }
                                }
                            }
                        },
                        ticket: moduleTicket,
                        clientHas: {
                            connect: {
                                where: {
                                    node: {
                                        userIs: {
                                            email: currentProject.clientEmail,
                                        }
                                    }
                                }
                            }
                        },
                        projectticketHas: {
                            connect: {
                                where: {
                                    node: {
                                        projectTicket: currentProject.projectTicket
                                    }
                                }
                            }
                        },
                        forModule: {
                            connect: {
                                where: {
                                    node: {
                                        id: currentProject.moduleId
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        })

        if (data.createModuleTickets.info.nodesCreated) {
            setIsOpen(false);
            toast.success('Module assigned successfully');
            console.log('success')
            refetchProjects()
        }
    }


    console.log(currentProject, selected, selected.companyName, currentProject.projectTicket)


    //handle close modal
    function closeModal() {
        setIsOpen(false);
    }


    const generateModuleTicket = async () => {
        const { data } = await counterFn()
        const counter = data?.counters[0]
        if (counter?.moduleCount) {
            const moduleCount = counter?.moduleCount + 1
            const ModuleTicket = generateUniqueId("M-", moduleCount)
            // updating project counter
            updateCounterFn({
                variables: {
                    update: {
                        moduleCount: moduleCount,
                    }
                }
            })
            return ModuleTicket
        }
        return null
    }








    //render
    return (
        <div>


            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-[5000000000] inset-0 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
                        </Transition.Child>

                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >

                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                                <p className="focus:outline-none pt-4 pb-8 text-base text-center sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">Assing Tasks</p>
                                <div className='p-8'>
                                    <div className='grid grid-cols-1 gap-6 mb-12'>
                                        <div>
                                            <p className="text-xs lg:text-sm ">Module : Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                            <p className="text-xs lg:text-sm ">Description : Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                        </div>
                                        <div>
                                            <p className="text-xs lg:text-sm font-semibold mb-1  text-gray-700">
                                                Select Vendor
                                            </p>

                                            <div className='relative'>

                                                <AutoSelect setSelected={setSelected} selected={selected} data={vendors?.users} />
                                            </div>
                                        </div>
                                    </div>


                                    <div className="mt-20">
                                        <button
                                            onClick={assignModule}
                                            type="submit"
                                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                                        >
                                            {state.loading ? 'loading' : 'Submit'}
                                        </button>
                                        <button
                                            type="button"
                                            className="ml-2 px-4 py-2 text-gray-500 rounded-md hover:bg-gray-200"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
}

export default AssignmentModal;
