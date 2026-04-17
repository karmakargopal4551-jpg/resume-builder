import { Mail, User2Icon, Lock } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { login } from '../app/features/authSlice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const query = new URLSearchParams(window.location.search)
  const urlstate = query.get("state")
  const [state, setState] = React.useState(urlstate || "login")

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  })

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/app");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("FORM SUBMITTED");

      const payload =
        state === "login"
          ? {
              email: formData.email,
              password: formData.password,
            }
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            };

      console.log("PAYLOAD:", payload);

      const res = await axios.post(
        `http://localhost:4000/api/users/${state}`,
        payload
      );

      console.log("RESPONSE:", res.data);

      // ✅ SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // ✅ UPDATE REDUX
      dispatch(login({ token: res.data.token, user: res.data.user }));

      toast.success(res.data.message);

      // ✅ REDIRECT TO DASHBOARD
      navigate("/app");

    } catch (err) {
      console.log("ERROR FULL:", err);
      console.log("ERROR DATA:", err.response?.data);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className='flex items-center justify-center h-screen w-full bg-gray-100'>
      <form onSubmit={handleSubmit} className="sm:w-88 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">

        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Please {state} to continue
        </p>

        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
            <User2Icon size={16} color='#6B7280' />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
          <Mail size={16} />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
          <Lock size={16} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        {/* ✅ TOGGLE LOGIN / REGISTER */}
        <p
          onClick={() => setState(prev => prev === "login" ? "register" : "login")}
          className="text-gray-500 text-sm mt-4 mb-6 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span className="text-green-500 hover:underline">
            click here
          </span>
        </p>

      </form>
    </div>
  )
}

export default Login;