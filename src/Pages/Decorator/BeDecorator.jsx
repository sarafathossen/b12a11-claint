import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import axios from 'axios';

const BeDecorator = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { register, handleSubmit, reset } = useForm();

    const handleDecoratorApplication = async (data) => {
        try {
            console.log("Form Data:", data);

            // Check if photo is uploaded
            if (!data.photo || data.photo.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Photo Required',
                    text: 'Please upload your profile photo',
                });
                return;
            }

            // Prepare FormData for image upload
            const profileImg = data.photo[0];
            const formData = new FormData();
            formData.append("image", profileImg);

            const imageApiUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`;
            const imageRes = await axios.post(imageApiUrl, formData);
            const photoURL = imageRes.data.data.url;

            console.log("Uploaded Image URL:", photoURL);

            // Prepare decorator object
            const decorator = {
                displayName: data.fullName || user.displayName,
                email: data.email || user.email,
                photoURL: photoURL,
                phone: data.phone,
                dob: data.dob,
                address: data.address,
                nidOrBirth: data.nidOrBirth,
                specialty: data.skillCategory,
            };

            // Post to backend
            const res = await axiosSecure.post('/decorator', decorator);

            if (res.data.insertedId) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your application has been submitted. We will reach you soon!",
                    showConfirmButton: false,
                    timer: 2500
                });

                // Reset form
                reset();
            }
        } catch (error) {
            console.error("Application Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Something went wrong. Please try again.'
            });
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-4xl text-primary font-bold">Be a Decorator</h2>

            <form onSubmit={handleSubmit(handleDecoratorApplication)} className='mt-8 text-black'>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>

                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-semibold mb-4">Personal Information</h4>

                        {/* Full Name */}
                        <label className="label">Full Name</label>
                        <input
                            type="text"
                            {...register('fullName')}
                            Value={user.displayName}
                            className="input w-full"
                            placeholder="Full Name"
                            readOnly
                        />



                        {/* Email */}
                        <label className="label mt-4">Email Address</label>
                        <input
                            type="email"
                            {...register('email')}
                            Value={user.email}
                            className="input w-full bg-gray-100"
                            placeholder="Email Address (auto-filled)"
                            readOnly
                            
                        />
                        {/* Photo */}
                        <label className="label mt-4">Profile Photo</label>
                        <input
                            type="file"
                            {...register('photo', { required: true })}
                            className="file-input w-full"
                            accept="image/*"
                        />

                        {/* Phone */}
                        <label className="label mt-4">Phone Number</label>
                        <input
                            type="text"
                            {...register('phone')}
                            className="input w-full"
                            placeholder="Phone Number"
                        />

                        {/* DOB */}
                        <label className="label mt-4">Date of Birth</label>
                        <input
                            type="date"
                            {...register('dob')}
                            className="input w-full"
                        />

                        {/* Address */}
                        <label className="label mt-4">Current Address</label>
                        <input
                            type="text"
                            {...register('address')}
                            className="input w-full"
                            placeholder="Present Address"
                        />

                        {/* NID / Birth Certificate */}
                        <label className="label mt-4">NID / Birth Certificate Number (optional)</label>
                        <input
                            type="text"
                            {...register('nidOrBirth')}
                            className="input w-full"
                            placeholder="NID or Birth Certificate Number"
                        />

                        {/* Skill Category */}
                        <label className="label mt-4">Skill Category</label>
                        <select
                            {...register('skillCategory')}
                            className="select w-full"
                        >
                            <option value="">Select one</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Mehendi">Mehendi</option>
                            <option value="Corporate Event">Corporate Event</option>
                            <option value="Engagement">Engagement</option>
                            <option value="Baby Shower">Baby Shower</option>
                        </select>

                    </fieldset>

                </div>

                <input
                    type="submit"
                    className='btn btn-primary mt-6 w-full text-black'
                    value="Apply as a Decorator"
                />
            </form>
        </div>
    );
};

export default BeDecorator;
