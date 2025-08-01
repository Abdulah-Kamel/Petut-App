import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { signInWithGoogle, auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import SignUpForm from "../components/auth/SignUpForm.jsx";
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    role: "customer",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.gender) {
      errors.gender = "Gender is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^(\+20|0)1[0125]\d{8}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = "You must agree to the terms and conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Update the profile in Firebase Auth (for displayName)
      await updateProfile(user, {
        displayName: formData.fullName,
      });

      // 3. Create a user document in Firestore to store additional data
      // We use the user's UID from Auth as the document ID in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        gender: formData.gender,
        phone: formData.phone,
        role: formData.role,
        createdAt: serverTimestamp(), // <-- Add this line
        // You can add a timestamp or other fields here
      });

      console.log(formData.role);
      if (formData.role === "doctor") {
        // Redirect to completion form
        navigate(`/complete-profile?uid=${user.uid}&role=${formData.role}`);
        console.log("doctor")
      } else {
        navigate("/");
        console.log("customer")
      }

      console.log(formData);
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email address is already in use. Please try another.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError(
            "The password is too weak. Please use at least 6 characters."
          );
          break;
        default:
          setError("Failed to create an account. Please try again later.");
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const loadingHandler = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Check if user already has profile in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Redirect to role selection form
        navigate(`/role-selection?uid=${user.uid}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to sign up with Google. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#313340] p-6 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary_app">PET.CARE</h1>
          <h2 className="mt-6 text-2xl font-bold dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary_app hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
        <SignUpForm
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          formData={formData}
          formErrors={formErrors}
          loading={loading}
          error={error}
        />
        {formData.role === "customer" && (
          <div className="flex items-center justify-center mt-6 text-primary_app dark:text-white hover:underline">
            <button
              onClick={() => {
                setFormData({ ...formData, role: "doctor" });
                loadingHandler();
              }}
            >
              Sign up as a doctor.
            </button>
          </div>
        )}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 dark:text-gray-300 dark:bg-[#313340]">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-[#313340] text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.07v2.84C3.96 20.93 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.07C1.42 8.55 1 10.22 1 12s.42 3.45 1.07 4.93l3.77-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.07 2.07 7.07l3.77 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
