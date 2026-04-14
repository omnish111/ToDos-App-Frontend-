import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { validateRegisterForm } from "../utils/validators";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await register(formData);
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        "Registration failed. Try again.";
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
          <h2>Create your account</h2>
          <p>Start managing your daily tasks in one clean dashboard.</p>
        </div>

        <Alert type="error" message={apiError} />

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.name}
          />
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
                placeholder="At least 6 characters"
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
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="redirect-line">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
