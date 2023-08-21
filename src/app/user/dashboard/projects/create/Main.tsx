'use client'
import AutoComplete from '@/components/AutoComplete';
import { useForm, SubmitHandler } from "react-hook-form"
import React, { useEffect } from 'react';
import ModuleFrom from './ModuleFrom';
import { IModuleInput, IProjectInput } from './createProject.interface';
import { useGqlClient } from '@/hooks/UseGqlClient';
import { useManualQuery, useMutation, useQuery } from 'graphql-hooks';
import { currentUser } from '@/firebase/oauth.config';
import { generateUniqueId } from '@/shared/genarateUniqueId';
import { toast } from 'react-hot-toast';
import Loading from '@/app/loading';
import { useRouter } from 'next/navigation';




const CREATE_PROJECT = `mutation Mutation($input: [ProjectCreateInput!]!) {
    createProjects(input: $input) {
      info {
        nodesCreated
      }
    }
  }`
const GET_USER = `query Query($where: UserWhere) {
    users(where: $where) {
      companyName
      city
      address
      zip
      state
      gstNumber
    }
  }`
const GET_PROJECT_COUNTER = `query Query {
    counters {
      projectCount
      moduleCount
      invoiceCount
    }
  }`
const UPDATE_PROJECT_COUNTER = `
mutation UpdateCounters($update: CounterUpdateInput) {
    updateCounters(update: $update) {
      counters {
        projectCount
      }
    }
  }


  `



//component
const Main = () => {

    //states
    const [moduleCount, setModuleCount] = React.useState(1)
    const [selectedCompany, setSelectCompany] = React.useState(null);
    const [modules, setModules] = React.useState<any[]>([]);
    const [userInfo, setUserInfo] = React.useState({

        address: '',
        gstNumber: '',
        companyName: '',
        zip: '',
        city: '',
        state: '',
    })




    // hook from
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IProjectInput>()
    const user = currentUser()
    const router = useRouter()

    //graphql client using custom hook
    const client = useGqlClient()

    //fetching project counter
    const [counterFn, counterState] = useManualQuery(GET_PROJECT_COUNTER, { client })
    const { data, loading, error } = useQuery(GET_USER, {
        client,
        variables: {
            where: {
                email: user?.email
            }

        }
    });


    // graphql mutation
    const [createProjectFn, state, resetFn] = useMutation(CREATE_PROJECT, { client })
    const [updateProjectCounterFn, updateState] = useMutation(UPDATE_PROJECT_COUNTER, { client })




    //handling project creation
    const handleProjectSubmit = (data: IProjectInput) => {
        createProject(data)
    }

    //handle project creation
    const createProject = async (projectData: IProjectInput) => {
        const { state, country, city, address, email, projectDescription, projectName, gstNumber } = projectData
        const projectId = await generateProjectTicket()

        const { data } = await createProjectFn({
            variables: {
                input: [
                    {
                        title: projectName,
                        description: projectDescription,
                        email: email,
                        gst: gstNumber,
                        companyName: selectedCompany,
                        country: country,
                        city: city,
                        address: address,
                        createdAt: new Date().toISOString(),
                        projectticketFor: {
                            create: {
                                node: {
                                    projectTicket: projectId
                                }
                            }
                        },
                        clientOrdered: {
                            connect: {
                                where: {
                                    node: {
                                        userIs: {
                                            email: user?.email
                                        }
                                    }
                                }
                            }
                        },
                        hasModule: {
                            create: modules.map((module, i) => {
                                const title = module[`moduleTitle${i + 1}`].title
                                const description = module[`moduleTitle${i + 1}`].description
                                const documents = module[`moduleTitle${i + 1}`].documents
                                console.log(documents.files,)
                                return {
                                    node: {
                                        title: title,
                                        description: description,
                                        hasDocuments: {
                                            create: {
                                                node: {
                                                    hasFiles: {
                                                        create: {
                                                            node: {
                                                                links: documents.files
                                                            }
                                                        }
                                                    },
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    }
                ]
            }
        })

        console.log(data.createProjects.info.nodesCreated, 'fu0000000000000000000000000000000000')

        if (data.createProjects.info.nodesCreated) {
            toast.success('Project created successfully')
            router.push('/user/dashboard/projects')
        }
    }




    const userData = data?.users[0]

    useEffect(() => {
        if (userData) {
            const { address, companyName, gstNumber, zip, city, state } = userData
            setUserInfo({
                address,
                companyName,
                gstNumber,
                zip,
                city,
                state,
            })
        }
    }, [userData])

    console.log(userInfo, 'user info')

    if (loading) return <div><Loading /></div>



    // generating project ticket

    const generateProjectTicket = async () => {
        const { data } = await counterFn()
        const counter = data?.counters[0]
        if (counter?.projectCount) {
            const projectCount = counter?.projectCount + 1
            const projectTicket = generateUniqueId("P-", projectCount)
            // updating project counter
            updateProjectCounterFn({
                variables: {
                    update: {
                        projectCount: projectCount,
                    }
                }
            })
            return projectTicket
        }
        return null
    }



    if (moduleCount < 1) {
        setModuleCount(1)
    }

    console.log(userData)

    //render
    return (

        <div className="">
            <div className="container max-w-screen-lg mx-auto">
                <div>

                    <form onSubmit={handleSubmit(handleProjectSubmit)} className="bg-white rounded p-4 px-4 md:p-8 mb-6">
                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-2">


                            <div className="lg:col-span-2">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                    <div className="md:col-span-5">
                                        <label htmlFor="email">Company Name</label>
                                        <input type="text" value={userInfo.companyName || ''} className="h-10 border border-gray-300 mt-1 rounded px-4 w-full "
                                            {...register("email")} />
                                    </div>

                                    <div className="md:col-span-5">
                                        <label htmlFor="email">Email Address</label>
                                        <input type="text" value={user?.email || ''} className="h-10 border border-gray-300 mt-1 rounded px-4 w-full "
                                            {...register("email")} />
                                    </div>

                                    <div className="md:col-span-3">
                                        <label htmlFor="address">Address / Street</label>
                                        <input value={userInfo.address || ''} type="text" id="address" className="h-10 border border-gray-300 mt-1 rounded px-4 w-full " placeholder=""
                                            {...register("address")} />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="city">City</label>
                                        <input type="text" id="city"
                                            value={userInfo.city || ''} className="h-10 border border-gray-300 mt-1 rounded px-4 w-full " placeholder=""
                                            {...register("city")} />
                                    </div>


                                    <div className="md:col-span-2">
                                        <label htmlFor="state">State / province</label>
                                        <div className="h-10  flex border  border-gray-300 rounded items-center mt-1">
                                            <input
                                                value={userInfo.state || ''}
                                                id="state" placeholder="State" className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                                                {...register("state")} />
                                            <button className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600">
                                                <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" strokeLinecap="round" stroke-linejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </button>
                                            <button className="cursor-pointer outline-none focus:outline-none border-l border-gray-300 transition-all text-gray-300 hover:text-blue-600">
                                                <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" strokeLinecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="md:col-span-1">
                                        <label htmlFor="gstNumber">Gst no.</label>
                                        <input
                                            value={userInfo.gstNumber || ''}
                                            type="text" id="zipCode" className="transition-all flex items-center h-10 border border-gray-300 mt-1 rounded px-4 w-full " placeholder=""
                                            {...register("gstNumber")} />

                                    </div>
                                    {/* project details */}

                                    <div className="col-span-full">
                                        <label htmlFor="address">Project name</label>
                                        <input type="text" id="address" className="h-10 border border-gray-300 mt-1 rounded px-4 w-full " placeholder=""   {...register('projectName')} />
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="city">Project Description</label>
                                        <textarea rows={4} id="city" className=" border border-gray-300 mt-1 rounded px-4 w-full " placeholder="" {...register("projectDescription")} />
                                    </div>



                                    {/* modules add  start */}
                                    <div className="md:col-span-5 mt-8">
                                        <div>
                                            {/* modules title */}
                                            <div className='flex  justify-between'>
                                                <p className='text-xl font-semibold text-gray-800'>
                                                    Modules
                                                </p>

                                                <div>
                                                    <label >Add More Modules</label>
                                                    <div className="h-10 w-28  flex border border-gray-300  rounded items-center mt-1">
                                                        <button
                                                            onClick={() => setModuleCount(moduleCount - 1)}
                                                            className="cursor-pointer outline-none focus:outline-none border-r border-gray-300 transition-all text-gray-500 hover:text-blue-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                            </svg>
                                                        </button>
                                                        <input name="soda" id="soda" placeholder="0"
                                                            className="px-2 text-center appearance-none outline-none text-gray-800 w-full bg-transparent"
                                                            readOnly
                                                            value={moduleCount}
                                                        />
                                                        <button onClick={() => setModuleCount(moduleCount + 1)} className="cursor-pointer outline-none focus:outline-none border-l border-gray-300 transition-all text-gray-500 hover:text-blue-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 fill-current" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                            {/* service inputs */}
                                            <div className='space-y-5'>
                                                {
                                                    [...Array(moduleCount)].map((_, i) =>
                                                        <div key={i} className='grid grid-cols-1 gap-4 max-w-2xl'>
                                                            <ModuleFrom index={i + 1} setModules={setModules} modules={modules} />
                                                        </div>

                                                    )
                                                }
                                            </div>


                                        </div>
                                    </div>

                                    <div className=" mt-8">
                                        <div className="">
                                            <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-12 text-lg rounded">{state.loading ? "loading" : 'Submit'}</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Main;