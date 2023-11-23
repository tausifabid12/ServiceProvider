'use client'



import Loading from "@/app/loading";
import { useAuth } from "@/firebase/AuthProvider";
import { useGqlClient } from "@/hooks/UseGqlClient";
import { useMutation, useQuery } from "graphql-hooks";
import Cookies from "js-cookie";
import React, { useContext, useEffect } from "react";
import { createContext, ReactNode } from "react";
import { useState } from "react";




const GET_MODULE = `
query ModuleTickets($where: ModuleTicketWhere, $options: ModuleTicketOptions) {
  moduleTickets(where: $where, options: $options) {
    id
    reports
  }
}
`

const GET_INVOICE_COUNT = `
query Invoices($where: InvoiceWhere) {
    invoices(where: $where) {
      id
    }
  }
`







const UPDATE_INVOICE_VIEW = `
mutation UpdateInvoices($where: InvoiceWhere, $update: InvoiceUpdateInput) {
    updateInvoices(where: $where, update: $update) {
      info {
        nodesCreated
      }
    }
  }
`
const UPDATE_MODULE = `
mutation UpdateModuleTickets($where: ModuleTicketWhere, $update: ModuleTicketUpdateInput) {
  updateModuleTickets(where: $where, update: $update) {
    info {
      nodesCreated
    }
  }
}
`





export const CounterContext = createContext<ContextType | undefined>(undefined);


type ContextType = {
  invoiceCounter: number,
  moduleCounter: number,
  handleUpdateView: (id: string, type: string) => void
  invoiceRefetch: any,
  invoiceCountLoading: boolean,
  moduleRefetch: any,
  moduleCountLoading: boolean,


}


type AuthProviderProps = {
  children: ReactNode;
};

const CounterProvider = ({ children }: AuthProviderProps) => {
  const [emailCounter, setEmailCounter] = useState(0);
  const [invoiceCounter, setInvoiceCounter] = useState(0);
  const [moduleCounter, setModuleCounter] = useState(0);





  // HOOKS
  const client = useGqlClient()
  const { user, authLoading }: any = useAuth()













  const { data: invoiceCountData, error: invoiceCountError, loading: invoiceCountLoading, refetch: invoiceRefetch } = useQuery(GET_INVOICE_COUNT, {
    client,
    variables: {

      where: {
        isViewedByClient: false,
        hasClient: {
          userIs: {
            email: user?.email || 'no email'
          }
        },
      }
    }
  })
  const { data: moduleCountData, error: moduleCountError, loading: moduleCountLoading, refetch: moduleRefetch } = useQuery(GET_MODULE, {
    client,
    variables: {

      where: {
        isViewedByClient: false,
        hasClient: {
          userIs: {
            email: user?.email || 'no email'
          }
        },
      }
    }
  })




  //mutations


  const [updateInvoiceView] = useMutation(UPDATE_INVOICE_VIEW, { client })
  const [updateModuleView] = useMutation(UPDATE_MODULE, { client })






  const handleUpdateView = async (id: string, type: string) => {
    const variables = {
      "where": {
        "id": id
      },
      "update": {
        "isViewedByClient": true
      }
    }

    if (type === "Estimation") {
      await updateInvoiceView({ variables })
    } else if (type === "Module") {
      await updateModuleView({ variables })
    }


  }



  useEffect(() => {


    if (invoiceCountData?.invoices.length) {
      setInvoiceCounter(invoiceCountData?.invoices?.length)
    }
    if (moduleCountData?.moduleTickets.length) {

      let count = 0
      moduleCountData.moduleTickets.forEach((module: any) => {
        if (module.reports.length) {
          count = count + 1
        }
      })

      setModuleCounter(count)
    }



  }, [moduleCountData, invoiceCountData])




  console.log("invoiceCountData", invoiceCountData, "moduleCountData", moduleCountData)



  if (authLoading) return <Loading />




  const authInfo: ContextType = {
    invoiceCounter,
    moduleCounter,
    handleUpdateView,
    invoiceRefetch,
    invoiceCountLoading,
    moduleRefetch,
    moduleCountLoading,





  };

  return <CounterContext.Provider value={authInfo}>{children}</CounterContext.Provider>;
};

export default CounterProvider;




// return (
//   <>
//     <AuthContext.Provider value={authInfo}>
//       {children}
//     </AuthContext.Provider>
//   </>
// );


// export default AuthProvider;

export const useCounterData = (): ContextType | undefined => {
  const data = useContext(CounterContext);
  return data;
};