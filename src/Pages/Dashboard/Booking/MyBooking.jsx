import React, { useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const MyBooking = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [squareFeet, setSquareFeet] = useState("");

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // === Fetch User Bookings ===
    const { data: bookings = [], refetch } = useQuery({
        queryKey: ['my-booking', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/booking?email=${user.email}`);
            return res.data;
        },
    });

    // === Delete Function ===
    const handelDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/booking/${id}`).then((res) => {
                    if (res.data.deletedCount) {
                        refetch();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your booking has been deleted.",
                            icon: "success",
                        });
                    }
                });
            }
        });
    };

    // === Payment ===
    const handelPayment = async (service) => {

        // Safely extract and normalize final cost
        const rawCost = service?.finalCost;

        // Convert cost safely from string/number → number
        const cost = Number(
            typeof rawCost === "string"
                ? rawCost.replace(/[^\d]/g, "")
                : rawCost
        ) || 0; // fallback in case of NaN

        // Ensure cost is valid
        if (cost <= 0) {
            alert("Invalid price. Cannot proceed to payment.");
            return;
        }

        const paymentInfo = {
            cost,
            parcelId: service?._id,
            userEmail: service?.userEmail,
            parcelName: service?.serviceName,
        };

        try {
            const { data } = await axiosSecure.post("/payment-checkout-session", paymentInfo);

            if (!data?.url) {
                throw new Error("Checkout URL missing");
            }

            window.location.assign(data.url);
        } catch (err) {
            console.error("Payment Error:", err.response?.data || err.message);
            alert("Payment could not be processed. Please try again.");
        }
    };


    //  const handelPayment = async (parcel) => {
    //     const paymentInfo = {
    //         cost: parcel.cost,
    //         parcelId: parcel._id,
    //         senderEmail: parcel.senderEmail,
    //         parcelName: parcel.parcelName,
    //     }
    //     const res = await axiosSecure.post('/payment-checkout-session', paymentInfo)
    //     console.log(res.data.url)
    //     window.location.assign(res.data.url)

    // }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">
                My Booked Services: {bookings.length}
            </h2>

            {/* === Table === */}
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Service Name</th>
                            <th>Price</th>
                            <th>Payment</th>
                            <th>Tracking ID</th>
                            <th>Work Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.map((service, index) => (
                            <tr key={service._id}>
                                <th>{index + 1}</th>
                                <td>{service.serviceName}</td>
                                <td>{service.finalCost}</td>

                                <td>
                                    {service.paymentStatus === "paid" ? (
                                        <span className="text-green-500 font-medium">Paid</span>
                                    ) : (
                                        <button
                                            onClick={() => handelPayment(service)}
                                            className="btn btn-sm btn-primary text-black"
                                        >
                                            Pay
                                        </button>
                                    )}
                                </td>
                                <td>{service.trackingId}</td>
                                <td>{service.workingStatus}</td>

                                <td className="flex gap-2">
                                    {/* Update Button */}
                                    <button
                                        onClick={() => {
                                            setSelectedBooking(service);
                                            setNewDate(service.bookedDate);
                                            setSquareFeet(service.squareFeet || "");
                                            document.getElementById("my_modal_5").showModal();
                                        }}
                                        className="btn btn-xs btn-outline"
                                    >
                                        Update
                                    </button>

                                    {/* Delete Button */}
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

            {/* === Modal === */}
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-2">
                        Booking Details (Only Booked Date & SquareFeet Editable)
                    </h3>

                    {selectedBooking && (
                        <div className="space-y-3 text-sm">
                            <p><strong>Service:</strong> {selectedBooking.serviceName}</p>
                            <p><strong>Price:</strong> {selectedBooking.price} Per Square </p>
                            <p><strong>Category:</strong> {selectedBooking.category}</p>
                            <p><strong>Duration:</strong> {selectedBooking.duration}</p>
                            <p><strong>User Email:</strong> {selectedBooking.userEmail}</p>
                            <p><strong>Payment:</strong> {selectedBooking.paymentStatus}</p>

                            {/* Square Feet */}
                            <label>
                                <strong>Square Feet:</strong>
                                <input
                                    type="number"
                                    placeholder="Enter size in sq.ft"
                                    value={squareFeet}
                                    onChange={(e) => setSquareFeet(e.target.value)}
                                    className="input input-bordered w-full mt-1"
                                    min="0"
                                />
                            </label>

                            {/* Booking Date */}
                            <label>
                                <strong>New Booked Date:</strong>
                                <input
                                    type="date"
                                    className="input input-bordered w-full mt-1"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </label>
                        </div>
                    )}

                    {/* ===== Modal Action ===== */}
                    <div className="modal-action">
                        <button
                            className="btn btn-success"
                            onClick={async () => {
                                try {
                                    if (!selectedBooking) {
                                        Swal.fire({ title: "Error", text: "No booking selected.", icon: "error" });
                                        return;
                                    }

                                    // Validate squareFeet
                                    const sfNum = Number(squareFeet);
                                    if (isNaN(sfNum) || sfNum < 0) {
                                        Swal.fire({ title: "Invalid", text: "Square feet must be a positive number.", icon: "warning" });
                                        return;
                                    }

                                    // Date from input is YYYY-MM-DD already (browser date input)
                                    const formattedDate = newDate || selectedBooking.bookedDate;
                                    // quick local check
                                    if (!formattedDate) {
                                        Swal.fire({ title: "Invalid", text: "Please select a date.", icon: "warning" });
                                        return;
                                    }

                                    // Get numeric price from selectedBooking (fallback)
                                    const purePrice = parseInt(
                                        (selectedBooking.price && String(selectedBooking.price).replace(/[^0-9]/g, "")) ||
                                        selectedBooking.finalCost ||
                                        0
                                    );

                                    if (!purePrice) {
                                        Swal.fire({ title: "Error", text: "Cannot determine service price.", icon: "error" });
                                        return;
                                    }

                                    const updatedFinalCost = sfNum * Number(purePrice);

                                    const payload = {
                                        bookedDate: formattedDate,
                                        squareFeet: sfNum,
                                        finalCost: updatedFinalCost,
                                    };

                                    console.log('PATCH payload:', payload);

                                    const res = await axiosSecure.patch(`/booking/${selectedBooking._id}`, payload);

                                    console.log('PATCH response:', res);

                                    if (res.data && res.data.modifiedCount > 0) {
                                        Swal.fire({ title: "Updated!", text: "Booking updated successfully.", icon: "success" });
                                        refetch();
                                        document.getElementById("my_modal_5").close();
                                    } else {
                                        // show server message if any
                                        const msg = res.data?.error || "No changes made.";
                                        Swal.fire({ title: "Notice", text: msg, icon: "info" });
                                    }
                                } catch (err) {
                                    console.error('Update error (frontend):', err);
                                    // If server responded with JSON error, try show it
                                    const serverMessage = err?.response?.data?.error || err.message;
                                    Swal.fire({ title: "Error", text: serverMessage, icon: "error" });
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
