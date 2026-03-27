const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "hello@liimra.com";

export const sendEmail = (subject: string, body: string) => {
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
};

export const sendProductInquiry = (productName: string, size?: string) => {
  const subject = `Inquiry about ${productName}`;
  const body = size
    ? `Hi,\n\nI'm interested in ${productName} (${size}). Can you provide more details?\n\nThank you!`
    : `Hi,\n\nI'm interested in ${productName}. Can you provide more details?\n\nThank you!`;
  sendEmail(subject, body);
};

export const sendOrderInquiry = (cartItems: Array<{ name: string; size: string; quantity: number }>, total: number) => {
  const subject = "Order Inquiry";
  const itemsList = cartItems
    .map((item) => `- ${item.name} (${item.size}) x ${item.quantity}`)
    .join("\n");
  const body = `Hi,\n\nI'd like to place an order:\n\n${itemsList}\n\nTotal: ₹${total}\n\nPlease let me know the next steps.\n\nThank you!`;
  sendEmail(subject, body);
};
