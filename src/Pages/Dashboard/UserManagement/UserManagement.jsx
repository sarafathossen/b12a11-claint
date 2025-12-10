import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const UserManagement = () => {
    const axiousSecure = useAxiosSecure()
    const { refetch, data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiousSecure.get('/users')
            return res.data
        }
    })
    const handelMakeAdmin = user => {
        const roleInfo = { role: 'admin' }
        axiousSecure.patch(`/users/${user._id}/role`, roleInfo)
            .then(res => {
                console.log(res.data);
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user.displayName} is an Admin Now!`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })

    }
    const handelRemoveAdmin = user => {
        const roleInfo = { role: 'user' }
        axiousSecure.patch(`/users/${user._id}/role`, roleInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user.displayName} is a User Now!`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })

    }

    return (
        <div>
            <h2 className='text-5xl'> Manage Users {users.length} </h2>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>
                                #
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Admin Action</th>
                            <th>Other Action</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => <tr>
                                <th>
                                    {index + 1}
                                </th>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src={user.photoURL}
                                                    alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{user.displayName}</div>

                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {user.email}
                                </td>
                                <td>
                                    {user.role}
                                </td>
                                <td> {user.role === 'admin' ? <button onClick={() => handelRemoveAdmin(user)} className='btn bg-red-400'>Make User</button> : <button onClick={() => handelMakeAdmin(user)} className='btn bg-green-400'>Make Admin</button>} </td>
                                <th>
                                    <button className="btn btn-ghost btn-xs">Actions</button>
                                </th>
                            </tr>)
                        }



                    </tbody>
                    {/* foot */}

                </table>
            </div>
        </div>
    );
};

export default UserManagement;