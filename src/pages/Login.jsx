import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Login() {
    const navigate = useNavigate();
    const { login, loading, loginWithGitHub } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData.email, formData.password);
        if (result.success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-lg mb-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ProjectHub</h1>
                    <p className="text-gray-600 dark:text-zinc-400">Manage your projects like a pro</p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-zinc-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Welcome Back</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    {/* GitHub Login Button */}
                    <button
                        type="button"
                        onClick={loginWithGitHub}
                        className="w-full py-3 mt-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-md transition"
                    >
                        <Github className="w-5 h-5" />
                        Continue with GitHub
                    </button>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition">
                                Sign up now
                            </Link>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">Demo Credentials:</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Email: demo@example.com</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Password: password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
