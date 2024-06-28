interface Application {
  id: string;
  name: string;
  description: string;
  user_id: string;

  channels: Channel[];
}
