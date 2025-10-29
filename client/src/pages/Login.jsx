import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/redux/slices/authSlice";
import {
  FiMail,
  FiLock,
  FiCheckCircle,
  FiUsers,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (result.type === "auth/login/fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Navbar */}
      <div className="relative z-20">
        <Navbar hideUserInfo={true} />
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-purple-500/20 rounded-3xl rotate-12 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-blue-500/20 rounded-full animate-float animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left Side - Inspiring Content */}
          <div className="text-white space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Coordinate your
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  work in one place
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                ProjectHub brings everyone's work together, automates processes,
                and helps teams stay on track—without all the emails and
                meetings.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              <div className="flex items-start space-x-4 group">
                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-all">
                  <FiCheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Task Management
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Organize and prioritize tasks efficiently
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-all">
                  <FiUsers className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Team Collaboration
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Work together seamlessly in real-time
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="p-3 bg-pink-500/20 rounded-xl group-hover:bg-pink-500/30 transition-all">
                  <FiTrendingUp className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Progress Tracking
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Monitor project status at a glance
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-all">
                  <FiZap className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Real-time Updates
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Stay synced with instant notifications
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8 border-t border-gray-700">
              <div>
                <div className="text-3xl font-bold text-purple-400">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">50K+</div>
                <div className="text-sm text-gray-400">Projects Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400">99%</div>
                <div className="text-sm text-gray-400">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end animate-slide-in-right">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 backdrop-blur-xl border border-gray-200">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back
                </h2>
                <p className="text-gray-600">
                  Login to continue to your workspace
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-6 animate-shake">
                  <p className="font-medium text-sm">{error}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
                autoComplete="off"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="off"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Logging in...
                    </div>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-all"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 mb-2 font-semibold">
                    🎯 Try Demo Account:
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-mono bg-white px-2 py-1 rounded text-gray-800 text-xs">
                        mahesh@test.com
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-mono bg-white px-2 py-1 rounded text-gray-800 text-xs">
                        123456
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
