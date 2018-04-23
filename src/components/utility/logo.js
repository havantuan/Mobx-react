import React from 'react';
import {Link} from 'react-router-dom';
// import {siteConfig} from '../../config.js';
import logoSite from "../../image/logo.png";

// export default function({ collapsed, styling }) {
export default function ({collapsed}) {
  if (collapsed) {
    return (
        <Link to="/dashboard">
          <img width={60} src={logoSite} alt="SHIP-FAST" style={{margin: '24px 10px'}}/>
        </Link>
    )
  }
  return (
    <div style={{padding:"0 20px"}}>
    <Link to="/dashboard">
      <img src={logoSite} alt="SHIP-FAST" style={{maxWidth: '100%'}}/>
    </Link>
    </div>
  )
}
