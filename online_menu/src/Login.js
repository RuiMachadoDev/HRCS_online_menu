import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          max-width: 400px;
          margin: 100px auto;
          padding: 20px;
          background-color: #fff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          text-align: center;
        }

        h2 {
          margin-bottom: 20px;
          color: #333;
        }

        .error {
          color: red;
          font-size: 14px;
          margin-bottom: 10px;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        input {
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }

        button {
          padding: 10px 15px;
          border: none;
          background-color: #d2691e;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
          font-size: 16px;
        }

        button:hover {
          background-color: #b05519;
        }
      `}</style>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
