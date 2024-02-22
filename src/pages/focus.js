import React from 'react';
import './../pages-style/focus.css';

function focus() {
  function setHeading()
  {
    // set IP address entered in input field as heading
    let inputIPAddress = document.getElementById("ipaddress").value;
    document.getElementById("headerToEdit").textContent = inputIPAddress;
  }
  return (
    <div>
      <h1 id="headerToEdit">Focus</h1>
      <p>This page will be the landing page for the focus display, and should explain the point of the focus display</p>
      <label htmlFor="ipaddress">IP Address: </label>
      <input type="text" id="ipaddress" name="ipaddress"/>
      <button onClick={setHeading}>OK</button>
    </div>
  );
}

export default focus;
