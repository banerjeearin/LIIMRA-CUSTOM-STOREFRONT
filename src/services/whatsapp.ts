const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "919321731372";

export const sendWhatsAppMessage = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
};

export const sendProductInquiry = (productName: string, size?: string) => {
  const message = size
    ? `Hi! I'm interested in ${productName} (${size}). Can you tell me more?`
    : `Hi! I'm interested in ${productName}. Can you tell me more?`;
  sendWhatsAppMessage(message);
};

export const sendCartInquiry = (cartItems: Array<{ name: string; size: string; quantity: number }>) => {
  const itemsList = cartItems
    .map((item) => `- ${item.name} (${item.size}) x ${item.quantity}`)
    .join("\n");
  const message = `Hi! I'd like to order:\n\n${itemsList}\n\nCan you help me complete this order?`;
  sendWhatsAppMessage(message);
};
