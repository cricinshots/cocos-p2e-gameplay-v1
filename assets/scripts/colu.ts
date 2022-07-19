import { Log } from "./common";
import { Game } from "./Game";
import * as Colyseus from "./colyseus.js"

export const R_STATEMAP = {
    NOT_CONNECTED: 0,   // never connected
    CONNECTED: 1,
    JOINED: 2,
    JOIN_ERROR: -1,
    DISCONNECTED: -2    //disconnected after being connected
};

export class Colu {
    static client;
    static room;
    static rState:number= R_STATEMAP.NOT_CONNECTED;

    static connect() {
        //todo: how do we know if we are really connected?
        Colu.client = new Colyseus.Client("wss://faceoff.cricinshots.com/human");
        // Colu.client = new Colyseus.Client("ws://172.28.25.108:2567");
        // Colu.client = new Colyseus.Client("ws://117.214.115.60:2567");
        this.rState = R_STATEMAP.CONNECTED;
        Log.v('client:');
        Log.v(Colu.client);
    }

    static async joinOrCreate(){
        if(this.rState !== R_STATEMAP.CONNECTED){
            return;
        }
        try {
            Colu.room = await Colu.client.joinOrCreate("my_room", {/* options */});
            //inspect object to check
            Log.v(Colu.room);    
            Colu.setListenersDefault();
        } catch (e) {
            console.error("join error", e);
        }
    }
    
    static getRooms() {
        Colu.client.getAvailableRooms("my_rooms").then(rooms => {
            rooms.forEach((room) => {
              Log.v(room.roomId);
              Log.v(room.clients);
              Log.v(room.maxClients);
              Log.v(room.metadata);
            });
          }).catch(e => {
            Log.e(e);
        });
    }

    //pass functions here
    static setListeners(onStateChange:Function,onMessage:Function,onError:Function,onLeave:Function) {
        Colu.room.onStateChange((state) => {
            Log.v(Colu.room.name + "has new state:" + state);
        });
        Colu.room.onMessage("message_type", (message) => {
            Log.v(Colu.client.id+ "received on"+ Colu.room.name+'\n'+ message);
        });
        Colu.room.onError((code, message) => {
            Log.v(Colu.client.id+ " couldn't join "+ Colu.room.name);
        });
        Colu.room.onLeave((code) => {
            Log.v(Colu.client.id+ " left "+ Colu.room.name);
        });
    }

    private static setListenersDefault() {
        Colu.room.onStateChange((state) => {
            Log.v(Colu.room.name + "has new state:" + state);
        });
        Colu.room.onMessage("faceoff", (message) => {
            Game.onMessage(message);
        });
        Colu.room.onError((code, message) => {
            Log.v(Colu.client.id+ " couldn't join "+ Colu.room.name);
        });
        Colu.room.onLeave((code) => {
            Log.v(Colu.client.id+ " left "+ Colu.room.name);
        });
    }

    static sendMessage(data:any) {
        // this.client.sendMessage('faceoff',data);
        // Log.v(Colu.room.send);
        Colu.room.send('faceoff',data);
    }
}