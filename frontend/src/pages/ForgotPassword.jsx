import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app, call the forgot password API endpoint
      // await api.post('/forgot-password', { email });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSent(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030616] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-[#0f1432] rounded-lg p-8 border border-[#1a1f47]">
          <Link
            to="/login"
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 w-fit"
          >
            <ArrowLeft size={20} />
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-[#8ebae2]/10 rounded-full mb-4">
              <Mail className="text-[#8ebae2]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
            <p className="text-gray-400">
              {sent
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive reset instructions'}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1f47] border border-[#2a2f57] rounded-lg px-4 py-3 text-white focus:border-[#8ebae2] outline-none"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8ebae2] text-[#030616] py-3 rounded-lg font-semibold hover:bg-[#a5c9eb] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
                <p className="font-medium">Email sent successfully!</p>
                <p className="text-sm mt-1">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
              </div>

              <p className="text-gray-400 text-sm">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-[#8ebae2] hover:underline"
                >
                  try again
                </button>
              </p>

              <Link
                to="/login"
                className="block w-full bg-[#1a1f47] text-white py-3 rounded-lg font-semibold hover:bg-[#2a2f57] transition text-center"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-[#8ebae2] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
