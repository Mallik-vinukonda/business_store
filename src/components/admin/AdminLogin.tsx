import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../store';
import { loginAdmin, clearError } from '../../store/authSlice';
import Button from '../ui/Button';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginError, setLoginError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    }),
    onSubmit: async (values) => {
      try {
        setLoginError(null);
        dispatch(clearError());
        
        const resultAction = await dispatch(loginAdmin({
          email: values.email,
          password: values.password,
        }));
        
        if (loginAdmin.fulfilled.match(resultAction)) {
          // Login successful, navigate to admin dashboard
          navigate('/admin/dashboard');
        } else if (loginAdmin.rejected.match(resultAction) && resultAction.payload) {
          // Login failed with error message
          setLoginError(resultAction.payload as string);
        } else {
          // Login failed without error message
          setLoginError('Login failed. Please try again.');
        }
      } catch (error) {
        setLoginError('An unexpected error occurred. Please try again.');
      }
    },
  });

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
        <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
      </div>

      {loginError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {loginError}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`input ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={`input ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
            {...formik.getFieldProps('password')}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
          )}
        </div>

        <Button 
          type="submit" 
          fullWidth 
          isLoading={formik.isSubmitting}
          disabled={formik.isSubmitting}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate('/')}
          className="text-primary hover:text-primary/80 text-sm"
        >
          Return to Store
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
