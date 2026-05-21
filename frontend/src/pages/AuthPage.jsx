import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const inputStyle = {
    width: "100%",
    padding: "15px 18px",
    border: "1px solid #d1d5db",
    borderRadius: 12,
    fontSize: 15,
    outline: "none",
    marginTop: 8,
    background: "#fff",
  };

  const buttonStyle = {
    width: "100%",
    padding: "15px",
    background: "#c8a97e",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 10,
    transition: "0.3s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "42% 58%",
        background: "#fff",
      }}
    >
      {/* LEFT SIDE */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px",
          background: "#fff",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
          }}
        >
          {/* LOGO */}
          <div
            style={{
              marginBottom: 70,
            }}
          >
            {/* REPLACE WITH YOUR REAL LOGO LATER */}
            <div
              style={{
                width: 95,
                height: 95,
                borderRadius: 16,
                border: "2px dashed #d1d5db",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                fontSize: 13,
                background: "#fafafa",
              }}
            >
              LOGO
            </div>

            {/*
              LATER REPLACE ABOVE WITH:

              <img
                src="/logo.png"
                alt="logo"
                style={{
                  width: 95,
                  height: 95,
                  objectFit: "contain",
                }}
              />
            */}
          </div>

          {/* TITLE */}
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              marginBottom: 14,
              color: "#111",
              lineHeight: 1.1,
            }}
          >
            {isLogin ? "Welcome back!" : "Create account"}
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: 16,
              marginBottom: 45,
              lineHeight: 1.7,
            }}
          >
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create your account to continue"}
          </p>

          {/* FORM */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* FULL NAME */}
            {!isLogin && (
              <div>
                <label
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111",
                  }}
                >
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  style={inputStyle}
                />
              </div>
            )}

            {/* USERNAME */}
            <div>
              <label
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#111",
                }}
              >
                Username
              </label>

              <input
                type="text"
                placeholder="Enter here"
                style={inputStyle}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111",
                  }}
                >
                  Password
                </label>

                {isLogin && (
                  <span
                    style={{
                      fontSize: 13,
                      color: "#2563eb",
                      cursor: "pointer",
                    }}
                  >
                    Forgot password
                  </span>
                )}
              </div>

              <input
                type="password"
                placeholder="Enter here"
                style={inputStyle}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            {!isLogin && (
              <div>
                <label
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111",
                  }}
                >
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm password"
                  style={inputStyle}
                />
              </div>
            )}

            {/* BUTTON */}
            <button
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.opacity = 0.9;
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = 1;
              }}
            >
              {isLogin ? "Login" : "Create Account"}
            </button>
          </div>

          {/* SWITCH */}
          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              fontSize: 15,
              color: "#6b7280",
            }}
          >
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <span
              onClick={() => setIsLogin(!isLogin)}
              style={{
                color: "#2563eb",
                marginLeft: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "100vh",
        }}
      >
        {/* IMAGE */}
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2200&auto=format&fit=crop"
          alt="hotel"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* OVERLAY */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.12))",
          }}
        />

        {/* TEXT */}
        <div
          style={{
            position: "absolute",
            bottom: 70,
            left: 70,
            color: "#fff",
            maxWidth: 560,
          }}
        >
          <p
            style={{
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#d4af37",
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            Luxury Hotel
          </p>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 76,
              lineHeight: 1.05,
              marginBottom: 22,
            }}
          >
            Enjoy Your Dream Vacation
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.82)",
              fontSize: 17,
              lineHeight: 1.9,
            }}
          >
            Experience luxury, comfort and unforgettable moments
            at T1 Hotel with world-class service and elegant spaces.
          </p>
        </div>
      </div>
    </div>
  );
}