import React from 'react';
import InvoiceForm from './InvoiceForm';

const page = () => {
    return (
        <>
            <div className="w-full  bg-white rounded-lg py-4 md:py-7 px-4 md:px-8 xl:px-10 ">
                <div className=" py-4 md:py-7">
                    <div className="flex items-center justify-between">
                        <p className="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">Create Invoices</p>

                    </div>
                </div>
                <div>
                    <InvoiceForm />
                </div>



            </div>
        </>
    );
};

export default page;