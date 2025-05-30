import { useDeleteUserMutation, useGetUsersQuery } from "../redux/api/user.api";
import { Button, Skeleton, Table, Popconfirm, notification } from "antd";
import type { TableProps } from "antd";
import { useCallback, useState } from "react";
import ModalWrapper from "../components/model/Modal";
import { IoTrashOutline } from "react-icons/io5";
import { FiEdit3 } from "react-icons/fi";

export interface DataType {
  id: string;
  name: string;
  age: string;
  phone: string;
  profession: string;
  createdAt: string;
}

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState<null | DataType>(null);
  const [api, contextHolder] = notification.useNotification();

  const { data, isLoading } = useGetUsersQuery({});
  const [deleteUser] = useDeleteUserMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setUpdateUser(null);
  }, []);

  const handleUpdateUser = (user: DataType) => {
    setUpdateUser(user);
    showModal();
  };

  const handleDelete = async (id: string) => {
    const timeout = setTimeout(async () => {
      await deleteUser(id).unwrap();
      console.log("deleted");
    }, 5000);

    api.info({
      message: `5 sekunddan keyin o'chadi`,
      description: "are you sure?",
      placement: "bottomRight",
      duration: 5.01,
      onClose: () => {
        clearTimeout(timeout);
      },
    });
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "pone",
    },
    {
      title: "Profession",
      dataIndex: "profession",
      key: "profession",
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      render: (user) => (
        <div className="flex gap-2">
          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this task?"
            onConfirm={() => handleDelete(user.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button>
              <IoTrashOutline />
            </Button>
          </Popconfirm>
          <Button onClick={() => handleUpdateUser(user)}>
            <FiEdit3 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex justify-between items-center my-6">
          <h2>User</h2>
          <Button onClick={showModal}>Add user</Button>
        </div>
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Table<DataType> rowKey={"id"} columns={columns} dataSource={data} />
        )}
      </div>

      {isModalOpen && (
        <ModalWrapper
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          updateUser={updateUser}
        />
      )}

      {contextHolder}
    </div>
  );
};

export default Home;
