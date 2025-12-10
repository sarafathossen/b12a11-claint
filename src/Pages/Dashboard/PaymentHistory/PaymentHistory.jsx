import React from 'react';
import useAuth from '../../../Hooks/useAuth';

import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const PaymentHistory = () => {
    const { user } = useAuth()
    const axiousSecure = useAxiosSecure()
    const {refetch, data: payments = [] } = useQuery({
        queryKey: ['payment-history', user?.email],
        queryFn: async () => {
            const res = await axiousSecure.get(`/payments?email=${user?.email}`)
            return res.data
        }
    })
    console.log(payments);
    return (
        <div>
            <h2 className='text-5xl'> Payment History : {payments.length} </h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>transaction Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            payments.map((payment,index) => <tr key={payment._id} >
                                <th>{index +1}</th>
                                <td>{payment.ParcelName}</td>
                                <td>{payment.amount}</td>
                                <td>{payment.transactionId}</td>
                            </tr>)
                        }

                        {/* row 2 */}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;