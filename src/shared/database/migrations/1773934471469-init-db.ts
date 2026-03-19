import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1773934471469 implements MigrationInterface {
    name = 'InitDb1773934471469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tokens\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`expired_at\` timestamp NOT NULL, \`is_revoked\` tinyint NOT NULL DEFAULT 0, \`used_at\` timestamp NULL, \`user_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`phone_number\` varchar(10) NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_17d1817f241f10a3dbafb169fd\` (\`phone_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`device_categories\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ponds\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sensor_data\` (\`id\` varchar(36) NOT NULL, \`value\` float NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`sensor_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`device_schedules\` (\`id\` varchar(36) NOT NULL, \`start_at\` int NOT NULL, \`duration_second\` int NOT NULL, \`day_of_week\` enum ('0', '1', '2', '3', '4', '5', '6') NOT NULL, \`device_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`logs\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`is_read\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`control_histories\` (\`id\` varchar(36) NOT NULL, \`mode\` enum ('on', 'off') NOT NULL, \`device_id\` varchar(255) NOT NULL, \`log_id\` varchar(255) NOT NULL, UNIQUE INDEX \`REL_67bbebefce9f5f5e828f58a3fb\` (\`log_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`threshold_alerts\` (\`id\` varchar(36) NOT NULL, \`value\` float NOT NULL, \`threshold_type\` enum ('minimum-reach', 'maximum-reach') NOT NULL, \`device_id\` varchar(255) NOT NULL, \`log_id\` varchar(255) NOT NULL, UNIQUE INDEX \`REL_c2814b3f332c2c5d8b6375f5c9\` (\`log_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`devices\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`feed_name\` varchar(255) NOT NULL, \`type\` enum ('sensor-device', 'control-device') NOT NULL, \`status\` enum ('on', 'off') NULL, \`category_id\` varchar(255) NOT NULL, \`pond_id\` varchar(255) NOT NULL, UNIQUE INDEX \`REL_2893c2e4730ccce6f050a958cf\` (\`category_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`threshold_schedules\` (\`id\` varchar(36) NOT NULL, \`device_on_duration_second\` int NOT NULL, \`safe_range_minimum\` float NOT NULL, \`safe_range_maximum\` float NOT NULL, \`control_device_id\` varchar(255) NOT NULL, \`sensor_device_id\` varchar(255) NOT NULL, \`control_device-id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tokens\` ADD CONSTRAINT \`FK_Tokens_Users\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sensor_data\` ADD CONSTRAINT \`FK_SensorData_Devices\` FOREIGN KEY (\`sensor_id\`) REFERENCES \`devices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`device_schedules\` ADD CONSTRAINT \`FK_DeviceSchedules_Devices\` FOREIGN KEY (\`device_id\`) REFERENCES \`devices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`control_histories\` ADD CONSTRAINT \`FK_ControlHistory_Devices\` FOREIGN KEY (\`device_id\`) REFERENCES \`devices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`control_histories\` ADD CONSTRAINT \`FK_ControlHistory_Log\` FOREIGN KEY (\`log_id\`) REFERENCES \`logs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`threshold_alerts\` ADD CONSTRAINT \`FK_ThresholdAlert_Devices\` FOREIGN KEY (\`device_id\`) REFERENCES \`devices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`threshold_alerts\` ADD CONSTRAINT \`FK_ThresholdAlert_Log\` FOREIGN KEY (\`log_id\`) REFERENCES \`logs\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`devices\` ADD CONSTRAINT \`FK_Devices_DeviceCategories\` FOREIGN KEY (\`category_id\`) REFERENCES \`device_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`devices\` ADD CONSTRAINT \`FK_Devices_Ponds\` FOREIGN KEY (\`pond_id\`) REFERENCES \`ponds\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`threshold_schedules\` ADD CONSTRAINT \`FK_ThresholdSchedule_ControlDevice\` FOREIGN KEY (\`control_device-id\`) REFERENCES \`devices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`threshold_schedules\` ADD CONSTRAINT \`FK_ThresholdSchedule_SensorDevice\` FOREIGN KEY (\`sensor_device_id\`) REFERENCES \`devices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`threshold_schedules\` DROP FOREIGN KEY \`FK_ThresholdSchedule_SensorDevice\``);
        await queryRunner.query(`ALTER TABLE \`threshold_schedules\` DROP FOREIGN KEY \`FK_ThresholdSchedule_ControlDevice\``);
        await queryRunner.query(`ALTER TABLE \`devices\` DROP FOREIGN KEY \`FK_Devices_Ponds\``);
        await queryRunner.query(`ALTER TABLE \`devices\` DROP FOREIGN KEY \`FK_Devices_DeviceCategories\``);
        await queryRunner.query(`ALTER TABLE \`threshold_alerts\` DROP FOREIGN KEY \`FK_ThresholdAlert_Log\``);
        await queryRunner.query(`ALTER TABLE \`threshold_alerts\` DROP FOREIGN KEY \`FK_ThresholdAlert_Devices\``);
        await queryRunner.query(`ALTER TABLE \`control_histories\` DROP FOREIGN KEY \`FK_ControlHistory_Log\``);
        await queryRunner.query(`ALTER TABLE \`control_histories\` DROP FOREIGN KEY \`FK_ControlHistory_Devices\``);
        await queryRunner.query(`ALTER TABLE \`device_schedules\` DROP FOREIGN KEY \`FK_DeviceSchedules_Devices\``);
        await queryRunner.query(`ALTER TABLE \`sensor_data\` DROP FOREIGN KEY \`FK_SensorData_Devices\``);
        await queryRunner.query(`ALTER TABLE \`tokens\` DROP FOREIGN KEY \`FK_Tokens_Users\``);
        await queryRunner.query(`DROP TABLE \`threshold_schedules\``);
        await queryRunner.query(`DROP INDEX \`REL_2893c2e4730ccce6f050a958cf\` ON \`devices\``);
        await queryRunner.query(`DROP TABLE \`devices\``);
        await queryRunner.query(`DROP INDEX \`REL_c2814b3f332c2c5d8b6375f5c9\` ON \`threshold_alerts\``);
        await queryRunner.query(`DROP TABLE \`threshold_alerts\``);
        await queryRunner.query(`DROP INDEX \`REL_67bbebefce9f5f5e828f58a3fb\` ON \`control_histories\``);
        await queryRunner.query(`DROP TABLE \`control_histories\``);
        await queryRunner.query(`DROP TABLE \`logs\``);
        await queryRunner.query(`DROP TABLE \`device_schedules\``);
        await queryRunner.query(`DROP TABLE \`sensor_data\``);
        await queryRunner.query(`DROP TABLE \`ponds\``);
        await queryRunner.query(`DROP TABLE \`device_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_17d1817f241f10a3dbafb169fd\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`tokens\``);
    }

}
