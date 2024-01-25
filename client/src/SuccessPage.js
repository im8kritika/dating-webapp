import React, { useEffect, useState } from 'react';

const SuccessPage = () => {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setName(params.get('name'));
    setPicture(params.get('picture'));
  }, []);

  return (
    <div>
      <h1>Success!</h1>
      <p>You have successfully logged in with your institute email.</p>
      <p>Welcome, {name}!</p>
      <img src={picture} alt={name} />
    </div>
  );
};

export default SuccessPage;