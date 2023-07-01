import { DataSource } from 'typeorm';
import { createRoles, createUsers } from './seeds';

export async function runSeeds(datasource: DataSource) {
  await createRoles(datasource);
  await createUsers(datasource);
  return;
}