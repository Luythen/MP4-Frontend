/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, type StompSubscription } from "@stomp/stompjs"
import SockJS from "sockjs-client";

let client: Client | null = null;

// Save all stomp subscriptions and callback
const pendingSubs = new Map<string, { onMessage: (msg: unknown) => void; subscription: StompSubscription | null }>();

const getClient = (): Client => {
    if (client) return client;

    client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:5050/websocket"),
        reconnectDelay: 5000,
        debug: (str) => console.log(str)
    })

    client.onConnect = () => {

        // Subscribes to paths if user hade made a subscription before the connection hade been made
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

// Listen for the replays from the server
export const subscribe = (onMessage: (msg: any) => void, subscribePath: string) => {
    const stompClient = getClient();

    pendingSubs.set(subscribePath, { onMessage, subscription: null})

    if (stompClient.connected) {
        const sub = stompClient.subscribe(subscribePath, (message) => {
            const parsed: any = JSON.parse(message.body);
            onMessage(parsed)
        })
        pendingSubs.get(subscribePath)!.subscription = sub;
    }
}

export const unSubscribe = (subscribePath: string) => {
    const stompClient = getClient();

    if (stompClient.connected) {
        pendingSubs.get(subscribePath)?.subscription?.unsubscribe();
        pendingSubs.delete(subscribePath)
    }
}

// Sendmessage to the server
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