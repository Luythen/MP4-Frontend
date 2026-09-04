/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, type StompSubscription } from "@stomp/stompjs"
import SockJS from "sockjs-client";

let client: Client | null = null;

const pendingSubs = new Map<string, { onMessage: (msg: unknown) => void; subscription: StompSubscription | null }>();

const getClient = (): Client => {
    if (client) return client;

    client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/websocket"),
        reconnectDelay: 5000,
        debug: (str) => console.log(str)
    })

    client.onConnect = () => {
        pendingSubs.forEach((sub, subPath) => {
            sub.subscription = client!.subscribe(subPath, (message) => {
                const parsed: any = JSON.parse(message.body)
                sub.onMessage(parsed);
            })
        })
    }

    client.activate()

    return client;
}

export const subscribe = (onMessage: (msg: any) => void, subscribePath: string) => {
    const stompClient = getClient();

    pendingSubs.set(subscribePath, { onMessage, subscription: null})

    if (stompClient.connected) {
        const sub = stompClient.subscribe(subscribePath, (message) => {
            const parsed: unknown = JSON.parse(message.body)
            onMessage(parsed)
        })
        pendingSubs.get(subscribePath)!.subscription = sub;
    }

    return () => {
        pendingSubs.get(subscribePath)?.subscription?.unsubscribe();
        pendingSubs.delete(subscribePath)
    }
}

export const sendMessage = (destination: string, message: any) => {
    const stompClient = getClient()

    if (stompClient.connected) {
        stompClient.publish({
            destination,
            body: message
        })
    }
}

export const disconnectStomp = () => {
    client?.deactivate();
    client = null;
    pendingSubs.clear();
}