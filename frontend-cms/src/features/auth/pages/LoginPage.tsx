import React from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, Flex, message } from 'antd';
import { UserOutlined, LockOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser } from '../../../store/slices/auth.action';
import { ApiError } from '../../../core/api/api-error';
import type { LoginPayload } from '../types/login.type';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm<LoginPayload>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.auth.loading);

  const handleSubmit = async (values: LoginPayload) => {
    try {
      await dispatch(loginUser(values));
      message.success('Đăng nhập hệ thống thành công!');
      navigate('/', { replace: true });
    } catch (error: unknown) {
      const apiError = ApiError.from(error);
      message.error(apiError.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic Background Glowing Circles */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)',
          top: '-100px',
          left: '-100px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0,0,0,0) 70%)',
          bottom: '-150px',
          right: '-150px',
          pointerEvents: 'none',
        }}
      />

      <Card
        style={{
          width: '100%',
          maxWidth: '440px',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        styles={{ body: { padding: '40px 32px' } }}
      >
        <Flex vertical align="center" style={{ marginBottom: '32px' }}>
          <Flex
            justify="center"
            align="center"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)',
              marginBottom: '16px',
            }}
          >
            <BookOutlined style={{ fontSize: '32px', color: '#ffffff' }} />
          </Flex>

          <Title level={3} style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>
            BookStore CMS
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Hệ thống Quản trị Nhà sách & Kho hàng
          </Text>
        </Flex>

        <Form
          form={form}
          name="loginForm"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
              { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Tên đăng nhập / Email"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Mật khẩu"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#475569' }}>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <a
                href="#forgot"
                style={{ color: '#4f46e5', fontSize: '14px' }}
                onClick={(e) => {
                  e.preventDefault();
                  message.info('Vui lòng liên hệ Quản trị viên hệ thống để khôi phục mật khẩu!');
                }}
              >
                Quên mật khẩu?
              </a>
            </Flex>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: '48px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                borderColor: '#4f46e5',
                fontSize: '16px',
                fontWeight: 600,
                boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)',
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default LoginPage;
