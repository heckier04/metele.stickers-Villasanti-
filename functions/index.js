const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

const MP_ACCESS_TOKEN = defineSecret("MP_ACCESS_TOKEN");
const MP_WEBHOOK_SECRET = defineSecret("MP_WEBHOOK_SECRET");

// ⚠️ Reemplazá esto por tu dominio real cuando lo tengas (Vercel, Firebase Hosting, etc.)
const SITE_URL = "http://localhost:5173";

/**
 * Llamada desde el cliente (Checkout.jsx) después de crear la orden como
 * "pending_payment". Genera la preferencia de pago y devuelve el link
 * (init_point) al que hay que redirigir al comprador.
 */
exports.createPreference = onCall(
  { secrets: [MP_ACCESS_TOKEN], region: "us-central1" },
  async (request) => {
    const { orderId } = request.data;

    if (!orderId) {
      throw new HttpsError("invalid-argument", "Falta el orderId.");
    }

    const orderRef = db.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      throw new HttpsError("not-found", "La orden no existe.");
    }

    const order = orderSnap.data();

    if (order.status !== "pending_payment") {
      throw new HttpsError(
        "failed-precondition",
        `La orden ya está en estado "${order.status}", no se puede volver a pagar.`
      );
    }

    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN.value() });
    const preference = new Preference(client);

    const items = order.items.map((item) => ({
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS",
    }));

    if (order.costoEnvio > 0) {
      items.push({
        title: "Envío",
        quantity: 1,
        unit_price: order.costoEnvio,
        currency_id: "ARS",
      });
    }

    try {
      const result = await preference.create({
        body: {
          items,
          external_reference: orderId,
          notification_url: `https://us-central1-metele-stickerss.cloudfunctions.net/mercadoPagoWebhook`,
          back_urls: {
            success: `${SITE_URL}/pedido-confirmado`,
            failure: `${SITE_URL}/pedido-fallido`,
            pending: `${SITE_URL}/pedido-pendiente`,
          },
          auto_return: "approved",
          payer: {
            name: order.buyer?.firstName,
            surname: order.buyer?.lastName,
            email: order.buyer?.email,
          },
        },
      });

      return { initPoint: result.init_point, preferenceId: result.id };
    } catch (error) {
      logger.error("Error creando preferencia de MP:", error);
      throw new HttpsError("internal", "No se pudo generar el link de pago.");
    }
  }
);

/**
 * Webhook que Mercado Pago llama automáticamente cuando cambia el estado
 * de un pago. Valida la firma (x-signature) y recién ahí confirma la orden
 * y descuenta stock.
 */
exports.mercadoPagoWebhook = onRequest(
  { secrets: [MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET], region: "us-central1" },
  async (req, res) => {
    try {
      const xSignature = req.headers["x-signature"];
      const xRequestId = req.headers["x-request-id"];
      const dataId = req.query["data.id"] || req.body?.data?.id;

      if (!xSignature || !xRequestId || !dataId) {
        logger.warn("Webhook sin headers/datos necesarios, se ignora.");
        return res.sendStatus(400);
      }

      const parts = xSignature.split(",");
      let ts, hash;
      parts.forEach((part) => {
        const [key, value] = part.split("=");
        if (key?.trim() === "ts") ts = value?.trim();
        if (key?.trim() === "v1") hash = value?.trim();
      });

      const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
      const computedHash = crypto
        .createHmac("sha256", MP_WEBHOOK_SECRET.value())
        .update(manifest)
        .digest("hex");

      if (computedHash !== hash) {
        logger.warn("Firma inválida en webhook de Mercado Pago. Se rechaza.");
        return res.sendStatus(401);
      }

      const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN.value() });
      const paymentClient = new Payment(client);
      const payment = await paymentClient.get({ id: dataId });

      const orderId = payment.external_reference;

      if (!orderId) {
        logger.warn("Pago sin external_reference, no se puede asociar a una orden.");
        return res.sendStatus(200);
      }

      if (payment.status === "approved") {
        await confirmOrderPaymentAdmin(orderId);
      } else if (payment.status === "rejected") {
        await db.collection("orders").doc(orderId).update({
          status: "cancelled",
          cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
          mpStatus: payment.status,
        });
      }

      return res.sendStatus(200);
    } catch (error) {
      logger.error("Error procesando webhook de Mercado Pago:", error);
      return res.sendStatus(200);
    }
  }
);

/**
 * Versión server-side (Admin SDK) de confirmOrderPayment.
 * Es idempotente: si ya estaba paga, no vuelve a descontar stock.
 */
async function confirmOrderPaymentAdmin(orderId) {
  const orderRef = db.collection("orders").doc(orderId);

  await db.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);

    if (!orderSnap.exists) {
      throw new Error(`Orden ${orderId} no encontrada`);
    }

    const order = orderSnap.data();

    if (order.status === "paid") {
      logger.info(`Orden ${orderId} ya estaba paga, no se descuenta stock de nuevo.`);
      return;
    }

    for (const item of order.items) {
      const productRef = db.collection("productos").doc(item.id);
      const productSnap = await tx.get(productRef);
      if (!productSnap.exists) continue;

      const stockActual = productSnap.data().stock;
      tx.update(productRef, {
        stock: Math.max(0, stockActual - item.quantity),
        soldUnits: admin.firestore.FieldValue.increment(item.quantity),
      });
    }

    tx.update(orderRef, {
      status: "paid",
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  logger.info(`Orden ${orderId} confirmada y stock descontado.`);
}