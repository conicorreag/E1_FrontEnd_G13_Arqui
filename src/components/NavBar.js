import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);

  const logoutWithRedirect = () =>
    logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
    });

  const roles = user && user['https://g13arquitectura.me//roles'];
  console.log(user);

  return (
    <div className="nav-container">
      <Navbar color="light" light expand="md" container={false}>
        <Container>
          <NavbarBrand className="logo" />
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  to="/"
                  exact
                  activeClassName="router-link-exact-active"
                >
                  Home
                </NavLink>
              </NavItem>

              {isAuthenticated && (
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/billetera"  // Ajusta este enlace a la ruta correcta para la billetera
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Billetera
                  </NavLink>
                </NavItem>
              )}

              {isAuthenticated && roles && roles.includes('admin') && (
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/empresas"  
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Empresas
                  </NavLink>
                </NavItem>
              )}

              {isAuthenticated && roles && roles.includes('admin') && (
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/subasta"  
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Acciones G13
                  </NavLink>
                </NavItem>
              )}

              {isAuthenticated && roles && roles.includes('admin') && (
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/ofertas"  
                    activeClassName="router-link-exact-active"
                  >
                    Ofertas Grupos
                  </NavLink>
                </NavItem>
              )}

              
              {isAuthenticated && roles && roles.includes('user') && (
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/empresas-user"  
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Acciones G13
                  </NavLink>
                </NavItem>
              )}

              {isAuthenticated && (
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/compras"  
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Mis Compras
                  </NavLink>
                </NavItem>
              )}

              {isAuthenticated && (
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/predicciones"  
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Mis Predicciones
                  </NavLink>
                </NavItem>
              )}

              {isAuthenticated && roles && roles.includes('admin') && (
                <NavItem>
                  <NavLink
                    tag={RouterNavLink}
                    to="/mis-subastas"  
                    exact
                    activeClassName="router-link-exact-active"
                  >
                    Mis Subastas
                  </NavLink>
                </NavItem>
              )}

            </Nav>
            <Nav className="d-none d-md-block" navbar>
              {!isAuthenticated && (
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    className="btn-margin"
                    onClick={() => loginWithRedirect()}
                  >
                    Log in
                  </Button>
                </NavItem>
              )}
              {isAuthenticated && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="50"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>{user.name}</DropdownItem>
                    <DropdownItem
                      tag={RouterNavLink}
                      to="/profile"
                      className="dropdown-profile"
                      activeClassName="router-link-exact-active"
                    >
                      <FontAwesomeIcon icon="user" className="mr-3" /> Profile
                    </DropdownItem>
                    <DropdownItem
                      id="qsLogoutBtn"
                      onClick={() => logoutWithRedirect()}
                    >
                      <FontAwesomeIcon icon="power-off" className="mr-3" /> Log
                      out
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
            {!isAuthenticated && (
              <Nav className="d-md-none" navbar>
                <NavItem>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    block
                    onClick={() => loginWithRedirect({})}
                  >
                    Log in
                  </Button>
                </NavItem>
              </Nav>
            )}
            {isAuthenticated && (
              <Nav
                className="d-md-none justify-content-between"
                navbar
                style={{ minHeight: 170 }}
              >
                <NavItem>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                    />
                    <h6 className="d-inline-block">{user.name}</h6>
                  </span>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="user" className="mr-3" />
                  <RouterNavLink
                    to="/profile"
                    activeClassName="router-link-exact-active"
                  >
                    Profile
                  </RouterNavLink>
                </NavItem>
                <NavItem>
                  <FontAwesomeIcon icon="power-off" className="mr-3" />
                  <RouterNavLink
                    to="#"
                    id="qsLogoutBtn"
                    onClick={() => logoutWithRedirect()}
                  >
                    Log out
                  </RouterNavLink>
                </NavItem>
              </Nav>
            )}
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
