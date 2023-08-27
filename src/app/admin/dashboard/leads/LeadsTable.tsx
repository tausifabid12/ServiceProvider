import { Leads } from '@/gql/graphql';
import React from 'react';
interface ILeadsTable {
    data: Leads[]
    // setIsModalOpen: (value: boolean) => void;
    // setCurrentData: (value: any) => void;
}

const LeadsTable = ({ data }: ILeadsTable) => {
    return (
        <table className="min-w-full leading-normal uppercase">
            <thead>
                <tr className='border-b border-gray-200'>
                    <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-dimText dark:text-darkDimText uppercase tracking-wider dark:bg-darkBg dark:border-darkBorder">
                        Email
                    </th>
                    <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-dimText dark:text-darkDimText uppercase tracking-wider dark:bg-darkBg dark:border-darkBorder">
                        Phone
                    </th>

                    <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-dimText dark:text-darkDimText uppercase tracking-wider dark:bg-darkBg dark:border-darkBorder">
                        Industry
                    </th>
                    <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-dimText dark:text-darkDimText uppercase tracking-wider dark:bg-darkBg dark:border-darkBorder">
                        CreatedAt
                    </th>
                    <th
                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-dimText dark:text-darkDimText uppercase tracking-wider dark:bg-darkBg dark:border-darkBorder">
                        Status
                    </th>

                </tr>
            </thead>
            <tbody>

                {
                    data && data.map((lead, index) =>
                        <tr key={lead?.id} className='border-b border-gray-200'>

                            <td className="px-5 py-5  bg-white text-xs dark:bg-darkBg dark:border-darkBorder">
                                <p className=" whitespace-no-wrap">{lead?.email}</p>
                            </td>
                            <td className="px-5 py-5  bg-white text-xs dark:bg-darkBg dark:border-darkBorder">
                                <p className=" whitespace-no-wrap">
                                    {lead?.phone}
                                </p>
                            </td>

                            <td className="px-5 py-5  bg-white text-xs dark:bg-darkBg dark:border-darkBorder rounded-xl font-semibold">
                                <p className=" whitespace-no-wrap">
                                    {lead?.industry}
                                </p>
                            </td>
                            <td className="px-5 py-5  bg-white text-xs dark:bg-darkBg dark:border-darkBorder rounded-xl font-semibold">
                                <p className=" whitespace-no-wrap">
                                    {lead?.createdAt}
                                </p>
                            </td>
                            <td className="px-5 py-5 cursor-pointer  bg-white text-xs dark:bg-darkBg dark:border-darkBorder rounded-xl font-semibold">
                                <button
                                    // onClick={() => {
                                    //     setCurrentData(lead)
                                    // }}
                                    disabled={lead.status === "COMPLETED"}
                                    className={`   
                                ${lead.status === "COMPLETED" ? 'bg-gray-200 text-primaryText' : 'bg-green-500 text-white  '}
                                relative inline-block  px-4 py-1 rounded-md  leading-tight`}>
                                    <span
                                        className="absolute  "></span>
                                    <span className="relative font-bold">{lead.status === "COMPLETED" ? 'COMPLETED' : 'PENDING'}</span>
                                </button>
                            </td>

                        </tr>

                    )
                }




            </tbody>
        </table>
    );
};

export default LeadsTable;