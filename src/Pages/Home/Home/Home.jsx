import React, { useEffect, useState } from 'react';
import Banner from '../Banner/Banner';
import BookingIcon from '../../../assets/bookingIcon.png'
import ServiceImg from '../../../assets/service.png'
import Brands from '../Brands/Brands';
import Reviews from '../Reviews/Reviews';
import Covarage from '../../Covarage/Covarage';
import { useLoaderData } from 'react-router';
import ServiceCard from '../../Service/ServiceCard';
import axios from 'axios';
import useAuth from '../../../Hooks/useAuth';




const reviewsPrommise = fetch('/reviews.json').then(res => res.json())

const Home = () => {
    const {user}=useAuth()
    console.log(user)
    const [decorators, setDecorators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchDecorators = async () => {
            try {
                const response = await axios.get('http://localhost:3000/decorator');
                setDecorators(response.data); // ডেটা state-এ রাখা
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load decorators');
                setLoading(false);
            }
        };

        fetchDecorators();
    }, []);

    if (loading) return <p>Loading decorators...</p>;
    if (error) return <p>{error}</p>;

    const data = useLoaderData()
    console.log(data)
    const WorkData = [
        {
            "img": "https://i.ibb.co/8j4Fz0T/product1.jpg",
            "title": "Premium Wooden Spice Rack",
            "short_description": "A handcrafted wooden rack perfect for organizing your kitchen spices neatly."
        },
        {
            "img": "https://i.ibb.co/2Wc2nM1/product2.jpg",
            "title": "Luxury Bamboo Cutting Board",
            "short_description": "Durable eco-friendly cutting board ideal for all types of kitchen use."
        },
        {
            "img": "https://i.ibb.co/4p3GgxZ/product3.jpg",
            "title": "Rustic Wooden Serving Tray",
            "short_description": "Beautiful handmade serving tray for snacks, tea, and table decoration."
        },
        {
            "img": "https://i.ibb.co/Qk2k5XH/product4.jpg",
            "title": "Elegant Wooden Spoon Set",
            "short_description": "A natural wooden spoon set that adds style and hygiene to your kitchen."
        }
    ]




    return (
        <div>
            <Banner></Banner>


            <div className="py-8">
                <h2 className='text-2xl font-bold text-secondary'>How Its work</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
                    {
                        WorkData.map(data => (
                            <div className=" p-4 bg-gray-200 rounded-2xl">
                                <img src={BookingIcon} alt="" />
                                <p className='text-xl font-bold' key={data.title}>{data.title}</p>
                                <p className='' >{data.short_description}</p>
                            </div>

                        ))
                    }
                </div>

            </div>

            <div className="bg-[#03373D] py-8 rounded-4xl my-8">
                <div className="text-white text-center py-4">
                    <h2 className='text-4xl font-bold'>Our Service</h2>
                    <p>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to <br /> business shipments — we deliver on time, every time.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-10/12 mx-auto">
                    {
                        data.slice(0, 6).map(service => <ServiceCard service={service}></ServiceCard>)
                    }
                </div>
            </div>
            <Brands className='my-8' ></Brands>
            <div className="bg-[#03373D] py-12 px-4 rounded-4xl my-8">
                {/* Header Section */}
                <div className="text-white text-center max-w-3xl mx-auto mb-10">
                    <h2 className="text-5xl font-extrabold mb-4">Our Decorators</h2>
                    <p className="text-lg text-gray-200">
                        Meet our top decorators who specialize in different events.
                        Whether it's a wedding, birthday, or corporate event, we deliver excellence every time.
                    </p>
                </div>

                {/* Decorators Grid */}
                <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {decorators.map(decorator => (
                        <div
                            key={decorator.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
                        >
                            <img
                                src={decorator.image || "https://i.pinimg.com/736x/2c/31/01/2c31015d1d3df874992d5f90c4d9c1ab.jpg"}
                                alt={decorator.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-bold text-xl text-[#03373D] mb-2">{decorator.name}</h3>
                                <p className="text-gray-700 mb-1"><span className="font-semibold">Specialty:</span> {decorator.specialties}</p>
                                <p className="text-gray-700 mb-1"><span className="font-semibold">Rating:</span> {decorator.rating} ⭐</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Reviews reviewsPrommise={reviewsPrommise} ></Reviews>
            {/* <Covarage></Covarage> */}
        </div>
    );
};

export default Home;