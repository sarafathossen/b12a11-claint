import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const AproveDecorator = () => {
    const axiosSecure = useAxiosSecure();

    const { refetch, data: decorators = [] } = useQuery({
        queryKey: ['decorator', 'pending'],
        queryFn: async () => {
            const res = await axiosSecure.get('/decorator');
            return res.data;
        }
    });

    const handelApproved = (decorator) => {
        const updateRole = { role: 'decorator', email: decorator.email };

        axiosSecure.patch(`/decorator/${decorator._id}`, updateRole)
            .then(res => {
                if (res.data.modifiedCount) {
                    alert('Decorator Approved Successfully');
                    refetch();
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='p-6'>
            <h2 className='text-4xl font-bold mb-6'>
                Decorator Pending Approval: {decorators.length}
            </h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className='text-lg'>
                            <th>#</th>
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Specialty</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {decorators.map((d, index) => (
                            <tr key={d._id}>
                                <td>{index + 1}</td>

                                <td>
                                    <img
                                        src={d.photoURL}
                                        className="w-12 h-12 rounded-full object-cover"
                                        alt=""
                                    />
                                </td>

                                <td>{d.displayName}</td>
                                <td>{d.email}</td>
                                <td>{d.specialty}</td>

                                <td className='font-semibold text-orange-600'>
                                    {d.role}
                                </td>

                                <td>
                                    <button
                                        onClick={() => handelApproved(d)}
                                        className='btn btn-sm btn-success mr-2'>
                                        Approve
                                    </button>

                                    <button className='btn btn-sm btn-error'>
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AproveDecorator;
