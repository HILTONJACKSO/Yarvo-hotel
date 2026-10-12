const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  const email = 'superadmin@yarvohotel.com';
  const password = 'SuperSecretPassword123!';
  
  const passwordHash = await argon2.hash(password);

  let superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        name: 'SUPER_ADMIN',
        description: 'System Administrator',
        permissions: [],
      }
    });
  }

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        firstName: 'System',
        lastName: 'Admin',
        email,
        passwordHash,
        roles: {
          connect: { id: superAdminRole.id }
        }
      }
    });
    console.log(`Created super admin user: ${email} / ${password}`);
  } else {
    // Ensure role
    await prisma.user.update({
      where: { email },
      data: {
        roles: {
          connect: { id: superAdminRole.id }
        }
      }
    });
    console.log(`Super admin user already exists: ${email}. Ensure role is set.`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
