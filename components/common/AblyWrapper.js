import React, { useState } from 'react';
import { Notification } from 'rsuite';

export default function AblyWrapper({ children, setParentClient }) {
  const [client, setClient] = useState({});

  const subscribe = async (ablyInstance, userEmail) => {
    const channel = ablyInstance.channels.get("notifications");
    await channel.subscribe(userEmail, message => {
      Notification.info({
        title: "Inventario bajo",
        description: message.data,
        placement: "bottomEnd",
        duration: 10000
      });
    });
    setClient(ablyInstance);
    setParentClient(ablyInstance)
  }

  const unsubscribe = () => {
    const channel = client.channels.get("notifications");
    channel.unsubscribe();
    client.connection.close();
  }

  return (
    <>
      {React.cloneElement(children, {
        ablyClient: client,
        subscribeAbly: subscribe,
        unsubscribeAbly: unsubscribe
      })}
    </>
  );
}