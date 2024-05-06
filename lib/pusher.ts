import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1797571",
  key: "3d2a0936cc767d25f2f3",
  secret: "b649ea8120f7546c23e9",
  cluster: "sa1",
  useTLS: true,
});

export const pusherClient = new PusherClient("3d2a0936cc767d25f2f3", {
  cluster: "sa1",
});
