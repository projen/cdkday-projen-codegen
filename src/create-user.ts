import { UserClient } from './user/client';
import { User } from './user/model';

export async function handler(event: User) {
  const client = new UserClient();
  await client.putItem(event);
}