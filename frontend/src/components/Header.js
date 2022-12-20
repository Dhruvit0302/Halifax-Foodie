import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';

import Tab from '@mui/material/Tab';


function Header(props) {
  return (
    <React.Fragment>
      <AppBar component="div" position="static" elevation={0} sx={{ zIndex: 0 }}>
        <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={11}>
            <Link to="/Login" style={{ textDecoration: 'none', color: 'white' }}><Tab label="Login" /></Link>
            <Link to="/Register" style={{ textDecoration: 'none', color: 'white' }}><Tab label="Register" /></Link>
          </Grid>
        </Grid>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;