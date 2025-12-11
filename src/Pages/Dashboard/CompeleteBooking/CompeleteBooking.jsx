import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const CompeleteBooking = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: booking = [], refetch } = useQuery({
        queryKey: ['booking', user?.email, 'finished_work'],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `booking/decorator?deceretorEmail=${user?.email}&workingStatus=finished_work`
            );
            return res.data;
        }
    });

    // Pay Out calculation
    const calculatePayout = book => book.finalCost * 0.8;

    // Total earning
    const totalEarning = booking.reduce((sum, book) => sum + calculatePayout(book), 0);

    return (
        <div>
            <h2 className='text-5xl mb-4'>Completed Booking: {booking.length}</h2>
            <h2 className='text-2xl mb-4'>Total Earning: {totalEarning}</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Pay Out</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            booking.map((book, index) => (
                                <tr key={book._id}>
                                    <th>{index + 1}</th>
                                    <td>{book.serviceName}</td>
                                    <td>{book.category}</td>
                                    <td>{book.finalCost}</td>
                                    <td>{calculatePayout(book)}</td>
                                    <td className='gap-4'>
                                        <button className='btn btn-sm'>Cash Out</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompeleteBooking;
