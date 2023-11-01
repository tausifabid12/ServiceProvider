'use client'
import Loading from '@/app/loading';
import Button from '@/components/Button';
import Error from '@/components/Error';
import AuthConfig from '@/firebase/oauth.config';
import { useGqlClient } from '@/hooks/UseGqlClient';
import { useManualQuery, useMutation, useQuery } from 'graphql-hooks';
import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Industries from './Industries';
import Services from './Services';
import Documents from './Documents';

const GET_USER = `query Users($where: UserWhere) {
    users(where: $where) {
      name
      user_type
      email
      address
      bio
      companyName
      companyEmail
      gstNumber
      image
      zip
      city
      state
      secondAddress
      mobile
      panCardNo
      hasDocuments {
        hasFiles {
          id
          links
        }
      }
      isVendor {
        id
        industry
        service
      }
    }
  }`

const UPDATE_USER = `mutation Mutation($where: UserWhere, $update: UserUpdateInput) {
    updateUsers(where: $where, update: $update) {
        users {
          id
        }
      }
  }`

const Main = () => {

    //states
    const [previousData, setPreviousData] = React.useState<any>(null)
    const [userInfo, setUserInfo] = React.useState({
        name: '',
        user_type: '',
        email: '',
        address: '',
        bio: '',
        companyName: '',
        companyEmail: '',
        gstNumber: '',
        image: '',
        zip: '',
        city: '',
        state: '',
        secondAddress: '',
        mobile: '',
        panCardNo: '',
    })


    //hooks
    const client = useGqlClient()
    const { user, authLoading } = AuthConfig()


    console.log(user)


    // fetching data
    const [getUserFn, userState] = useManualQuery(GET_USER, {
        client,
    })

    // updating the user node
    const [updateUserFn, updateUserState] = useMutation(UPDATE_USER, { client })




    // setting the user data  to the state
    useEffect(() => {
        if (previousData) {
            const { name, user_type, email, address, bio, secondAddress, mobile, panCardNo, companyName, companyEmail, gstNumber, image, zip, city, state } = previousData
            setUserInfo({
                name,
                user_type,
                email,
                address,
                bio,
                companyName,
                companyEmail,
                gstNumber,
                image,
                zip,
                city,
                state,
                secondAddress,
                mobile,
                panCardNo,
            })
        }
    }, [previousData])




    useEffect(() => {
        if (user?.email) {
            getUser()
        }
    }, [user?.email, authLoading])



    // get user 
    const getUser = async () => {
        const { data } = await getUserFn({
            variables: { where: { email: user?.email || 'no user' } }
        })
        if (data?.users[0]?.name) {
            setPreviousData(data?.users[0])
        }
    }




    // updating the user node

    const updateUser = async () => {
        const { name, user_type, email, address, bio, companyName, companyEmail, secondAddress, mobile, panCardNo, gstNumber, image, zip, city, state } = userInfo
        const { data, error } = await updateUserFn({
            variables: {
                where: { email },
                update: {
                    name,
                    user_type,
                    email,
                    address,
                    bio,
                    companyName,
                    companyEmail,
                    gstNumber,
                    image,
                    zip,
                    city,
                    state,
                    secondAddress,
                    mobile,
                    panCardNo,
                }
            }
        })
        if (data.updateUsers.users[0].id) {
            toast.success('User updated successfully')
        }
        if (error) {
            toast.success('Something went wrong')
        }
    }





    if (updateUserState.loading || authLoading || userState.loading) return <div><Loading /></div>

    if (userState.error || updateUserState.error) return <Error />

    return (
        <div className="container flex flex-col mx-auto space-y-12">
            <fieldset className="grid grid-cols-3 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-900">

                {
                    previousData?.user_type !== "LAB_ASSISTANT" &&
                    <div className="col-span-full lg:col-span-1">
                        {
                            previousData?.user_type !== "LAB_ASSISTANT" && <Industries data={previousData?.isVendor?.industry} refetch={getUser} />
                        }
                        {
                            previousData?.user_type !== "LAB_ASSISTANT" && <Services data={previousData?.isVendor?.service} refetch={getUser} />
                        }
                        {
                            previousData?.hasDocuments?.hasFiles?.links?.length ? <Documents data={previousData?.hasDocuments?.hasFiles} refetch={getUser} /> : <></>
                        }

                    </div>
                }

                <form className="grid grid-cols-6 gap-4 col-span-full lg:col-span-2">

                    <div className="col-span-full sm:col-span-3">
                        <label htmlFor="lastname" className="text-sm" >Username</label>
                        <input
                            type="text"
                            required
                            value={userInfo?.name || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                            placeholder="Last name" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                    </div>
                    <div className="col-span-full sm:col-span-3">
                        <label htmlFor="email" className="text-sm">Email</label>
                        <input
                            value={userInfo.email || ''}
                            readOnly
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                            type="email" placeholder="Email" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                    </div>

                    {
                        previousData && previousData?.user_type !== "LAB_ASSISTANT" &&
                        <>

                            <div className="col-span-full">
                                <label htmlFor="address" className="text-sm">Company Name</label>
                                <input
                                    required
                                    value={userInfo.companyName || ''}
                                    onChange={(e) => setUserInfo({ ...userInfo, companyName: e.target.value })}
                                    id="address" type="text" placeholder="" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                            </div>
                            <div className="col-span-full">
                                <label htmlFor="address" className="text-sm">Company Email</label>
                                <input
                                    value={userInfo.companyEmail || ''}
                                    onChange={(e) => setUserInfo({ ...userInfo, companyEmail: e.target.value })}
                                    id="address" type="text" placeholder="" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                            </div>
                            <div className="col-span-full sm:col-span-3">
                                <label htmlFor="website" className="text-sm">Gst no.</label>
                                <input
                                    required
                                    value={userInfo.gstNumber || ''}
                                    onChange={(e) => setUserInfo({ ...userInfo, gstNumber: e.target.value })}
                                    id="website" type="text" placeholder="Gst no." className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                            </div>

                        </>
                    }





                    <div className="col-span-full">
                        <label htmlFor="address" className="text-sm">Pan Card No</label>
                        <input
                            required
                            value={userInfo.panCardNo || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, panCardNo: e.target.value })}
                            id="address" type="text" placeholder="" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="address" className="text-sm">Mobile Number</label>
                        <input
                            required
                            value={userInfo.mobile || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, mobile: e.target.value })}
                            id="address" type="text" placeholder="" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="address" className="text-sm">Address</label>
                        <input
                            required
                            value={userInfo.address || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                            id="address" type="text" placeholder="" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="address" className="text-sm">Second Address</label>
                        <input
                            required
                            value={userInfo.secondAddress || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, secondAddress: e.target.value })}
                            id="address" type="text" placeholder="" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <label htmlFor="city" className="text-sm">City</label>
                        <input
                            required
                            value={userInfo.city || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
                            id="city" type="text" placeholder="" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <label htmlFor="state" className="text-sm">State / Province</label>
                        <input
                            required
                            value={userInfo.state || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, state: e.target.value })}
                            id="state" type="text" placeholder="" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <label htmlFor="zip" className="text-sm">ZIP / Postal</label>
                        <input
                            value={userInfo.zip || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, zip: e.target.value })}
                            id="zip" type="text" placeholder="" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900" />
                    </div>
                    <div className="col-span-full">
                        <label htmlFor="bio" className="text-sm">Bio</label>
                        <textarea
                            value={userInfo.bio || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                            id="bio" placeholder="" className="w-full rounded-md focus:ring ring-primary dark:border-gray-700 dark:text-gray-900"></textarea>
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <div onClick={updateUser}>

                            <Button title={updateUserState.loading ? "loading.." : "Update"} />
                        </div>
                    </div>
                </form>
            </fieldset>

        </div>
    );
};

export default Main;