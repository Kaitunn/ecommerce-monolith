import prisma from "../config/prisma.js";

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required",
      });
    }

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          uid: req.user.uid,
        },
      });

      for (const item of items) {
        const pid = Number(item.pid);
        const qty = Number(item.qty);

        if (!Number.isInteger(pid) || !Number.isInteger(qty) || qty <= 0) {
          throw new Error("INVALID_ITEM");
        }

        const product = await tx.product.findUnique({
          where: {
            pid,
          },
        });

        if (!product) {
          throw new Error(`PRODUCT_NOT_FOUND:${pid}`);
        }

        if (product.quantity < qty) {
          throw new Error(`INSUFFICIENT_STOCK:${pid}`);
        }

        await tx.orderDetail.create({
          data: {
            oid: createdOrder.oid,
            pid: product.pid,
            qty,
            unit_price: product.price,
          },
        });

        await tx.product.update({
          where: {
            pid: product.pid,
          },
          data: {
            quantity: {
              decrement: qty,
            },
          },
        });
      }

      return tx.order.findUnique({
        where: {
          oid: createdOrder.oid,
        },
        include: {
          orderDetails: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    if (error.message === "INVALID_ITEM") {
      return res.status(400).json({
        message: "Invalid order item",
      });
    }

    if (error.message.startsWith("PRODUCT_NOT_FOUND:")) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
      return res.status(400).json({
        message: "Insufficient product stock",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        uid: req.user.uid,
      },
      include: {
        orderDetails: {
          include: {
            product: true,
          },
        },
        shipments: true,
      },
      orderBy: {
        oid: "desc",
      },
    });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};