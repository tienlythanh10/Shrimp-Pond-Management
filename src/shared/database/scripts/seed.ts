import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { dataSource } from '../datasource';
import { User, UserRole } from '../entities/user.entity';
import { DeviceCategory } from '../entities/device-category.entity';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

async function seedUser(params: {
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}) {
      const userRepo = dataSource.getRepository(User);

        const existing = await userRepo.findOne({
    where: { email: params.email },
  });

  if (existing) {
    console.log(`Skip existing user: ${params.email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(params.password, 10);

  const transaction = dataSource.createQueryRunner();

  // establish real database connection using our new query runner
  await transaction.connect();

  await transaction.startTransaction();


    try {
    const user = userRepo.create({
      email: params.email,
      password: passwordHash,
      role: params.role,
        'firstName': params.firstName,
        "lastName": params.lastName,
        "phoneNumber": params.phone
    });

    await userRepo.save(user);

    await transaction.commitTransaction();
  } catch (error) {
    await transaction.rollbackTransaction();
    console.log(`Đã có lỗi xảy ra khi tạo tài khoản với quyền ${params.role}`);
  } finally {
    await transaction.release();
  }
  console.log(`Created ${params.role}: ${params.email}`);
}

async function seedDeviceCategory (){
  const deviceCategories = ['Cảm biến nhiệt độ', "Cảm biến mực nước", "Máy bơm", "Mái che", "Đèn chiếu sáng"]
  const deviceCategoryRepo = dataSource.getRepository(DeviceCategory);
  
  for (let category of deviceCategories) {
    const isExist = await deviceCategoryRepo.findOne({
      where: {
        name: category
      }
    })

    if (isExist == null) {
      const newCategory = deviceCategoryRepo.create({
        "name": category
      })
      await deviceCategoryRepo.save(newCategory);
    }
  }

  console.log(`Created device category seed complete`);
}

async function bootstrap() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminPhone = process.env.SEED_ADMIN_PHONE;

  if (!adminEmail || !adminPassword || !adminPhone) {
    throw new Error('Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD');
  }

  await dataSource.initialize();

  try {
    await seedUser({
      email: adminEmail,
      password: adminPassword,
      phone: adminPhone,
      firstName: 'Admin',
      lastName: 'System',
      role: UserRole.ADMIN,
    });

    await seedDeviceCategory()

    console.log('Seed completed');
  } finally {
    await dataSource.destroy();
  }
}

bootstrap().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});