const {ccclass, property} = cc._decorator;
import { Colu, R_STATEMAP } from "./colu";
import { geth, getw, Log, drawCurvedTopBg } from "./common";
import { Game, GAME_MAP } from "./Game";

@ccclass
export default class MatchMakeScreen extends cc.Component {
    @property
    height: number = 0;
    @property
    width: number = 0;
    @property(cc.SpriteFrame)
    greyBgSpriteFrame:cc.SpriteFrame=null

    @property
    percentWidthAvatar:number=0
    @property
    percentVertAlignGroundFromCenter:number=0

    // @property
    // matchMakingText: string = 'Jelly pe kabhi fungus na lage uska swaad kabhi bhankas na lage'
    @property
    percentVertAlignMmTextFromCenter:number=0

    @property
    percentWidthCancel:number=0
    @property
    percentVertAlignCancelFromCenter:number=0

    @property
    percentWidthWave:number=0
    @property
    percentVertAlignWaveFromCenter:number=0

    @property
    percentVertAlignTipboxFromCenter:number=0
    @property
    percentVertAlignTipTitFromTipTop:number=0
    @property
    percentVertAlignTipConFromTipTop:number=0
    @property
    percentWidthCricLogo:number=0
    // @property
    // percentWidthTipCon:number=0
    @property
    percentWidthSpaceTipLogoCon:number=0

    start () {
        Log.logToConsole = true;
        this.initui();
        this.onResized();
        if (cc.sys.isMobile) {
            window.addEventListener('resize', this.onResized.bind(this));
        } else {
            cc.view.on('canvas-resize', this.onResized, this);
        }

        //connect
        Colu.connect();
        Colu.joinOrCreate();
        //check if joined
        if(Colu.rState >= R_STATEMAP.CONNECTED){
            Log.v("connected to the socket");
            Game.init();
        }else{
            Log.v("there seems to be a problem connecting");
        }
    }

    tossScreenOpened:boolean = false;
    update (dt) {
        if(!this.tossScreenOpened){
            if(Colu.rState >= 0){
                // Log.v("Joined the room, navigating to toss");
                //navigate to toss screen
                if(Game.status === GAME_MAP.JOINED){
                    //join data has been received, show it on the screen
                    // Log.v("Acknowledged room joining data");
                    // Colu.sendMessage({event:"Yo mandu"});
                    cc.director.loadScene("TeamsDisplayScene")
                    this.tossScreenOpened = true
                }
                /*if(Game.status === GAME_MAP.TOSS_WAITING){
                    //toss data has been received, navigate
                    // Log.v(Game.user.players);
                    // Log.v(Game.opponent.players);
                    Log.v('Opening toss');
                    cc.director.loadScene("TossScene");
                    // cc.director.loadScene("SquadScene");
                    this.tossScreenOpened = true;
                }*/

            }/*else{
                // Log.v('opening toss screen anyway');
                // cc.director.loadScene("TossScene");
                // cc.director.loadScene("SquadScene");
                // this.tossScreenOpened = true;
            } */
            // cc.director.loadScene("TeamsDisplayScene");
            // this.tossScreenOpened = true;
        }
         //cc.director.loadScene("EndGameScene");
         //this.tossScreenOpened = true;
    }

    mmNodes:Map<string,cc.Node>=new Map<string,cc.Node>()
    nodeWidthList:Object

    initui() {
        let x:cc.Node
        this.mmNodes.set('ground',x=this.node.getChildByName('GreenGround'))
        this.mmNodes.set('avatar',x.getChildByName('CricAvatar'))
        this.mmNodes.set('mmtext',this.node.getChildByName('mainLabel'))
        this.mmNodes.set('cancel',this.node.getChildByName('CancelBtn'))
        this.mmNodes.set('wave',this.node.getChildByName('waveGraphicTilted'))
        this.mmNodes.set('tiptop',x=this.node.getChildByName('TipSection'))
        this.mmNodes.set('tiptit',x.getChildByName('TipHeading'))
        this.mmNodes.set('tipcon',x.getChildByName('TipContent'))
        this.mmNodes.set('tipicn',x.getChildByName('CricLogo'))
        // Log.v(this.mmNodes)
        this.nodeWidthList={
            'avatar': this.percentWidthAvatar,
            'ground': 100,
            'mmtext': 100,
            'cancel': this.percentWidthCancel,
            'wave': this.percentWidthWave,
            'tiptit': 100,
            'tipicn': this.percentWidthCricLogo,
            //'tipcon': this.percentWidthTipCon,
        }
    }

    buildui() {
        drawCurvedTopBg(this,5,5,this.greyBgSpriteFrame,2)

        // Position top items
        this.mmNodes.get("ground").setPosition(0,geth(this,this.percentVertAlignGroundFromCenter))
        this.mmNodes.get("mmtext").setPosition(0,geth(this,this.percentVertAlignMmTextFromCenter))
        this.mmNodes.get("cancel").setPosition(0,geth(this,this.percentVertAlignCancelFromCenter))
        this.mmNodes.get("wave").setPosition(0,geth(this,this.percentVertAlignWaveFromCenter))
        this.mmNodes.get("tiptop").setPosition(0,geth(this,this.percentVertAlignTipboxFromCenter))

        // Position tip items
        this.mmNodes.get("tiptit").setPosition(0,geth(this,this.percentVertAlignTipTitFromTipTop))
        let tcHeight=geth(this,this.percentVertAlignTipConFromTipTop)
        let tipconsz=this.mmNodes.get("tipcon").getContentSize()
        let halfRemWidth=(getw(this,100-this.percentWidthCricLogo-this.percentWidthSpaceTipLogoCon)-tipconsz.width)/2
        this.mmNodes.get("tipicn").setPosition(halfRemWidth+getw(this,-50+this.percentWidthCricLogo/2),tcHeight)
        this.mmNodes.get("tipcon").setPosition(halfRemWidth+getw(this,-50+this.percentWidthCricLogo+this.percentWidthSpaceTipLogoCon)+tipconsz.width/2,tcHeight)

        // Resize everything
        let node:cc.Node
        for(let name in this.nodeWidthList)
            if(node=this.mmNodes.get(name)) {
                let w=getw(this,this.nodeWidthList[name])
                //let r:any=node.getComponent(cc.Sprite)
                if(node.getComponent(cc.Sprite)) {
                    //r=r.spriteFrame.getOriginalSize()
                    let r:any=node.getContentSize()
                    r=r.height/r.width
                    // Log.v(`${name}: ${w} ${r}`)
                    node.setContentSize(w,r*w)
                    // Log.v(name+" "+node.getContentSize())
                }
                else
                    node.setContentSize(w,1000/*node.getContentSize().height*/)
            }

    }

    onResized() {
        Log.v(this.node.name);
        const dsize = cc.view.getFrameSize();
        this.height = dsize.height;
        this.width = dsize.width;
        Log.v(dsize);
        this.buildui();
        //if h < w, no no no
        if(dsize.height<dsize.width){
            Log.e('Not portrait. Khelna cancel.')
            //todo: exit or message or redirect
        }
        Log.v(this.node)
        // const scale = Math.max(mySize.width / deviceSize.width, mySize.height / deviceSize.height);
        // this.node.setContentSize(deviceSize.width * scale, deviceSize.height * scale);
    }

}
