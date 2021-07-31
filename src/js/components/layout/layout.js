import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Container } from 'react-bootstrap';
import Header from './header';
import Footer from './footer';

const Layout = ({
  className,
  withFooter,
  children,
  flex,
  ...rest
}) => (
  <>
    <Header />
    <Container className={`main-content ${flex ? 'd-flex' : ''} ${className}`} {...rest}>
      {children}
    </Container>
    {withFooter && <Footer />}
  </>
);

Layout.propTypes = {
  flex: PropTypes.bool,
  className: PropTypes.string,
  withFooter: PropTypes.bool,
};

Layout.defaultProps = {
  flex: false,
  withFooter: true,
  className: '',
};

export default Layout;
