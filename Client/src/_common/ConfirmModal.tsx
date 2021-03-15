import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmModal({
  show,
  setShow,
  onConfirm,
  onCancel
}: {
  show: boolean;
  setShow: Function;
  onConfirm: Function;
  onCancel: Function;
}) {
  const handleClose = () => {
    setShow(false);
    onCancel();
  };

  const handleConfirm = () => {
    setShow(false);
    onConfirm();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this. This cannot be undone!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmModal;
