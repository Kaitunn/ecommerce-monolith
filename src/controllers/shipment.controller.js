import prisma from "../config/prisma.js";

export const createShipment = async (req, res) => {
  try {
    const { oid, status } = req.body;

    const orderId = Number(oid);

    if (!Number.isInteger(orderId) || !status) {
      return res.status(400).json({
        message: "oid and status are required",
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        oid: orderId,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const shipment = await prisma.shipment.create({
      data: {
        oid: orderId,
        status,
      },
    });

    return res.status(201).json({
      message: "Shipment created successfully",
      shipment,
    });
  } catch (error) {
    console.error("Create shipment error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllShipments = async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany({
      include: {
        order: {
          include: {
            user: {
              select: {
                uid: true,
                username: true,
                fullname: true,
              },
            },
          },
        },
      },
      orderBy: {
        shipid: "asc",
      },
    });

    return res.status(200).json({
      shipments,
    });
  } catch (error) {
    console.error("Get shipments error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateShipmentStatus = async (req, res) => {
  try {
    const shipid = Number(req.params.shipid);
    const { status } = req.body;

    if (!Number.isInteger(shipid) || !status) {
      return res.status(400).json({
        message: "Valid shipid and status are required",
      });
    }

    const existingShipment = await prisma.shipment.findUnique({
      where: {
        shipid,
      },
    });

    if (!existingShipment) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    const shipment = await prisma.shipment.update({
      where: {
        shipid,
      },
      data: {
        status,
      },
    });

    return res.status(200).json({
      message: "Shipment status updated successfully",
      shipment,
    });
  } catch (error) {
    console.error("Update shipment error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};