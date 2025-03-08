import React, { useContext, useState } from "react";
import { Loader, LoaderCircle } from "lucide-react";
import { AuthContext } from "../../Context/AuthProvider";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { userData } = useContext(AuthContext);
  console.log(userData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate 2 seconds loading time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get current userData from context
      if (userData.admin && email === userData.admin.email && password === userData.admin.password) {
        localStorage.setItem("role", "admin");
        localStorage.setItem("currentUser", JSON.stringify(userData.admin));
        window.location.href = "/admin";
        return;
      }

      // Check employee credentials
      const matchedEmployee = userData.employee?.find(
        emp => emp.email === email && emp.password === password
      );

      if (matchedEmployee) {
        localStorage.setItem("role", "employee");
        localStorage.setItem("currentUser", JSON.stringify(matchedEmployee));
        window.location.href = "/employee";
      } else {
        alert("Invalid email or password");
      }

      if (handleLogin) {
        await handleLogin(email, password);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 border-2 border-gray-700 p-6 md:p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl md:text-3xl text-amber-50 font-semibold text-left mb-8">
          Login
        </h1>

        <form
          className="flex flex-col space-y-4 justify-center align-center"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <input
              className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              required
            />

            <input
              className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              required
            />
          </div>

          <div className="flex align-center justify-center">
            <button
              className="flex justify-center items-center text-white border-2 border-gray-700 rounded-xl py-1 w-30 my-2 hover:bg-gray-700 hover:text-black hover:cursor-pointer hover:font-semibold"
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
        </form>

        <div className="mt-6 text-sm text-gray-400 flex items-center space-x-1 hover:underline">
          <Loader className="animate-spin" size={12} />
          <span>Made By</span>
          <span className="text-sky-400 font-medium ">ALOK</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
