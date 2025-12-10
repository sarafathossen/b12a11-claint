
import { useNavigate } from 'react-router';
import { AuthContext } from '../../Contexts/AuthContext/AuthContext';

const ServiceCard = ({ service }) => {
    // const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClick = () => {
        const serviceId = service._id;
        navigate(`/service/service-details/${serviceId}`);
    };


    return (
        <div className='border bg-zinc-300 p-4 rounded-lg'>
            <img className='h-[300px] w-full' src='https://i.pinimg.com/736x/2c/31/01/2c31015d1d3df874992d5f90c4d9c1ab.jpg' alt={service.name} />
            <h2 className='text-xl font-bold'>{service.name}</h2>
            <div className="flex justify-between px-2">
                <p className='font-bold'>{service.price} Per Square </p>
                <p className='font-bold text-green-600'>{service.category}</p>
            </div>
            <button
                onClick={handleClick}
                className='px-6 w-full  my-4 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition duration-300'
            >
                Details
            </button>
        </div>
    );
};

export default ServiceCard;
