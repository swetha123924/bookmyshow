import { useLocation } from "react-router-dom";
import { useState } from "react";
import HomeHeader from "./header";
import AppFooter from "./footer";
import { useNavigate } from "react-router-dom";
export default function PaymentPage() {
  const { state } = useLocation();
  const {
    movie,
    theater,
    showtime,
    selectedDate,
    seats,
    totalPrice,
    show_id,
  } = state || {};
  const navigate  = useNavigate()

  const ConvenienceFees = 66.08;
  const amountPayable = totalPrice  + ConvenienceFees;
const user = JSON.parse(localStorage.getItem("user"));


  const BASE_URL = "https://bookmyshow-1-jhez.onrender.com"
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handlePayment = async () => {
    if (!user) return alert("You must be logged in");
    if (!seats?.length) return alert("Please select at least one seat");


    const bookingData = {
      user_id: user.id,
      show_id,
      theater_id: theater.id,
      seats: seats,
      total_price: totalPrice,
    };

    console.log("Sending booking data:", bookingData);

    try {
      const res = await fetch("https://bookmyshow-1-jhez.onrender.com/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      console.log(data);
      

      if (res.ok) {
        alert("Booking successful!");
        navigate("/success", {
          state: {
            booking: data.booking,
            movie,
            theater,
            showtime,
            selectedDate,
            seats: seats,
          },
        });
      } else {
        alert("Booking failed: " + data.message);
      }
    } catch (err) {
      console.error("Booking Error:", err);
      alert("Server error, try again later.");
    } 
  };




  return (
    <>
    <HomeHeader />
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col lg:flex-row gap-6">
      {/* Left Side - Contact and Payment */}
      <div className="w-full lg:w-2/3 bg-white p-6 rounded shadow">
        {/* Contact Details */}
        <div className="mb-6 border border-pink-500 rounded">
          <div className="bg-pink-500 text-white p-3 font-semibold">
            Share your Contact Details
          </div>
          <div className="p-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-2 mb-4 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="+91"
              className="w-full p-2 mb-4 border rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button className="w-full bg-pink-500 text-white py-2 rounded font-semibold">
              CONTINUE
            </button>
          </div>
        </div>

        {/* Payment Options */}
        <div className="border border-pink-500 rounded">
          <div className="bg-pink-500 text-white p-3 font-semibold">
            Payment options
          </div>
          <div className="p-4 space-y-2">
            <p className="font-semibold mb-2">Pay by any UPI App</p>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="upi" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Google_Pay_Logo.svg" alt="GPay" className="h-6" />
                Google Pay
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="upi" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Amazon_Pay_Logo.svg" alt="Amazon Pay" className="h-6" />
                Amazon Pay
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="upi" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/9b/BHIM_logo.svg" alt="BHIM" className="h-6" />
                BHIM
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="upi" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/PhonePe_Logo.png" alt="PhonePe" className="h-6" />
                PhonePe
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="upi" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Paytm_logo.png" alt="Paytm" className="h-6" />
                Paytm
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="upi" />
                <span className="text-sm">Other UPI</span>
              </label>
            </div>

            <div className="mt-4">
              <p className="font-semibold">Or Scan QR code</p>
              <div className="mt-2 border-dashed border-2 border-gray-400 h-32 flex items-center justify-center text-gray-400">
                Scan QR Code (Mock)
              </div>
            </div>
          </div>
        </div>
      </div>
            <div className="w-full lg:w-1/3 bg-white p-6 rounded shadow">
        <h2 className="font-bold text-lg border-b pb-2 mb-4">ORDER SUMMARY</h2>

        <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold">
            {movie?.title} ({movie?.language || "UA13+"})
            </div>
            <div className="text-mb font-bold bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
            {seats.length} Tickets
            </div>
        </div>

        <div className="text-mb text-gray-700 mb-2">
            <p>{movie?.format || "2D"}</p>
            <p>{theater?.name}</p>
            <p className="text-mb">M-Ticket</p>
            <p className="text-mb font-semibold">PREMIUM - {seats.join(", ")}</p>
            <p className="text-mb">{selectedDate} | {showtime}</p>
        </div>

        <div className="mt-4 text-mb space-y-2 font-medium">
            <p className="flex justify-between">
            <span className="font-bold">Sub Total</span>
            <span>₹{totalPrice}</span>
            </p>
        
            <p className="flex justify-between">
            <span>Convenience fees</span>
            <span>₹{ConvenienceFees.toFixed(2)}</span>
            </p>
        </div>

        {/* Donation Section */}
        <div className="mt-4 bg-gray-100 p-3 rounded text-mb font-medium">
            <div className="flex justify-between">
            <span>Donate to BookAChange</span>
            <span>₹0</span>
            </div>
            <p className="text-mb text-blue-500 cursor-pointer mt-1 font-normal">Add ₹2</p>
        </div>

        {/* Final Amount */}
        <div className="mt-4 border-t pt-3 text-lg font-bold flex justify-between">
            <span>Amount Payable</span>
            <span className="text-green-600">₹{amountPayable.toFixed(2)}</span>
        </div>
        <button className="w-full bg-pink-700 font-bold text-green-800 p-2" onClick={handlePayment}>PAY ₹{amountPayable.toFixed(2)}</button>
        </div>

    </div>
    <AppFooter />
    </>
  );
}
