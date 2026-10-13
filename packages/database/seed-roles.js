const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const roles = [
  { name: 'SUPER_ADMIN', description: 'Full access to all system features' },
  { name: 'ADMIN', description: 'Administrator' },
  { name: 'CEO', description: 'Chief Executive Officer' },
  { name: 'MANAGER', description: 'Property manager with reporting and override access' },
  { name: 'FRONT_DESK', description: 'Front desk operations, check-in, check-out' },
  { name: 'HOUSEKEEPING', description: 'Room status management' },
  { name: 'ACCOUNTING', description: 'Financial reports and audits' },
  { name: 'CASHIER', description: 'Handles payments and POS transactions' },
  { name: 'KITCHEN_CHEF', description: 'Kitchen and food preparation staff' },
  { name: 'STAFF_WAITER', description: 'Restaurant and bar service staff' },
  { name: 'SUPERVISOR', description: 'Shift supervisor with elevated permissions' },
  { name: 'TICKETING_STAFF', description: 'Staff who issues tickets for pool and gate' },
];

async function main() {
  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
  }
  console.log('All 12 roles seeded successfully.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
