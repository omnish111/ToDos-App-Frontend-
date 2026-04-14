import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { validateLoginForm } from "../utils/validators";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await login(formData);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        "Login failed. Try again.";
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-head">
          <h2>Welcome back</h2>
          <p>Login to continue managing your priorities.</p>
        </div>

        <Alert type="error" message={apiError} />

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
          />
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="password-input-wrap">
              <input
                id="password"
                className={`form-input ${errors.password ? "is-invalid" : ""}`}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password ? <p className="field-error">{errors.password}</p> : null}
          </div>
          <Button type="submit" disabled={isSubmitting} className="full-btn">
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="redirect-line">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
