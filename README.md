## How to run this project
First of all, you need to clone this project to your local machine
```bash
git clone https://github.com/tienlythanh10/Shrimp-Pond-Management.git
```
Then cd to the working folder

#### 1. Fill environment variables:

For dev mode:

```bash
cp .env.sample .env.development
```

Then, fill all environment variables in .env.development file with expected value.
##### Note:
* SEED_ADMIN_PHONE: phone number of admin account, length of 10. 

#### 2. Create database
Using MySQL CLI or something that you can create database with database name as you defined in .env.development file

#### 3. Install dependencies:

```bash
npm install
```

#### 4. Run Development mode
Run migration:

```bash
NODE_ENV=development npm run migration:run
```

Run seed:
```bash
NODE_ENV=development npm run seed
```
Start the project in dev mode:

```bash
NODE_ENV=development npm run start:dev
```
