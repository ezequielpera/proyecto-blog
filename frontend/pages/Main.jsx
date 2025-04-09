import React from "react";
import Nav from "../components/Navbar";
import Container from "react-bootstrap/Container";
import BodyBlog from "../components/BodyBlog";
import AddPub from "../components/AddPub";

const Main = () => {
  return (
    <>
      <Nav />
      <Container fluid>
        <AddPub/>
        <BodyBlog/>
      </Container>
    </>
  );
};

export default Main;
