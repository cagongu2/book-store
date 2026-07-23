import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Space, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetBooks, useBooksMutation } from '../../hooks/useBook';
import { Book } from '../../types/book.types';

const { Title } = Typography;

const ManageBooks = () => {
    const navigate = useNavigate();
    const { data: res, isLoading } = useGetBooks();
    const { removeMutation } = useBooksMutation();

    const books = useMemo(() => {
        if (res?.success && res.data?.books) {
            return res.data.books;
        }
        return [];
    }, [res]);

    const handleDeleteBook = (id: string) => {
        removeMutation.mutate(id);
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Tên Sách',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: Book) => (
                <Link to={`/dashboard/edit-book/${record.id || (record as any)._id}`} className="text-blue-600 hover:underline">
                    {text}
                </Link>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Giá',
            dataIndex: 'newPrice',
            key: 'newPrice',
            render: (price: number) => `$${price}`
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 150,
            render: (_: any, record: Book) => {
                const bookId = record.id || (record as any)._id;
                return (
                    <Space size="middle">
                        <Button 
                            type="primary" 
                            icon={<EditOutlined />} 
                            onClick={() => navigate(`/dashboard/edit-book/${bookId}`)}
                            size="small"
                        />
                        <Popconfirm
                            title="Xóa sách"
                            description="Bạn có chắc chắn muốn xóa cuốn sách này?"
                            onConfirm={() => handleDeleteBook(bookId)}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true, loading: removeMutation.isPending }}
                        >
                            <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                        </Popconfirm>
                    </Space>
                )
            },
        },
    ];

    return (
        <section className="py-6 px-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <Title level={3} className="!mb-0 text-gray-800">Quản lý sách</Title>
                    <Link to="/dashboard/add-new-book">
                        <Button type="primary">Thêm sách mới</Button>
                    </Link>
                </div>

                <Table 
                    columns={columns} 
                    dataSource={books} 
                    rowKey={(record) => record.id || (record as any)._id}
                    loading={isLoading}
                    pagination={{ pageSize: 10 }}
                    bordered
                />
            </div>
        </section>
    );
};

export default ManageBooks;
