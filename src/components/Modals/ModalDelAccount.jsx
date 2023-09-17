import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

import Lottie from "lottie-react";
import accountDelAnimation from "../../assets/navbar/accountDel_animation.json";

import "./modalDelAccount.css";

const ModalDelAccount = ({ show, onHide, handleDeleteUserAccount }) => {
  const handleDeleteAccount = () => {
    handleDeleteUserAccount();
    onHide();
  };
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="lg" centered>
        <Modal.Header closeButton style={{ border: "none" }} className="modalHeaderWrapper">
          <Modal.Title className="text-danger">Account Deletion</Modal.Title>
        </Modal.Header>

        <Modal.Body className="d-flex modalBodyWrapper">
          <Row>
            <Col xs={12} md={8} className="modalInfoWrapper">
              <div className="modalInfoMain">
                <h5>Do you want to delete your account?</h5>
                <p>
                  This action is irreversible and will{" "}
                  <span style={{ textDecoration: "underline" }}>
                    permanently remove all your data
                  </span>
                  . <br /> If you proceed, you'll be logged out immediately, and you'll need to
                  create a new account to use <strong>DataDash</strong> services again.
                </p>
              </div>

              <em className="modalInfoFooter">
                Please note that once your account is deleted, all your personal information,
                settings, and any associated data will be lost and cannot be recovered.
              </em>
            </Col>
            <Col xs={12} md={4} className="delAnimationWrapper">
              <Lottie animationData={accountDelAnimation} className="delAnimation" />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="modalFooterWrapper">
          <Button className="confirmDelBtn" onClick={handleDeleteAccount}>
            Yes, delete my Account
          </Button>

          <Button className="closeModalBtn" onClick={onHide}>
            I Changed My Mind
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDelAccount;
