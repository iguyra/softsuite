import React, { useState } from "react";
import { Button, Modal } from "antd";
import { ToastContainer, toast } from "react-toastify";

import makeApiCall from "../../utils/makeApiCall";

const api = new makeApiCall();

const DeleteModal = ({ isModalOpen, setIsModalOpen, item, mutate }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
    onClickDelete();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onClickDelete = async () => {
    try {
      console.log("DELELEE");
      // await api.delete(`element/${element._id}`);
      const data = await api.delete("element/", {
        data: { _id: item._id },
        headers: { "Content-Type": "application/json" },
      });
      toast(`🚀 ${data.message}`);
      mutate();
    } catch (err) {
      console.log(err, "DELETETIN__ERROR");
    }
  };

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal
        title={item.name}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this item.</p>
      </Modal>
    </>
  );
};

export default DeleteModal;
