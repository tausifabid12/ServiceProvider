import { currentUser } from "@/firebase/oauth.config"
import { ModuleTicketOptions, ModuleTicketWhere } from "@/gql/graphql"
import Cookies from "js-cookie";

const getInvoiceData = async (id: string) => {

  console.log(id, 'id', 'i am called')

  const token = Cookies.get('conventenToken');

  const res = fetch('http://localhost:4000/', {
      method: 'POST',
      headers: {
          "authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
      },
        body: JSON.stringify({
            query: `query Query($where: InvoiceWhere) {
                invoices(where: $where) {
                  id
                  priceWithTax
                  taxRate
                  taxType
                  totalPrice
                  hasService {
                    id
                    serviceName
                    price
                  }
                  hasClient {
                    id
                    userIs {
                      companyName
                      companyEmail
                      address
                    }
                  }
                }
              }
            `,
            variables: {
                    where: {
                        id: id
                    }
            },

        })
    })

    const { data } = await res.then(res => res.json())




    return data.invoices[0]
}


export default getInvoiceData