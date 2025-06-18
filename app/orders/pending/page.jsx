"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMqttClient } from "@/hooks/useMqttClient";
import {
  editOrderStatus,
  getPendingOrders,
} from "@/app/actions/order";
import { addNotification } from "@/app/actions/notification";

import {
  getOrderCheckoutTopic,
  getCustomerCancelOrderTopic,
  getAcceptCustomerOrderTopic,
  getKitchenOrderTopic,
} from "@/utils/mqttTopic";

export default function PendingOrdersPage() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [orders, setOrders] = useState([]);
  const [topics, setTopics] = useState([]);

  const { messages, publishMessage } = useMqttClient({
    subscribeTopics: topics ?? [],
  });

  useEffect(() => {
    const newTopics = [
      getOrderCheckoutTopic(),
      getCustomerCancelOrderTopic("#"),
    ];
    setTopics(newTopics);

    const getOrders = async () => {
      try {
        let data = await getPendingOrders();
        if (!data) {
          const response = await fetch(`/api/orders/pending`);
          if (!response.ok) {
            alert("獲取待處理訂單失敗");
            return;
          }
          data = await response.json();
        }
        setOrders(data);
      } catch (err) {
        alert("獲取待處理訂單失敗");
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    const isCheckoutOrder = lastMessage.topic.includes("checkout");
    const isCancelOrder = lastMessage.topic.includes("cancel");

    if (isCheckoutOrder) {
      try {
        const newOrder = JSON.parse(lastMessage.payload);
        setOrders((prev) => {
          const exists = prev.some((order) => {
            console.log("比對中：order.id =", order.id, " vs newOrder.id =", newOrder.id);
            return order.id === newOrder.id;
          });
          return exists ? prev : [newOrder, ...prev];
        });
      } catch (err) {
        console.error("無法解析 MQTT 訊息:", err);
      }
    }

    if (isCancelOrder) {
      try {
        const payload = JSON.parse(lastMessage.payload);
        const orderId = payload.orderId;
        setOrders((prev) =>
          prev.filter((order) => order.id !== orderId)
        );
      } catch (err) {
        console.error("無法解析取消訂單的 MQTT 訊息:", err);
      }
    }
  }, [messages]);

  const handleAcceptOrder = async (orderId) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        alert("找不到訂單");
        return;
      }

      // 取訂單裡的顧客ID，確保有拿到
      const customerId = order.customer?.id || order.customerId;
      if (!customerId) {
        alert("找不到顧客 ID");
        return;
      }

      // 呼叫 PATCH API，路徑用訂單的 customerId，不是 session user id
      const response = await fetch(`/api/orders/${customerId}/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PREPARING" }),
      });

      if (!response.ok) {
        alert("修改訂單狀態失敗");
        return;
      }
      const data = await response.json();

      // UI 移除已接受訂單
      setOrders((prev) => prev.filter((order) => order.id !== orderId));

      // 發送通知與 MQTT 同你的邏輯不變
      await addNotification(
        {
          orderId,
          message: `訂單 ${orderId.slice(0, 8)} 正在製作中`,
        },
        customerId
      );

      const notifyTopic = getAcceptCustomerOrderTopic(customerId);
      const notifyPayload = JSON.stringify({
        type: "ORDER_ACCEPTED",
        orderId,
        status: "PREPARING",
        message: `您的訂單正在製作中`,
        timestamp: Date.now(),
      });
      publishMessage(notifyTopic, notifyPayload);

      const kitchenTopic = getKitchenOrderTopic();
      const kitchenPayload = JSON.stringify({
        orderId,
        customerId,
        items: (order.items ?? []).map((item) => ({
          name: item.menuItem?.name || "",
          quantity: item.quantity,
          specialRequest: item.specialRequest,
        })),
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      });
      publishMessage(kitchenTopic, kitchenPayload);

    } catch (error) {
      console.error("接受訂單失敗:", error);
      alert("接受訂單時發生錯誤");
    }
  };

  if (status === "loading") {
    return <p>載入中...</p>;
  }

  if (!user) {
    return <p>請先登入才能查看訂單。</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-red-100 px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center sm:text-left text-gray-800">
          待處理訂單
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center sm:text-left">
            目前沒有待處理訂單。
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <div
                key={`${order.id}-${idx}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      訂單 #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div></div>
                </div>

                <div className="mb-3 space-y-1">
                  <p className="text-gray-700">
                    <strong>總金額：</strong> ${order.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-gray-700">
                    <strong>顧客：</strong> {order.customer?.name || "未知"}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-2 text-gray-700">
                    餐點內容：
                  </h4>
                  <ul className="space-y-2">
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <li
                          key={`${item.id}-${idx}`}
                          className="flex justify-between text-sm text-gray-600"
                        >
                          <span>
                            {item.menuItem?.name} × {item.quantity}
                            {item.specialRequest && (
                              <span className="block text-xs text-gray-400">
                                備註：{item.specialRequest}
                              </span>
                            )}
                          </span>
                          <span>
                            $
                            {(
                              (item.menuItem?.price ?? 0) * item.quantity
                            ).toFixed(2)}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 text-sm">無餐點內容</li>
                    )}
                  </ul>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      接受訂單
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
