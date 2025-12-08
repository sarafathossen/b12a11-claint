import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const MyBooking = () => {
    const [selectedBooking, setSelectedBooking] = React.useState(null);
    const [newDate, setNewDate] = React.useState("");

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: bookings = [], refetch } = useQuery({
        queryKey: ['my-booking', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/booking?email=${user.email}`);
            return res.data;
        }
    });

    const handelDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/booking/${id}`)
                    .then(res => {
                        if (res.data.deletedCount) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your booking has been deleted.",
                                icon: "success"
                            });
                        }
                    });
            }
        });
    };

    const handelPayment = async (service) => {
        const paymentInfo = {
            cost: parseInt(service.price.replace(/[^0-9]/g, "")),
            parcelId: service._id,
            
            userEmail: service.userEmail,
            parcelName: service.serviceName,
        };

        try {
            const res = await axiosSecure.post('/payment-checkout-session', paymentInfo);
            window.location.assign(res.data.url);
        } catch (err) {
            console.error("Payment Error:", err);
            alert("Payment could not be processed. Check console.");
        }
        console.log(service)
    };
   

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">
                My Booked Services: {bookings.length}
            </h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Service Name</th>
                            <th>Price</th>
                            <th>Payment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.map((service, index) => (
                            <tr key={service._id}>
                                <th>{index + 1}</th>
                                <td>{service.serviceName}</td>
                                <td>{service.price}</td>
                                <td>
                                    {service.paymentStatus === 'paid'
                                        ? <span className="text-green-500 font-medium">Paid</span>
                                        : <button
                                            onClick={() => handelPayment(service)}
                                            className="btn btn-sm btn-primary text-black"
                                        >
                                            Pay
                                        </button>
                                    }
                                </td>
                                <td className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedBooking(service);
                                            setNewDate(service.bookedDate || service.bookingDate); // আগের ডেটা newDate-এ সেট
                                            document.getElementById('my_modal_5').showModal();
                                        }}
                                        className="btn btn-xs btn-outline"
                                    >
                                        Update
                                    </button>

                                    <button
                                        onClick={() => handelDelete(service._id)}
                                        className="btn btn-xs btn-error text-white"
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-2">Booking Details (You can change only Booked Date) </h3>

                    {selectedBooking && (
                        <div className="space-y-2 text-sm">

                            <p><strong>Service:</strong> {selectedBooking.serviceName}</p>
                            <p><strong>Price:</strong> {selectedBooking.price}</p>
                            <p><strong>Category:</strong> {selectedBooking.category}</p>
                            <p><strong>Duration:</strong> {selectedBooking.duration}</p>
                            <p>
                                <strong>Booking Date:</strong>{" "}
                                {selectedBooking.bookingDate
                                    ? selectedBooking.bookingDate.split("-").reverse().join("-")
                                    : ""}
                            </p>
                            <p><strong>Payment Status:</strong> {selectedBooking.paymentStatus}</p>
                            <p><strong>Tracking ID:</strong> {selectedBooking.trackingId}</p>
                            <p><strong>User Email:</strong> {selectedBooking.userEmail}</p>

                            {/* Editable "Booked For" */}
                            {/* <label className="block">
                                <strong>Booking For:</strong>
                                <input
                                    type="date"
                                    className="input input-bordered w-full mt-1"
                                    value={newDate} // সরাসরি newDate ব্যবহার
                                    onChange={(e) => setNewDate(e.target.value)} // newDate আপডেট হচ্ছে
                                    min={new Date().toISOString().split("T")[0]} // আজকের তারিখ থেকে ফিউচার
                                />
                            </label> */}


                            <input
                                type="date"
                                className="input input-bordered w-full mt-1"
                                value={
                                    selectedBooking.bookedDate
                                        ? selectedBooking.bookedDate.split("-").reverse().join("-") // "DD-MM-YYYY" → "YYYY-MM-DD"
                                        : ""
                                }
                               onChange={(e) => setNewDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]} // আজকের তারিখ থেকে ফিউচার
                            />


                        </div>
                    )}

                    <div className="modal-action">
                        <button
                            className="btn btn-success"
                            onClick={async () => {
                                try {
                                    const res = await axiosSecure.patch(
                                        `/booking/${selectedBooking._id}`,
                                        {
                                            bookedDate: newDate
                                                ? newDate.split("-").reverse().join("-")
                                                : selectedBooking.bookedDate,
                                        }
                                    );

                                    if (res.data.modifiedCount > 0) {
                                        Swal.fire({
                                            title: "Updated!",
                                            text: "Booking date updated successfully.",
                                            icon: "success",
                                        });
                                        refetch();
                                        document.getElementById("my_modal_5").close();
                                    }
                                } catch (error) {
                                    console.error(error);
                                }
                            }}
                        >
                            Update
                        </button>

                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>



        </div>
    );
};

export default MyBooking;
