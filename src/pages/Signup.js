import React, { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [form, setForm] = useState({
    college_name: '',
    full_name: '',
    email: '',
    password: '',
    year: '',
    branch: '',
    section: '',
    degree_type: '',
    other_degree: '',
    login_id: '' // Added login_id to state
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios.post('http://localhost/server/signup.php', form);
    alert(res.data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input name="full_name" placeholder="Full Name" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="college_name" placeholder="College Name" onChange={handleChange} />
      <input name="year" placeholder="Year" onChange={handleChange} />
      <input name="branch" placeholder="Branch" onChange={handleChange} />
      <input name="section" placeholder="Section" onChange={handleChange} />
      <input name="degree_type" placeholder="Degree Type" onChange={handleChange} />
      <input name="other_degree" placeholder="Other Degree (if any)" onChange={handleChange} />
      <input name="login_id" placeholder="Login ID" onChange={handleChange} /> {/* Added input */}
      <button type="submit">Register</button>
    </form>
  );
}