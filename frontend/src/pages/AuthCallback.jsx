import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { setAuthToken } from "../auth/token.js";

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Signing you in...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("No authentication token was returned.");
      return;
    }

    setAuthToken(token);
    setStatus("Sign-in complete. Redirecting...");

    const timer = window.setTimeout(() => {
      navigate("/", { replace: true });
    }, 800);

    return () => window.clearTimeout(timer);
  }, [navigate, searchParams]);

  return (
    <section className="page-card auth-card">
      <div className="page-header">
        <div>
          <h1 className="page-title">Authentication</h1>
          <p className="page-subtitle">{status}</p>
        </div>
      </div>

      {!searchParams.get("token") ? (
        <div className="alert alert-error">
          <div>Login failed or token missing.</div>
          <div style={{ marginTop: "0.75rem" }}>
            <Link className="button" to="/">
              Go back to bookings
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default AuthCallback;
