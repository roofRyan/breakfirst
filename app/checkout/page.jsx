"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMqttClient } from "@/hooks/useMqttClient";
import { getMenuItems } from "@/app/actions/menu";
import { addOrder } from "@/app/actions/order";
import { getOrderCheckoutTopic } from "@/utils/mqttTopic";

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const [cart, setCart] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [specialRequests, setSpecialRequests] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [topic, setTopic] = useState("");

    const { publishMessage } = useMqttClient({});

    // ⚠️ 等 session 準備好後才繼續
    useEffect(() => {
        if (status !== "authenticated") return;

        setTopic(getOrderCheckoutTopic());

        const savedCart = sessionStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        } else {
            window.location.href = "/";
        }

        const getMenu = async () => {
            try {
                let data = await getMenuItems();
                if (!data) {
                    const response = await fetch("/api/menu");
                    data = await response.json();
                }
                setMenuItems(data);
            } catch (err) {
                alert("取得菜單失敗");
            }
        };
        getMenu();
    }, [status]);

    const getTotalPrice = () => {
        return cart.reduce((total, cartItem) => {
            const menuItem = menuItems.find((item) => item.id === cartItem.id);
            return total + (menuItem?.price || 0) * cartItem.quantity;
        }, 0);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (!session?.user?.id) {
            alert("請先登入");
            return;
        }

        setIsSubmitting(true);
        try {
            const orderItems = cart.map((item) => ({
                menuItemId: item.id,
                quantity: item.quantity,
                specialRequest: specialRequests[item.id] || "",
            }));

            const customerId = session.user.id;

            let orderData = await addOrder({ orderItems, customerId });
            if (!orderData) {
                const response = await fetch(`/api/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderItems, customerId }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("❌ 訂單建立失敗:", errorData);
                    alert("送出訂單失敗: " + (errorData.message || errorData.error));
                    return;
                }
                orderData = await response.json();
            }

            // TODO: 發布 MQTT 訊息 publishMessage(topic, payload)

            sessionStorage.removeItem("cart");
            window.location.href = "/orders";
        } catch (err) {
            alert("送出訂單失敗");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading") {
        return <div className="text-center mt-10">正在載入使用者資訊...</div>;
    }

    if (status !== "authenticated") {
        return <div className="text-center mt-10 text-red-600">請先登入以進行訂單</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">確認訂單</h1>

            {cart.length === 0 ? (
                <div className="text-center text-gray-500 text-lg mt-20">
                    購物車目前是空的，請先選擇餐點。
                </div>
            ) : (
                <form
                    onSubmit={handleSubmitOrder}
                    className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6"
                >
                    <h2 className="text-xl font-semibold text-gray-700">訂單明細</h2>

                    <ul className="divide-y">
                        {cart.map((cartItem) => {
                            const menuItem = menuItems.find((item) => item.id === cartItem.id);
                            if (!menuItem) return null;

                            return (
                                <li key={cartItem.id} className="py-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800 font-medium">
                                            {menuItem.name} × {cartItem.quantity}
                                        </span>
                                        <span className="text-right font-semibold text-gray-700">
                                            ${ (menuItem.price * cartItem.quantity).toFixed(2) }
                                        </span>
                                    </div>
                                    <div>
                                        <label htmlFor={`special-request-${cartItem.id}`} className="block text-sm text-gray-500 mb-1">
                                            備註（可選）
                                        </label>
                                        <textarea
                                            id={`special-request-${cartItem.id}`}
                                            className="w-full border rounded-md p-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-300 resize-none"
                                            rows={2}
                                            placeholder="例如：去冰、少糖..."
                                            value={specialRequests[cartItem.id] || ""}
                                            onChange={(e) =>
                                                setSpecialRequests((prev) => ({
                                                    ...prev,
                                                    [cartItem.id]: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="border-t pt-4 text-lg font-bold flex justify-between">
                        <span>總金額：</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || cart.length === 0}
                        className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-md shadow hover:opacity-90 disabled:bg-gray-400 transition duration-300"
                    >
                        {isSubmitting ? "正在送出訂單..." : "送出訂單"}
                    </button>
                </form>
            )}
        </div>
    );
}
