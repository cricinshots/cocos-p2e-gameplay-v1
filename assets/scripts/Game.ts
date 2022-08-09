import { Colu, R_STATEMAP } from "./colu";
import { Log } from "./common";

export const GAME_MAP = {
    MATCHED:0,
    JOINED:1,
    TOSS_WAITING:2,
    TOSS_COMPLETE:3,
    TEAM_SELECTION_WAITING:4,
    TEAM_SELECTION_COMPLETE:5,
    GAME_ROUND_1:6,
    GAME_WAIT_ROUND:7,
    GAME_ROUND_2:8,
    GAME_COMEPLETE:9
};

const EVENTS = {
    S_ROOM_JOINED: 0,
    S_TOSS: 1,
    C_TOSS_RESULT: 2,
    S_TEAM_SELECTION: 3,
    C_TEAM_REARRANGE: 4,
    C_TEAM_CONFIRM: 5,
    S_TEAM_CONFIRM: 6,
    S_TEAM_SELECTION_STATUS: 7,
    S_GAME_STATUS: 8,
    S_GAME_TURN: 9,
    C_PLAY_TURN: 10,
    S_TURN_OUTCOME: 11,
    S_GAME_RESULTS: 12,
    S_WAIT: 13,
    S_LEAVE: -1,
    S_ERROR: -2,
    S_PLAYER_LEFT: -3,
}

export class Game {
    static status:number = GAME_MAP.MATCHED;
    static winner:object;
    static loser:object;
    static user:User;
    static opponent:User;
    static isBatting:boolean;
    static innings1:boolean;
    static toss:Toss;
    static room:Room;
    static nextTimeout:Timeout;
    static squadStatus:Squads;
    static iAmReady:boolean = false;
    static opponentReady:boolean = false;
    static myScore:number=0;
    static opponentScore:number=0;
    static squads:Squads;
    static won:boolean;
    static init() {
        Game.status = GAME_MAP.MATCHED;
    }
    static turn:Turn;

    static onMessage(m) {
        Log.v(m);
        //read event id
        var message:Message = new Message();
        message.fromJSON(m);
        // Log.v(message);f
        switch(message.event){
            case EVENTS.S_ROOM_JOINED:
                Game.roomJoined(message.data);
                break;
            case EVENTS.S_TOSS:
                Game.handleToss(message.data);
                break;
            case EVENTS.S_TEAM_SELECTION:
                Game.handleTeamSelection(message.data);
                break;
            case EVENTS.S_TEAM_SELECTION_STATUS:
                Game.handleTeamSelectionStatus(message.data);
                break;
            case EVENTS.S_TEAM_CONFIRM:
                Game.handleTeamConfirm(message.data);
                break;
            case EVENTS.S_GAME_STATUS:
                Game.handleGameStatus(message.data);
                break;
            case EVENTS.S_GAME_TURN:
                Game.handleGameTurn(message.data);
                break;
            case EVENTS.S_TURN_OUTCOME:
                Game.handleTurnResult(message.data);
                break;
            case EVENTS.S_WAIT:
                Game.status=GAME_MAP.GAME_WAIT_ROUND
                break
            case EVENTS.S_GAME_RESULTS:
                Game.handleResult(message.data);
            default:
                Log.v("This event is not yet defined");
                break;
        }
    }

    static handleResult(data) {
        Log.v('handling game result');
        Game.myScore = data['score']['me'];
        Game.opponentScore = data['score']['opponent'];
        Game.winner=data['winner'];
        Game.loser=data['loser'];
        Game.won = data['iwin'];
        Game.status = GAME_MAP.GAME_COMEPLETE;
    }

    static sendToServer(message:Message) {
        Log.v('sending');
        Log.v(message.toJSON());
        // Colu.sendMessage(message.toJSON());
        Colu.room.send('faceoff',message.toJSON());
    }

    private static handleTeamConfirm(data) {
        if(!data['myteam']){
            Log.v("Oh no! Kya museebat hai. Teams not confirmed correctly");
        }
        Game.turn = new Turn();
        this.turn.id = -1;

        //todo: remove in the future, this was done to remove some undefined variable problems in GameScreen.tx
        Game.turn.id = -1;
        Game.turn.time = null;
        Game.myScore = 0;
        Game.opponentScore = 0;

        Log.v('a turn object was created');
    }

    private static handleGameStatus(data)  {
        Game.turn = new Turn();
        this.turn.id = -1;

        //todo: remove in the future, this was done to remove some undefined variable problems in GameScreen.tx
        Game.turn.id = -1;
        Game.turn.time = null;
        Game.myScore = 0;
        Game.opponentScore = 0;

        Log.v('a turn object was created');

        //not reading gametime
        //not reading paused

        //todo: remove this in the future
        Game.user.uname = data['me']['uname'];
        Game.user.level = data['me']['level'];
        Game.user.imageurl = data['me']['imageurl'];

        Game.opponent.uname = data['opponent']['uname'];
        Game.opponent.level = data['opponent']['level'];
        Game.opponent.imageurl = data['opponent']['imageurl'];

        Game.isBatting = data['batting'];

        Game.innings1 = data['innings1'];

        //todo: check for innings number and decide
        if(Game.innings1)
            Game.status = GAME_MAP.GAME_ROUND_1;
        else
            Game.status  = GAME_MAP.GAME_ROUND_2;

        Log.v(`Game round ${Game.status.toString()}`);
    }

    private static handleGameTurn(data) {
        Game.turn.id = data['turnid'];
        Game.turn.time = new Timeout(data['turntime']['start'],data['turntime']['offset']);
        Game.myScore = data['score']['me'];
        Game.opponentScore = data['score']['opponent'];
        Game.turn.addCards(data['mycards']);
    }

    private static handleTurnResult(data) {
        Game.turn.handleTurnResult(data);
    }

    private static handleTeamSelection(data) {
        Game.user.players = data['myteam'];
        Game.opponent.players = data['opponent'];
        Game.squads = new Squads();
        Game.squads.myStatus=false;
        Game.squads.opponentStatus = data['opponentStatus'];
        Game.squads.timeout = new Timeout(data['timeout']['start'], data['timeout']['offset']);
        Log.v('Waiting for team selection. Squad data was set');
        Game.status = GAME_MAP.TEAM_SELECTION_WAITING;
    }

    private static handleTeamSelectionStatus(data)  {
        Game.iAmReady = data['myteam'];
        Game.opponentReady = data['opponent'];
        Log.v("team selection status: me: "+Game.iAmReady.toString()+" opponent: "+Game.opponentReady.toString());
    }

    private static roomJoined(data) {
        Log.v("processing room join");
        this.room = new Room(data['roomid'],data['opponent'],
        new Timeout(data['timeout']['start'], data['timeout']['offset']));

        //set user data
        //todo: fix later
        var us:User = new User(0);
        us.level = data['myteam']['level'];
        us.players = data['myteam']['team'];
        us.uname = data['myteam']['uname'];
        us.imageurl = data['myteam']['imageurl'];
        this.user = us;

        var us:User = new User(0);
        us.level = data['opponent']['level'];
        us.players = data['opponent']['team'];
        us.uname = data['opponent']['uname'];
        us.imageurl = data['opponent']['imageurl'];
        this.opponent = us;

        Colu.rState = R_STATEMAP.JOINED;
        Game.status = GAME_MAP.JOINED;
    }

    private static handleToss(data){
        Log.v('handling toss');
        Game.toss = new Toss(data['result'],
        //todo: error handling
        new Timeout(data['timeout']['start'], data['timeout']['offset']));
        Log.v('waiting for toss');
        if(data['batting']===null){
            Game.status = GAME_MAP.TOSS_WAITING;
            //todo: toss result not known yet. Should we do something?
            Log.v("Toss result unknown");
            Log.v(data['batting']===null);
            Log.v(data['batting']);
        }else{
            Log.v("Setting toss result");
            Game.toss.batting = data['batting'];
            Game.status = GAME_MAP.TOSS_COMPLETE;
        }
    }
}

class Room {
    roomid:String;
    opponent:any;
    timeout:Timeout;

    constructor(roomid:String, opponent, timeout:Timeout) {
        this.roomid = roomid;
        this.opponent = opponent;
        this.timeout = timeout
    }
}

class Squads {
    timeout:Timeout;
    opponentStatus:boolean;
    myStatus:boolean;

    getRemainingSeconds() {
        return (Math.round((this.timeout.offset  - (Date.now() - this.timeout.start))/1000));
    }
}

class User{
    token:number|String;
    players:Array<any>;
    uname:string;
    level:number;
    imageurl:string;
    constructor(token:number|String){
        this.token = token;
    }

    setDetails(uname, level, players) {
        this.uname = uname;
        this.level = level;
        this.players = players;
    }

    rearrangePlayer(p1:number, target:number) {
        if(p1 == target ) return;
        if(p1>=this.players.length || target>=this.players.length){
            return;
        }
        //shift = true
        var type:boolean = false;
        if(p1>11){
            //swap p1 with target
            var temp = this.players[p1];
            this.players[p1] = this.players[target];
            this.players[target] = temp;
        }else{
            type = true;
            var temp = this.players[p1];
            if(p1>target){
                //shift down
                for (var i:number=p1;i>target;i-=1){
                    this.players[i+1] = this.players[i];
                }
            }else{
                //shift up
                for (var i:number=p1;i<target;i+=1){
                    this.players[i-1] = this.players[i];
                }
            }
            this.players[target] = temp;
            Log.v('shift complete');
        }
        //send result
        var mess:Message = new Message();
        mess.event = EVENTS.C_TEAM_REARRANGE;
        mess.error = 0;
        mess.message = "";
        mess.status = Game.status;
        mess.data = {
            type: type,
            playerid: this.players[p1]['playerid'],
            position: target
        };
        Log.v('sending player rearrange to server');
        Game.sendToServer(mess);
    }

    submitSquad() {
        var teamids:Array<number>=[];
        Log.v('submitting team');
        Log.v(this.players);
        for(var player of this.players) {
            teamids.push(player['playerid']);
        }
        Log.v('submitting ');
        Log.v(teamids);
        var mess:Message = new Message();
        mess.event = EVENTS.C_TEAM_CONFIRM;
        mess.error = 0;
        mess.message = "";
        mess.status = Game.status;
        mess.data = {
            myteam:teamids
        };
        Log.v('sending final team to server');
        Game.sendToServer(mess);
        //todo: should we wait for server to set this boolean
        //Game.iAmReady = true;
    }
}

class Turn {
    id:number;
    time:Timeout;
    cards:Array<any>;
    lastIndex:number=-1;
    outcomeCommentary:string;
    outcomeMyCard:any;
    outcomeOpponentCard:any;
    outcomeEvent:number;
    outcomeScore:number;
    outcomeId:number=-2;
    //not reading commentary
    emptyCardInList:boolean = false;

    addCards(cards:Array<any>){
        Log.v('adding cards');
        Log.v(cards);
        if(this.lastIndex == -1 || cards.length == 4){
            //means no cards present
            Log.v('replacing all cards');
            this.cards = cards;

        }else{
            Log.v('adding a single card');
            //replace the one card
            this.cards[this.lastIndex] = cards[0];
        }
        this.emptyCardInList = false;
    }

    playCard(cardIndex:number) {
        //send this card to server
        Log.v(`playing card ${cardIndex.toString()} from ${this.cards.toString()}`);
        var mess:Message = new Message();
        mess.event = EVENTS.C_PLAY_TURN;
        mess.error = 0;
        mess.message = "";
        mess.status = Game.status;
        mess.data = {
            turnid: this.id,
            playerid: this.cards[cardIndex]['playerid']
        };
        Game.sendToServer(mess);
        //now delete the card
        // delete(this.cards[cardIndex]);
        this.cards[cardIndex] = null;
        this.lastIndex = cardIndex;
        this.emptyCardInList = true;
    }

    handleTurnResult(data) {
        Log.v('setting outcomeid');
        this.outcomeEvent = data['outcome']['event'];
        this.outcomeMyCard = data['mycard'];
        this.outcomeOpponentCard = data['opponentcard'];
        this.outcomeScore = data['outcome']['score'];
        this.outcomeId = data['turnid'];
        this.outcomeCommentary=data['outcome']['commentary']
        Game.myScore = data['score']['me'];
        Game.opponentScore = data['score']['opponent'];

    }

    isResultShowing() {
        Log.v(`Game result showing: ${(this.outcomeId == this.id).toString()}`);
        Log.v(this.id);
        Log.v(this.outcomeId);
        return(this.outcomeId == this.id);
    }

    getEmptyIndices() {
        let e:Array<number> = [];
        for (let i:number = 0;i<this.cards.length;i++){
            if(this.cards[i] == null)
                e.push(i);
        }
        return e;
    }

    getEmptyIndices2(cs:Array<cc.Node>) {
        // Log.v(this.isResultShowing());
        if(this.isResultShowing()) return [];
        // Log.v(this.outcomeId);
        if(this.outcomeId<0) return [];
        // if(this.id <= this.outcomeId) return [];
        let e:Array<number> = [];
        Log.v('looking for empty indices '+cs.length.toString());
        for (let i:number = 0;i<cs.length;i++){
            // Log.v(cs[i]);
            if(cs[i] == null)
                e.push(i);
        }

        Log.v(e);
        return e;
    }

    getRemainingSeconds() {
        return (Math.round((this.time.offset  - (Date.now() - this.time.start))/1000));
    }

}

class Toss {
    won:boolean;
    batting:boolean = null;
    timeout:Timeout;

    constructor(won:boolean,timeout:Timeout){
        this.won = won;
        this.timeout = timeout;
    }

    selectTossOption(batting:boolean) {
        if(!this.won){
            //user trying to choose even though they didn't win. how? #cheating
            return false;
        }
        //DON'T set batting directly, let server set it
        var mess:Message = new Message();
        mess.event = EVENTS.C_TOSS_RESULT;
        mess.error = 0;
        mess.message = "";
        mess.status = Game.status;
        mess.data = {
            batting: batting
        }
        Log.v('Sending toss result to server');
        Game.sendToServer(mess);
    }
}

class Timeout {
    start:number;
    offset: number;
    constructor(start:number,offset:number){
        this.start = start;
        this.offset = offset;
    }
}

class Message {
    event:number;
    error:number;
    message:string;
    data:any;
    timestamp:number;
    status:number;

    fromJSON(json) {
        // var json = JSON.parse(message);
        this.event = json['event'];
        this.error = json['error'];
        this.message = json['message'];
        this.data = json['data'];
        this.timestamp = json['timestamp'];
        this.status = json['status'];
    }

    toJSON() {
        // Log.v(JSON.stringify(this));
        // return JSON.stringify(this);
        // return this;
        return {
            event:this.event,
            error:this.error,
            message:this.message,
            data:this.data,
            status:Game.status,
            timestamp: Date.now()
        };
    }
}