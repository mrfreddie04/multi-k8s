import React from 'react';
import { Link } from 'react-router-dom';

function OtherPage() {
  return (
    <div>
      <h2>I am the other page...</h2>  
      <Link to="/">Go Back Home</Link>
    </div>
  );
}

export default OtherPage;