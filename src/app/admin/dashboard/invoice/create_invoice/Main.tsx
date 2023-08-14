'use client'
import React from 'react';
import { useGqlClient } from '@/hooks/UseGqlClient';
import { useMutation } from 'graphql-hooks';
import { Invoice, Service } from '@/gql/graphql';
import InvoiceForm from './InvoiceForm';
import { currentUser } from '@/firebase/oauth.config';
import { parse } from 'path';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const CREATE_INVOICE = `
mutation CreateInvoices($input: [InvoiceCreateInput!]!) {
    createInvoices(input: $input) {
      info {
        nodesCreated
      }
    }
  }
`



// component
const Main = () => {


    // hooks
    const client = useGqlClient()
    const user = currentUser()
    const router = useRouter()


    // saving  user to database
    const [createInvoiceFn, state] = useMutation(CREATE_INVOICE, { client });


    // initializing invoice creation function
    const createInvoice = async (invoiceData: any, services: any, company: any) => {
        console.log(invoiceData.companyEmail
            , 'this is it 444444444', invoiceData.companyAddress)

        const { data } = await createInvoiceFn({
            variables: {
                input: [
                    {
                        clientName: company,
                        clientEmail: invoiceData.companyEmail,
                        clientAddress: invoiceData.companyAddress,
                        price: invoiceData.price,
                        taxRate: 5,
                        taxType: invoiceData.taxType,
                        hasClient: {
                            connect: {
                                where: {
                                    node: {
                                        userIs: {
                                            companyName: company
                                        }
                                    }
                                }
                            }
                        },
                        hasService: {
                            create: services.map((service: any, i: number) => {
                                console.log(service, 'this is it 444444444')
                                let name = service[`serviceName${i}`].serviceName
                                let price = service[`serviceName${i}`].price

                                return {
                                    node: {
                                        serviceName: name,
                                        price: parseInt(price),
                                    }
                                }
                            }
                            )
                        },
                        adminCreated: {
                            connect: {
                                where: {
                                    node: {
                                        userIs: {
                                            email: user?.email
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        })

        if (data.createInvoices.info.nodesCreated) {
            toast.success('Invoice created successfully')
            router.push('/admin/dashboard/invoice')
        }
    }


    // rendering
    return (
        <div>
            <InvoiceForm createInvoice={createInvoice} />
        </div>
    );
};

export default Main;