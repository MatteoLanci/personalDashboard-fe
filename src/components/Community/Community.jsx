import React from "react";

import { useSelector } from "react-redux";

import { Container, Row, Col } from "react-bootstrap";
import { nanoid } from "nanoid";

import { usersState } from "../../state/Reducers/usersSlice";

const Community = () => {
  const users = useSelector(usersState);
  return (
    <>
      <Container>
        <h2>Community</h2>
        <Row>
          <Col>
            <ul key={nanoid()}>
              {users.map((user) => (
                <li key={nanoid()}>
                  <a key={nanoid()} href={`/profile/${user._id}`}>
                    {user.firstName}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Community;
