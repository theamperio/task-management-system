import React, { useContext, useState } from "react";
import { Loader, LoaderCircle, User, Key } from "lucide-react";
import { AuthContext } from "../../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { userData } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show loading toast
    const loadingToast = toast.loading("Authenticating...", {
      style: {
        background: '#333',
        color: '#fff'
      }
    });
    
    setLoading(true);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check admin credentials
      if (userData.admin && email === userData.admin.email && password === userData.admin.password) {
        // Store user data in localStorage
        localStorage.setItem("role", "admin");
        localStorage.setItem("currentUser", JSON.stringify(userData.admin));
        
        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToast);
        toast.success(`Welcome back, Admin!`, {
          icon: '👋',
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff'
          }
        });
        
        // Short delay to show the welcome toast before redirecting
        setTimeout(() => {
          navigate("/admin");
        }, 500);
        
        return;
      }

      // Check employee credentials
      const matchedEmployee = userData.employee?.find(
        emp => emp.email === email && emp.password === password
      );

      if (matchedEmployee) {
        // Store user data in localStorage
        localStorage.setItem("role", "employee");
        localStorage.setItem("currentUser", JSON.stringify(matchedEmployee));
        
        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToast);
        toast.success(`Welcome back, ${matchedEmployee.name}!`, {
          icon: '👋',
          position: 'top-right',
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff'
          }
        });
        
        // Short delay to show the welcome toast before redirecting
        setTimeout(() => {
          navigate("/employee");
        }, 500);
      } else {
        // Dismiss loading toast and show error toast
        toast.dismiss(loadingToast);
        toast.error("Invalid email or password", {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#333',
            color: '#fff'
          }
        });
      }

      if (handleLogin) {
        await handleLogin(email, password);
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Dismiss loading toast and show error toast
      toast.dismiss(loadingToast);
      toast.error("Login failed. Please try again.", {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Demo login handler
  const handleDemoLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@gmail.com');
      setPassword('admin123');
      toast('Admin credentials filled', {
        icon: '🔑',
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff'
        }
      });
    } else {
      setEmail('akash@gmail.com');
      setPassword('akash123');
      toast('Employee credentials filled', {
        icon: '🔑',
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff'
        }
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4">
      {/* Add Toaster component */}
      <Toaster />
      
      <div className="w-full max-w-md bg-gray-800 border-2 border-gray-700 p-6 md:p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl md:text-3xl text-amber-50 font-semibold text-left mb-8">
          Login
        </h1>

        <form
          className="flex flex-col space-y-4 justify-center align-center"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
              />
            </div>

            <div className="relative">
              <Key size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                required
              />
            </div>
          </div>

          <div className="flex align-center justify-center">
            <button
              className="flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg py-2 px-6 gap-2 my-2 font-medium transition-colors w-full cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={16} />
                  <span>Processing...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
          
          {/* Demo login buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md cursor-pointer transition-colors flex-1"
            >
              Demo Admin Login
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('employee')}
              className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md cursor-pointer transition-colors flex-1"
            >
              Demo Employee Login
            </button>
          </div>
        </form>

        <div className="mt-6 text-sm text-gray-400 flex items-center space-x-1">
          <Loader className="animate-spin" size={12} />
          <span>Made By</span>
          <span className="text-sky-400 font-medium">ALOK</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
