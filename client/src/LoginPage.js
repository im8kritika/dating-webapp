import React from 'react';

function LoginPage() {
    console.log('LoginPage is being rendered');
    return (
      <div>
        <h1>Login Page</h1>
        <a href="http://localhost:3000/auth/google">Sign Up with Google</a>
      </div>
    );
  }

export default LoginPage;