import { DataSource } from "typeorm";
export const appDataSource = new DataSource({
  type: "mysql",
  host: "sniffer-db.cudsdkia6z5s.eu-central-1.rds.amazonaws.com",
  port: 3306,
  username: "admin",
  password: "ZEnEz2n6ZEN4PRpnXRGu",
  database: "snifferdbdev",
  synchronize: true,
  entities: [`${__dirname}/entities/*.{js,ts}`],
  logging: true,
});
