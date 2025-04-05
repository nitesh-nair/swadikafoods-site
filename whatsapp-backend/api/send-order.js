const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { customerName, phoneNumber, deliveryAddress, items, total } = req.body;

  if (!customerName || !phoneNumber || !deliveryAddress || !items || items.length === 0) {
    return res.status(400).json({ success: false, error: "Invalid order data" });
  }

  const apiKey = process.env.WHATSAPP_API_KEY;
  const businessNumber = process.env.WHATSAPP_BUSINESS_NUMBER;

  // Order message to send to YOU (Admin)
  const orderMessage = `*🛒 New Order Received*\n\n👤 *Customer:* ${customerName}\n📞 *Phone:* ${phoneNumber}\n🏠 *Address:* ${deliveryAddress}\n\n📦 *Order Details:*\n${items.map(i => `• ${i.quantity}x ${i.name} - ₹${i.price * i.quantity}`).join("\n")}\n\n💰 *Total: ₹${total}*`;

  // Confirmation message to send to the CUSTOMER
  const confirmationMessage = `✅ *Order Confirmed!*\n\n🛍️ *Thank you, ${customerName}, for your order!*\n📦 *Order Details:*\n${items.map(i => `• ${i.quantity}x ${i.name} - ₹${i.price * i.quantity}`).join("\n")}\n\n💰 *Total: ₹${total}*\n🚚 *Your order is being processed and will be delivered soon!*`;

  try {
    // Send Order to Admin (Your WhatsApp Business Number)
    await fetch(`https://api.whatsapp.com/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: businessNumber,
        type: "text",
        text: { body: orderMessage }
      })
    });

    // Send Confirmation to Customer
    await fetch(`https://api.whatsapp.com/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: phoneNumber,
        type: "text",
        text: { body: confirmationMessage }
      })
    });

    res.json({ success: true });
  } catch (error) {
    console.error("WhatsApp API Error:", error);
    res.status(500).json({ success: false, error: "Failed to send order confirmation" });
  }
};
