// src/components/LoginForm.jsx
const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
        username &nbsp;
          <input
            data-testid="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
        password &nbsp;
          <input
            data-testid="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm