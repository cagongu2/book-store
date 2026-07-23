import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";

import App from "./App";
import { store } from "./store/store";
import "./index.css";
import "./App.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#FFCE1A",
            },
          }}
        >
          <App />
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
