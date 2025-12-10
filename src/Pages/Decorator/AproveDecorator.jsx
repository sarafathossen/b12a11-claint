import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const AproveDecorator = () => {
    const axiosSecure = useAxiosSecure();

    const { refetch, data: decorators = [] } = useQuery({
        queryKey: ['decorator', 'pending'],
        queryFn: async () => {
            const res = await axiosSecure.get('/decorator?role=pending');
            return res.data;
        }
    });

    const handelApproved = (decorator) => {
        const updateRole = { role: 'decorator', email: decorator.email };

        axiosSecure.patch(`/decorator/${decorator._id}`, updateRole)
            .then(res => {
                if (res.data.modifiedCount) {
                    alert('Decorator Approved Successfully');
                    refetch(); // refresh list
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h2 className='text-5xl font-bold'>
                Decorator Pending Approval: {decorators.length}
            </h2>

            <div className='mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {decorators.map(d => (
                    <div key={d._id} className='p-4 border rounded-xl shadow'>
                        <img
                            src={d.photoURL}
                            alt="decorator"
                            className='w-24 h-24 rounded-full object-cover mx-auto'
                        />

                        <h3 className='text-xl font-semibold text-center mt-3'>
                            {d.displayName}
                        </h3>

                        <p className='text-center'>Email: {d.email}</p>
                        <p className='text-center'>Specialty: {d.specialty}</p>
                        <p className='text-center font-semibold text-orange-600'>
                            Status: {d.role}
                        </p>

                        <div className="mt-3">
                            <button
                                onClick={() => handelApproved(d)}
                                className='btn btn-outline w-full my-2'>
                                Approve
                            </button>

                            <button className='btn btn-outline w-full my-2'>
                                Cancel
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AproveDecorator;
