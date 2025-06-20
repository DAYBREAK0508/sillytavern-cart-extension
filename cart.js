// cart.js - 每个聊天记录独立购物车插件

const getChatId = () => window.getCurrentChatFilename?.() || "default";
const getCartKey = () => `cart_data_${getChatId()}`;

function getCart() {
    try {
        return window.getChatScopeVariable?.(getCartKey()) || {};
    } catch (error) {
        console.warn('[Cart] getCart failed:', error);
        return {};
    }
}

function setCart(cart) {
    try {
        window.setChatScopeVariable?.(getCartKey(), cart);
        updateCartBadgeFromScope();
        return true;
    } catch (error) {
        console.warn('[Cart] setCart failed:', error);
        return false;
    }
}

function clearCart() {
    if (confirm('确定要清空当前聊天记录的购物车吗？')) {
        setCart({});
        renderCart();
        updateCartBadge(0);
        showToast('购物车已清空');
    }
}

function updateCartBadge(count) {
    const badge = document.getElementById("cart-badge");
    if (badge) badge.innerText = count || 0;
}

function updateCartBadgeFromScope() {
    const cart = getCart();
    let count = 0;
    for (const key in cart) {
        const item = cart[key];
        if (item && item.quantity) count += item.quantity;
    }
    updateCartBadge(count);
}

function renderCart() {
    console.log("[Cart] 当前购物车：", getCart());
}

// ⏱ 自动检测聊天记录切换并更新徽章
let lastChatId = null;
setInterval(() => {
    const currentId = getChatId();
    if (currentId && currentId !== lastChatId) {
        lastChatId = currentId;
        updateCartBadgeFromScope();
        renderCart();
    }
}, 1000);

// 🧪 页面加载后添加一个调试按钮
window.addEventListener("load", () => {
    const btn = document.createElement("button");
    btn.innerText = "🛒 查看购物车";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = 9999;
    btn.onclick = () => alert(JSON.stringify(getCart(), null, 2));
    document.body.appendChild(btn);

    const badge = document.createElement("div");
    badge.id = "cart-badge";
    badge.innerText = "0";
    badge.style.position = "fixed";
    badge.style.bottom = "60px";
    badge.style.right = "28px";
    badge.style.background = "#f66";
    badge.style.color = "#fff";
    badge.style.borderRadius = "50%";
    badge.style.width = "24px";
    badge.style.height = "24px";
    badge.style.textAlign = "center";
    badge.style.lineHeight = "24px";
    badge.style.fontSize = "12px";
    badge.style.zIndex = 9999;
    document.body.appendChild(badge);

    updateCartBadgeFromScope();
});
