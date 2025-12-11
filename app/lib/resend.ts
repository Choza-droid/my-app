import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is not set in environment variables');
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

console.log('✅ Resend initialized with API key:', process.env.RESEND_API_KEY.substring(0, 8) + '...');
export const resend = new Resend(process.env.RESEND_API_KEY);

// Interfaz para los datos de la orden
interface OrderItem {
  product_name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

// Función para generar el HTML del email
function generateOrderConfirmationHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.product_name}<br>
        <small style="color: #666;">Color: ${item.color} | Talla: ${item.size}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${item.price.toFixed(2)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Pedido</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 0; text-align: center; background-color: #f4f4f4;">
              <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 30px; background-color: #4CAF50; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px;">¡Gracias por tu compra!</h1>
                  </td>
                </tr>
                
                <!-- Contenido -->
                <tr>
                  <td style="padding: 30px;">
                    <p style="margin: 0 0 20px; color: #333; font-size: 16px;">
                      Hola <strong>${data.customerName}</strong>,
                    </p>
                    <p style="margin: 0 0 20px; color: #666; font-size: 14px;">
                      Hemos recibido tu pedido y lo estamos procesando. A continuación encontrarás los detalles de tu compra:
                    </p>
                    
                    <!-- Número de Orden -->
                    <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                      <p style="margin: 0; color: #666; font-size: 12px;">Número de Pedido</p>
                      <p style="margin: 5px 0 0; color: #333; font-size: 18px; font-weight: bold;">${data.orderNumber}</p>
                    </div>
                    
                    <!-- Items -->
                    <h2 style="margin: 30px 0 15px; color: #333; font-size: 18px;">Productos</h2>
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <thead>
                        <tr style="background-color: #f8f8f8;">
                          <th style="padding: 10px; text-align: left; font-size: 12px; color: #666;">Producto</th>
                          <th style="padding: 10px; text-align: center; font-size: 12px; color: #666;">Cantidad</th>
                          <th style="padding: 10px; text-align: right; font-size: 12px; color: #666;">Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHTML}
                      </tbody>
                    </table>
                    
                    <!-- Totales -->
                    <table role="presentation" style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px; text-align: right; color: #666;">Subtotal:</td>
                        <td style="padding: 8px; text-align: right; color: #333; font-weight: bold; width: 100px;">$${data.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; text-align: right; color: #666;">Envío:</td>
                        <td style="padding: 8px; text-align: right; color: #333; font-weight: bold;">$${data.shippingCost.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; text-align: right; color: #666;">Impuestos:</td>
                        <td style="padding: 8px; text-align: right; color: #333; font-weight: bold;">$${data.tax.toFixed(2)}</td>
                      </tr>
                      <tr style="border-top: 2px solid #4CAF50;">
                        <td style="padding: 12px 8px; text-align: right; color: #333; font-size: 18px; font-weight: bold;">Total:</td>
                        <td style="padding: 12px 8px; text-align: right; color: #4CAF50; font-size: 18px; font-weight: bold;">$${data.total.toFixed(2)}</td>
                      </tr>
                    </table>
                    
                    <!-- Dirección de Envío -->
                    <h2 style="margin: 30px 0 15px; color: #333; font-size: 18px;">Dirección de Envío</h2>
                    <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px;">
                      <p style="margin: 0; color: #333; line-height: 1.6;">
                        ${data.shippingAddress.address}<br>
                        ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
                      </p>
                    </div>
                    
                    <!-- Información adicional -->
                    <div style="margin-top: 30px; padding: 20px; background-color: #f0f9ff; border-left: 4px solid #4CAF50; border-radius: 5px;">
                      <p style="margin: 0; color: #666; font-size: 14px;">
                        Recibirás una notificación cuando tu pedido sea enviado. Si tienes alguna pregunta, no dudes en contactarnos.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f8f8f8; text-align: center;">
                    <p style="margin: 0; color: #999; font-size: 12px;">
                      Este es un correo automático, por favor no respondas a este mensaje.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// Función principal para enviar el email de confirmación
export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`📧 Attempting to send email to: ${data.customerEmail}`);
    console.log(`📧 Order number: ${data.orderNumber}`);
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'Güero Gucci <onboarding@resend.dev>', // Cambiar por tu dominio verificado
      to: [data.customerEmail],
      subject: `Confirmación de Pedido ${data.orderNumber}`,
      html: generateOrderConfirmationHTML(data),
      replyTo: 'onboarding@resend.dev', // Cambiar por tu email de soporte
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Email sent successfully to ${data.customerEmail}. ID: ${emailData?.id}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Exception sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}
