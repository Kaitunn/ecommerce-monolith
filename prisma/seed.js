import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma.js";

const seed = async () => {
  try {
    const userRole = await prisma.role.upsert({
      where: { rolename: "normal" },
      update: {},
      create: { rolename: "normal" },
    });

    const adminRole = await prisma.role.upsert({
      where: { rolename: "ADMIN" },
      update: {},
      create: { rolename: "ADMIN" },
    });

    const standardMembership = await prisma.membership.upsert({
      where: { mname: "STANDARD" },
      update: { score: 10 },
      create: {
        mname: "STANDARD",
        score: 10,
      },
    });

    const hashedAdminPassword = await bcrypt.hash("admin123", 10);

    const adminUser = await prisma.user.upsert({
      where: { username: "admin01" },
      update: {
        fullname: "System Admin",
        roleid: adminRole.roleid,
        mid: standardMembership.mid,
      },
      create: {
        username: "admin01",
        fullname: "System Admin",
        password: hashedAdminPassword,
        roleid: adminRole.roleid,
        mid: standardMembership.mid,
      },
      select: {
        uid: true,
        username: true,
        fullname: true,
        role: {
          select: { rolename: true },
        },
      },
    });

    console.log("Seed completed");
    console.log("NORMAL role:", userRole);
    console.log("ADMIN role:", adminRole);
    console.log("STANDARD membership:", standardMembership);
    console.log("ADMIN user:", adminUser);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

seed();