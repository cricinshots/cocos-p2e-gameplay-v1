import { Log } from "./common";
import { Colu, R_STATEMAP } from "./colu";
import { Game, GAME_MAP } from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TossScreen extends cc.Component {

    //component name, height ratio, width ratio, x, y (as ratios)

    mainLabel: cc.Label = null;
    resultLabel: cc.Label = null;
    canvas:cc.Node = null;
    btnBat:cc.Button = null;
    btnBowl: cc.Button = null;

    @property
    height:number = 0;
    @property
    width:number = 0;

    @property
    titleTossWon:string=null; //= 'You have won the toss!';
    @property
    titleTossLost:string=null; //= 'Opponent has won the toss';

    @property(cc.SpriteFrame)
    batSpriteNormal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    batSpritePressed: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    batSpriteDisabled: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bowlSpriteNormal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    bowlSpritePressed: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    bowlSpriteDisabled: cc.SpriteFrame = null;

    titleText: string = '101';
    resultText: string = 'OR';

    start() {
        if(Game.status < GAME_MAP.TOSS_WAITING){
            //something's wrong
            //todo: take back to matchmaking?
            Log.e("Somethings wrong. Game status: "+Game.status.toString());
        }
        // window.self = '';
        // window.regeneratorRuntime = '';
        Log.logToConsole = true;
        this.initui();
        this.onResized();
        if (cc.sys.isMobile) {
            window.addEventListener('resize', this.onResized.bind(this));
        } else {
            cc.view.on('canvas-resize', this.onResized, this);
        } 
    }
    
    playerScreenOpened:boolean = false;
    lastTime=0;
    update (dt) {
        // Log.v(dt);
        if(this.playerScreenOpened) return;
        this.lastTime+=dt;
        if(this.lastTime<1){
            return;
        }
        // Log.v('refreshing');
        this.lastTime = 0;
        if(!this.playerScreenOpened){
            if(Colu.rState >= R_STATEMAP.JOINED){
                if(Game.status === GAME_MAP.TOSS_WAITING){
                    
                }        
                if(Game.status === GAME_MAP.TOSS_COMPLETE){
                    this.buildui();
                }  
                if(Game.status > GAME_MAP.TOSS_COMPLETE) {
                    //toss data has been received, navigate
                    cc.director.loadScene("SquadScene");
                    this.playerScreenOpened = true;
                }
            }else{
                Log.v('Kuch to gadbad hai daya');
            }
        }
    }


    initui() {
        Log.v(this.node.name);
        if(Game.toss == null) {
            Log.e("Toss is null!!! skipping build");
            return;
        }
        if(Game.toss.won) {
            this.btnBat = this.node.getChildByName('btnBat').getComponent(cc.Button);
            this.btnBat.normalSprite=this.batSpriteNormal;
            this.btnBat.disabledSprite=this.batSpriteDisabled
            this.btnBat.pressedSprite=this.batSpritePressed

            //set batting button listener
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "TossScreen";// This is the code file name
            clickEventHandler.handler = "onBtnBatClicked";
            clickEventHandler.customEventData = "1";
            this.btnBat.clickEvents = [clickEventHandler];

            this.btnBowl = this.node.getChildByName('btnBowl').getComponent(cc.Button);
            this.btnBowl.normalSprite=this.bowlSpriteNormal;
            this.btnBowl.disabledSprite=this.bowlSpriteDisabled
            this.btnBowl.pressedSprite=this.bowlSpritePressed

            //set bowling button listener
            let clickEventHandler2 = new cc.Component.EventHandler();
            clickEventHandler2.target = this.node;
            clickEventHandler2.component = "TossScreen";// This is the code file name
            clickEventHandler2.handler = "onBtnBowlClicked";
            clickEventHandler2.customEventData = "2";
            this.btnBowl.clickEvents = [clickEventHandler2];

        }
        this.mainLabel = this.node.getChildByName('mainLabel').getComponent(cc.Label);
        this.resultLabel = this.node.getChildByName('resultLabel').getComponent(cc.Label);
        Log.v('Toss Scree ui initialised');
        // this.buildui();
    }

    buildui() {
        console.log('rebuilding ui');
        if(this.mainLabel==null){
            Log.v("ui not initialised yet");
            return;
        }
        Log.v('rebuilding ui');
        //resize
        
        //place
        //sets at 20% top
        
        //this.resultLabel.node.setPosition(0,-this.geth(40));

        this.mainLabel.node.setContentSize(new cc.Size(this.getw(60),this.geth(8)));
        this.resultLabel.node.setContentSize(new cc.Size(this.getw(60),this.geth(8)));

        if(Game.toss.won) {
            /*this.mainLabel.node.setPosition(0,this.geth(40));
            this.btnBat.node.setPosition(0,this.geth(15));
            this.btnBowl.node.setPosition(0,-this.geth(15));*/

            //this.btnBat.node.setContentSize(new cc.Size(this.getw(40),this.getw(40)));
            //this.btnBowl.node.setContentSize(new cc.Size(this.getw(40),this.getw(40)));

            if(Game.toss.batting === null){
                this.btnBat.node.setContentSize(new cc.Size(this.getw(30),this.getw(30)));
                this.btnBowl.node.setContentSize(new cc.Size(this.getw(30),this.getw(30)));
                this.resultLabel.node.setPosition(0,0);
                this.mainLabel.node.setPosition(0,this.geth(30));
                this.btnBat.node.setPosition(0,this.geth(15));
                this.btnBowl.node.setPosition(0,-this.geth(15));
                this.resultText = "OR";
                this.titleText = "YOU WON THE TOSS.\nCHOOSE:";
            }else{
                Log.v('you have selected');
                if(Game.toss.batting){
                    this.titleText="You have won the toss and chosen to bat first.";
                    this.mainLabel.node.setPosition(0,this.geth(0));
                    this.btnBat.node.setContentSize(new cc.Size(this.getw(30),this.getw(30)));
                    this.btnBowl.node.destroy();
                    this.resultLabel.node.destroy();
                    this.btnBat.node.setPosition(0,this.geth(16));
                }else{
                    this.titleText="You have won the toss and chosen to bowl first.";
                    this.mainLabel.node.setPosition(0,0);
                    this.btnBat.node.destroy();
                    this.btnBowl.node.setPosition(0,this.geth(16));
                    this.btnBowl.node.setContentSize(new cc.Size(this.getw(30),this.getw(30)));
                }
            }
        }else{
            // this.titleText = Game.opponent.uname + " has won the toss";
            if(Game.toss.batting === null){
                Log.v('waiting for opponent choice');
                //this.resultText = "Please wait while opponent makes their choice";
                this.titleText = Game.opponent.uname + " HAS WON THE TOSS\nPLEASE WAIT";
                this.mainLabel.node.setPosition(0,0);

            }else{
                Log.v('opponent has chosen');
                //this.resultText = "Jelly pe kabhi fungus na lage";
                if(Game.toss.batting){
                    this.btnBowl = this.node.getChildByName('btnBowl').getComponent(cc.Button);
                    this.btnBowl.node.setContentSize(new cc.Size(this.getw(30),this.getw(30)));
                    this.btnBowl.node.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = this.bowlSpriteNormal;
                    this.btnBowl.node.getChildByName('Background').setContentSize(new cc.Size(this.getw(30),this.getw(30)));
                
                    this.titleText = Game.opponent.uname + " has won the toss and chosen to bowl.";
                    this.mainLabel.node.setPosition(0,0);
                    this.btnBowl.node.setPosition(0,this.geth(20));
                }else{
                    this.btnBat = this.node.getChildByName('btnBat').getComponent(cc.Button);
                    this.btnBat.normalSprite = this.batSpriteNormal;
                    this.btnBat.node.setContentSize(new cc.Size(this.getw(30),this.getw(30)));
                    this.btnBat.node.getChildByName('Background').getComponent(cc.Sprite).spriteFrame = this.batSpriteNormal;
                    this.btnBat.node.getChildByName('Background').setContentSize(new cc.Size(this.getw(30),this.getw(30)));
                    this.titleText = Game.opponent.uname + " has won the toss and chosen to bat.";
                    this.mainLabel.node.setPosition(0,0);
                    this.btnBat.node.setPosition(0,this.geth(15));
                }
            }
            Log.v(this.node);
        }
        this.mainLabel.string = this.titleText;
        this.resultLabel.string = this.resultText;

        //set messages
    }
    /*
    let n:cc.Node = new cc.Node();
                    let s:cc.Sprite = n.addComponent(cc.Sprite);
                    s.spriteFrame = this.bowlSpriteNormal;;
                    n.parent = this.node;
                    n.setContentSize(new cc.Size(this.getw(30),this.getw(30)));
                    n.setPosition(0,this.geth(15));
                    */

    onBtnBatClicked(e,data) {
        Log.v("Batting clicked");
        Log.v(data);
        Game.toss.selectTossOption(true);
        this.btnBowl.normalSprite=this.bowlSpriteDisabled;
        this.btnBat.node.setContentSize(new cc.Size(this.getw(50),this.getw(50)))
        this.btnBat.enabled=false
        this.btnBowl.enabled=false
    }   
    onBtnBowlClicked(e,data) {
        Log.v("Bowling clicked");
        Log.v(data);
        Game.toss.selectTossOption(false);
        this.btnBat.normalSprite=this.batSpriteDisabled;
        this.btnBowl.node.setContentSize(new cc.Size(this.getw(45),this.getw(45)))
        this.btnBat.enabled=false
        this.btnBowl.enabled=false
    }   

    onResized() {
        Log.v(this.node.name);
        const dsize = cc.view.getFrameSize();
        this.height = dsize.height;
        this.width = dsize.width;
        this.buildui();
        Log.v(dsize);
        //if h < w, no no no
        if(dsize.height<dsize.width){
            Log.e('Not portrait. Khelna cancel.')
            //todo: exit or message or redirect
        }
        //reload image
        var canvas:cc.Node = this.node;
        Log.v(canvas);

        // const scale = Math.max(mySize.width / deviceSize.width, mySize.height / deviceSize.height); 
        // this.node.setContentSize(deviceSize.width * scale, deviceSize.height * scale);
    }

    geth(p:number){
        return p*this.height/100;
    }

    getw(p:number){
        return p*this.width/100;
    }
}