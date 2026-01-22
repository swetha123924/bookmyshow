import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from '../frontEnd/register'
import Login from '../frontEnd/login'
import Home from '../frontEnd/home'
import AdminDashboard from '../frontEnd/adminDashboard'
import MovieDetail from '../frontEnd/movieDetailsPage'
import ShowtimePage from '../frontEnd/showtime'
import SelectSeatsPage from '../frontEnd/seatPage'
import PaymentPage from '../frontEnd/paymentPage'
import SuccessPage from '../frontEnd/successpage'
import Bookings from '../frontEnd/bookings'
function App() {
  return(
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin-panel" element={<AdminDashboard />} />
        <Route path="/movie/:movieId" element={<MovieDetail />} />
        <Route path="/showtimes" element={<ShowtimePage />} />
        <Route path="/select-seats" element={<SelectSeatsPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/bookings" element={<Bookings />} />


        {/* Add more routes as needed */}
      </Routes>
    </Router>
    </>

  )
  
}

export default App
