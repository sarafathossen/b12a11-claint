import React, { useRef, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const AssignDeceretors = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const axiosSecure = useAxiosSecure();
    const DeceretorModalRef = useRef();

    // Fetch bookings
    const { data: booking = [], refetch: bookingRefetch } = useQuery({
        queryKey: ['booking', 'pending-pickup'],
        queryFn: async () => {
            const res = await axiosSecure.get('/booking?workingStatus=pending-pickup');
            return res.data;
        }
    });

    // Fetch decorators for selected booking
    const { data: decorator = [] } = useQuery({
        queryKey: ['decorator', selectedBooking?.category, 'available'],
        enabled: !!selectedBooking,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/decorator?role=decorator&specialty=${selectedBooking?.category}&deceretorWorkingStatus=available`
            );
            return res.data;
        }
    });

    const openAssignDeceretorModal = (bookingItem) => {
        setSelectedBooking(bookingItem);
        DeceretorModalRef.current.showModal();
    };

    const handleAssignDeceretor = (dec) => {
        const assignDeceretorInfo = {
            deceretorId: dec._id,
            deceretorName: dec.displayName,
            deceretorEmail: dec.email,
        };
        axiosSecure.patch(`/booking/${selectedBooking._id}`, assignDeceretorInfo)
            .then(res => {
                if (res.data.bookingUpdated) {
                    bookingRefetch();
                    DeceretorModalRef.current.close();
                    alert('Decorator Assigned Successfully');
                }
            });
    }

    return (
        <div>
            <h2 className='text-5xl'>Assign Decorators: {booking.length}</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Cost</th>
                            <th>Create At</th>
                            <th>Category</th>
                            <th>Work Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {booking.map((book, index) => (
                            <tr key={book._id}>
                                <th>{index + 1}</th>
                                <td>{book.serviceName}</td>
                                <td>{book.finalCost}</td>
                                <td>{book.bookingDate}</td>
                                <td>{book.category}</td>
                                <td>{book.workingStatus}</td>
                                <td>
                                    <button
                                        onClick={() => openAssignDeceretorModal(book)}
                                        className='btn'
                                    >
                                        Find Decorator
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <dialog ref={DeceretorModalRef} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Decorators: {decorator.length}</h3>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {decorator
                                        .filter(dec => dec.deceretorWorkingStatus !== "in_delivery")
                                        .map((dec, index) => (
                                            <tr key={dec._id}>
                                                <th>{index + 1}</th>
                                                <td>{dec.displayName}</td>
                                                <td>{dec.email}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleAssignDeceretor(dec)}
                                                        className='btn'
                                                    >
                                                        Assign
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    );
};

export default AssignDeceretors;
