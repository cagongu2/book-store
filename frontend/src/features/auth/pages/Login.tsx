import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Form, Input, Button, Alert, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

const Login = () => {
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (values: any) => {
      return await loginUser(values.email, values.password);
    },
    onSuccess: (data) => {
      if (data.success) {
        navigate("/");
      } else {
        setErrorMessage(data.message || "Đăng nhập thất bại");
      }
    },
    onError: (error: any) => {
      setErrorMessage(error.message || "Vui lòng kiểm tra lại email và mật khẩu");
    }
  });

  const onFinish = (values: any) => {
    setErrorMessage("");
    loginMutation.mutate(values);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error: any) {
      setErrorMessage("Không thể đăng nhập bằng Google");
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <Title level={3} className="text-center mb-6">Đăng nhập</Title>

        {errorMessage && (
          <Alert message={errorMessage} type="error" showIcon className="mb-4" />
        )}

        <Form
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
              { max: 255, message: "Email quá dài" }
            ]}
          >
            <Input placeholder="Nhập địa chỉ email" size="large" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loginMutation.isPending}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-2">
          <Text>Chưa có tài khoản? </Text>
          <Link to="/register" className="text-blue-500 hover:text-blue-700 font-medium">
            Đăng ký ngay
          </Link>
        </div>

        <div className="mt-4">
          <Button
            onClick={handleGoogleSignIn}
            block
            size="large"
            icon={<FaGoogle className="text-red-500" />}
            className="flex items-center justify-center bg-gray-50 hover:bg-gray-100"
          >
            Đăng nhập bằng Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
