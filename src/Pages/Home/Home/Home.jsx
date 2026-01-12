import React, { useEffect, useState } from 'react';
import Banner from '../Banner/Banner';
import BookingIcon from '../../../assets/bookingIcon.png';
import Brands from '../Brands/Brands';
import Reviews from '../Reviews/Reviews';
import Covarage from '../../Covarage/Covarage';
import { Link, useLoaderData } from 'react-router';
import ServiceCard from '../../Service/ServiceCard';
import axios from 'axios';
import useAuth from '../../../Hooks/useAuth';
import { motion } from 'framer-motion';
import Loading from '../../Loading/Loading';

const reviewsPrommise = fetch('/reviews.json').then(res => res.json());

const Home = () => {
    const { user } = useAuth();
    const [decorators, setDecorators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDecorators = async () => {
            try {
                const response = await axios.get(
                    'https://home-decor-server-lovat.vercel.app/decorator'
                );
                setDecorators(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load decorators');
                setLoading(false);
            }
        };
        fetchDecorators();
    }, []);

    if (loading) return <Loading />;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const data = useLoaderData();

    const WorkData = [
        {
            title: "Luxury Home Interior Decoration",
            short_description:
                "Modern and elegant home interior decoration service designed to enhance beauty and comfort."
        },
        {
            title: "Wedding Stage Decoration",
            short_description:
                "Premium wedding stage decoration with lighting, floral setup, and stylish backdrops."
        },
        {
            title: "Birthday & Party Decoration",
            short_description:
                "Creative birthday and party decoration services to make your special moments memorable."
        },
        {
            title: "Corporate & Office Decoration",
            short_description:
                "Professional office and corporate event decoration tailored for a classy and formal look."
        }
    ];

    return (
        <div className="overflow-x-hidden">
            {/* Banner */}
            <Banner />

            {/* Book Button */}
            <div className="flex justify-center px-4 my-8">
                <Link to="/services">
                    <motion.button
                        className="btn text-lg sm:text-xl md:text-2xl lg:text-3xl px-6"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Book Decoration Service
                    </motion.button>
                </Link>
            </div>

            {/* How It Works */}
            <div className="py-10 px-4">
                <h2 className="text-xl sm:text-2xl font-bold text-secondary text-center mb-8">
                    How We Works
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {WorkData.map((item, index) => (
                        <div
                            key={index}
                            className="p-5 bg-gray-200 rounded-2xl text-center"
                        >
                            <img
                                src={BookingIcon}
                                alt=""
                                className="w-16 mx-auto mb-4"
                            />
                            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-700">
                                {item.short_description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Services */}
            <div className="bg-[#03373D] py-12 px-4 rounded-2xl my-10">
                <div className="text-white text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                        Our Services
                    </h2>
                    <p className="text-sm sm:text-base max-w-3xl mx-auto">
                        Professional decoration services for home, wedding, party and corporate events.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {data.slice(0, 6).map(service => (
                        <ServiceCard key={service._id} service={service} />
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div className="my-10 px-4">
                <Brands />
            </div>

            {/* Decorators */}
            <div className="bg-[#03373D] py-14 px-4 rounded-2xl my-10">
                <div className="text-white text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
                        Our Decorators
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-200">
                        Meet our skilled decorators for every type of event.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {decorators
                        .filter(d => d.role === "decorator")
                        .map(decorator => (
                            <div
                                key={decorator._id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition"
                            >
                                <img
                                    src={
                                        decorator.photoURL ||
                                        "https://i.pinimg.com/736x/2c/31/01/2c31015d1d3df874992d5f90c4d9c1ab.jpg"
                                    }
                                    alt={decorator.displayName}
                                    className="w-full h-40 sm:h-44 md:h-48 object-cover"
                                />

                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 text-[#03373D]">
                                        {decorator.displayName}
                                    </h3>
                                    <p className="text-sm">
                                        <span className="font-semibold">Specialty:</span>{" "}
                                        {decorator.specialty || "N/A"}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold">Status:</span>{" "}
                                        {decorator.deceretorWorkingStatus || "available"}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold">Rating:</span>{" "}
                                        {decorator.rating || 0} ⭐
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Reviews */}
            <Reviews reviewsPrommise={reviewsPrommise} />

            {/* Coverage */}
            <div className="my-10 px-4">
                <div className="border rounded-2xl p-2 sm:p-4">
                    <Covarage />
                </div>
            </div>
        </div>
    );
};

export default Home;
