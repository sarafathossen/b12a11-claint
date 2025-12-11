import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const AssignService = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: booking = [], refetch } = useQuery({
        queryKey: ['booking', user?.email, 'decorator_assigned'],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `booking/decorator?deceretorEmail=${user?.email}&workingStatus=decorator_assigned`
            );
            return res.data;
        }
    });


    const handelBookingStatusUpdate = (booking, workingStatus) => {
        const statusInfo = {
            workingStatus,
            deceretorId: booking.deceretorId // spelling match backend
        };
        let message = `Status is updated to ${workingStatus.split('_').join(' ')}`;

        axiosSecure.patch(`/booking/${booking._id}/workingStatus`, statusInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    alert(message);
                }
            });
    };

    return (
        <div>
            <h2 className='text-5xl'>Deceretor painding Booking {booking.length} </h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Confirm</th>
                            <th>Favorite Color</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            booking.map((book, index) => <tr key={book._id}>
                                <th> {index + 1} </th>
                                <td>{book.serviceName}</td>
                                {
                                    book.workingStatus === 'decorator_assigned' ? <>
                                        <td>
                                            <button onClick={() => handelBookingStatusUpdate(book, 'decorator_accepcted')} className='btn'>Accepct</button>
                                            <button className='btn btn-warning'>Reject</button>
                                        </td>
                                    </> : <span>Accepted</span>
                                }
                                <td className='gap-4'>
                                    <button onClick={() => handelBookingStatusUpdate(book, 'decorator_working')} className='btn'>Working</button>
                                    <button onClick={() => handelBookingStatusUpdate(book, 'finished_work')} className='btn mx-2'>Finished</button>
                                </td>
                            </tr>)
                        }


                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignService;