import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    const location = useLocation();
    const navigate = useNavigate();

    const handleRegistration = async (data) => {
        try {
            // Step 1: Register User
            const result = await registerUser(data.email, data.password);
            console.log("User created:", result.user);

            // Step 2: Upload Image to imgbb
            const profileImg = data.photo[0];
            const formData = new FormData();
            formData.append("image", profileImg);

            const imageApiUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`;
            const imageRes = await axios.post(imageApiUrl, formData);
            const photoURL = imageRes.data.data.url;

            console.log("Uploaded Image URL:", photoURL);

            // Step 3: Save user info to DB
            const userInfo = {
                displayName: data.name,
                email: data.email,
                photoURL: photoURL,
            };

            const saveUser = await axiosSecure.post("/users", userInfo);

            if (saveUser.data.insertedId) {
                console.log("User info saved to database");
            }

            // Step 4: Update Firebase User Profile
            const profileUpdate = {
                displayName: data.name,
                photoURL: photoURL,
            };

            await updateUserProfile(profileUpdate);
            console.log("User profile updated");

            // Step 5: Success Alert + Redirect
            alert("Registration Successful! Welcome to DecorSheba 🎉");
            navigate(location.state || "/");

        } catch (error) {
            console.log("Registration Error:", error);
            alert("Registration Failed! Please try again.");
        }
    };

    return (
        <div className='card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl'>
            <h3 className='text-3xl font-bold text-center'>Welcome to DecorSheba</h3>
            <p className='text-center'>Please Register</p>

            <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
                <fieldset className="fieldset">

                    {/* Name */}
                    <label className="label">Name</label>
                    <input type="text" {...register('name', { required: true })} className="input" placeholder="Name" />
                    {errors.name && <p className='text-red-500'>Name is required</p>}

                    {/* Photo */}
                    <label className="label">Photo</label>
                    <input type="file" {...register('photo', { required: true })} className="file-input" />
                    {errors.photo && <p className='text-red-500'>Photo is required</p>}

                    {/* Email */}
                    <label className="label">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                    {errors.email && <p className='text-red-500'>Email is required</p>}

                    {/* Password */}
                    <label className="label">Password</label>
                    <input
                        type="password"
                        {...register('password', {
                            required: true,
                            minLength: 6,
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                        })}
                        className="input"
                        placeholder="Password"
                    />

                    {errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>}
                    {errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be at least 6 characters</p>}
                    {errors.password?.type === 'pattern' && (
                        <p className='text-red-500'>
                            Password must contain uppercase, lowercase, number & special character
                        </p>
                    )}

                    <button className="btn btn-neutral mt-4">Register</button>

                </fieldset>

                <p className='text-center mt-2'>
                    Already have an account?  
                    <Link className='text-blue-400 underline' state={location.state} to={'/login'}>
                        Login
                    </Link>
                </p>
            </form>

            <SocialLogin />
        </div>
    );
};

export default Register;
