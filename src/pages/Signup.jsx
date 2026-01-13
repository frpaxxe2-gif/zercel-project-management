import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, Github } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Signup() {
    const navigate = useNavigate();
    const { signup, loading, loginWithGitHub } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!agreedToTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }

        const result = await signup(formData.name, formData.email, formData.password, formData.confirmPassword);
        if (result.success) {
            navigate('/');
        }
    };

    const passwordStrength = () => {
        const password = formData.password;
        if (password.length < 6) return 0;
        if (password.length < 8) return 1;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)) return 3;
        return 2;
    };

    const strength = passwordStrength();
    const strengthColor = strength === 0 ? 'bg-gray-300' : strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-lg mb-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ProjectHub</h1>
                    <p className="text-gray-600 dark:text-zinc-400">Get started with us today</p>
                </div>

                {/* Signup Card */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-zinc-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                            </div>
                        </div>

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
                            <div className="relative mb-2">
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
                            {/* Password Strength */}
                            {formData.password && (
                                <div className="space-y-1">
                                    <div className="h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                        <div className={`h-full ${strengthColor} transition-all`} style={{ width: `${(strength + 1) * 25}%` }} />
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Strength: {strength === 0 ? 'Weak' : strength === 1 ? 'Fair' : strength === 2 ? 'Good' : 'Strong'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <label className="flex items-start gap-2 cursor-pointer mt-4">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer mt-1 flex-shrink-0"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                I agree to the{' '}
                                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    Terms of Service
                                </a>
                                {' '}and{' '}
                                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    Privacy Policy
                                </a>
                            </span>
                        </label>

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={loading || !agreedToTerms}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    {/* GitHub Signup Button */}
                    <button
                        type="button"
                        onClick={loginWithGitHub}
                        className="w-full py-3 mt-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-md transition"
                    >
                        <Github className="w-5 h-5" />
                        Sign up with GitHub
                    </button>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
