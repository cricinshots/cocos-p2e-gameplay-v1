// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { drawCurvedTopBg, geth, getw, Log } from "./common";
import {Game, GAME_MAP} from "./Game";
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScreen extends cc.Component {

    @property
    height:number = 0;
    @property
    width:number = 0;


    @property(cc.SpriteFrame)
    greyBgSpriteFrame: cc.SpriteFrame = null;

    @property
    widthPercentEventNode:number=0

    @property
    widthPercentmyStatus:number=0

    @property
    widthPercentmyStatusBack:number=0

    @property
    widthPercentopponentStatus:number=0

    @property
    widthPercentopponentStatusBack:number=0

    @property
    myStatusYPercent:number=0

    @property
    myStatusBackYPercent:number=0

    @property
    opponentStatusYPercent:number=0

    @property
    opponentStatusBackYPercent:number=0

    @property
    myStatusXPercent:number=0

    @property
    myStatusBackXPercent:number=0

    @property
    opponentStatusXPercent:number=0

    @property
    opponentStatusBackXPercent:number=0

    @property
    eventNodeYPercent:number=0

    myScoreHolder:cc.Node = null;
    myScoreSpriteMask: cc.Node = null;
    opponentScoreHolder:cc.Node = null;
    opponentScoreSpriteMask: cc.Node = null;
    myScoreLabel:cc.Label = null;
    opponentScoreLabel: cc.Label = null;
    myNameHolder: cc.Node = null;
    opponentNameHolder: cc.Node = null;
    myNameMask: cc.Node = null;
    opponentNameMask: cc.Node = null;
    myNameLabel: cc.Label = null;
    opponentNameLabel: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    eventNodeWidth:number
    eventNodeYLower:number
    myStatuswidth:number
    myStatusYLower:number
    myStatusXRight:number
    myStatusBackwidth:number
    myStatusBackYLower:number
    myStatusBackXRight:number
    opponentStatuswidth:number
    opponentStatusYRaise:number
    opponentStatusXRight:number
    opponentStatusBackwidth:number
    opponentStatusBackYRaise:number
    opponentStatusBackXRight:number


    midLine:cc.Node = null;
    static renderedCards:Array<cc.Node>=[];
    myStatus: cc.Node = null;
    myStatusBack: cc.Node = null;
    opponentStatus: cc.Node = null;
    opponentStatusBack: cc.Node = null;
    start () {
        Log.logToConsole = true;
        for (let i = 0;i<4;i++){
            GameScreen.renderedCards.push(new cc.Node());
        }
        this.initui();
        this.onResized();

        if (cc.sys.isMobile) {
            window.addEventListener('resize', this.onResized.bind(this));
        } else {
            cc.view.on('canvas-resize', this.onResized, this);
        }
    }

    initui() {
        this.midLine = this.node.getChildByName('midline');
        //todo: add timer
        this.myScoreHolder = this.node.getChildByName('myScoreHolder');
        this.myScoreSpriteMask = this.node.getChildByName('myScoreMask');
        this.opponentScoreHolder = this.node.getChildByName('opponentScoreHolder');
        this.opponentScoreSpriteMask = this.node.getChildByName('opponentScoreMask');
        this.myScoreLabel = this.node.getChildByName('myScoreLabel').getComponent(cc.Label);
        this.opponentScoreLabel = this.node.getChildByName('opponentScoreLabel').getComponent(cc.Label);
        //kick names, take ass
        //this.myStatus=this.myScoreHolder.getChildByName('myStatus')
        this.myStatus=this.node.getChildByName('myStatus')
        this.myStatusBack=this.node.getChildByName('myStatusBack')
        this.opponentStatus=this.node.getChildByName('opponentStatus')
        this.opponentStatusBack=this.node.getChildByName('opponentStatusBack')
        //this.opponentStatus=this.opponentScoreHolder.getChildByName('opponentStatus')
        this.myNameHolder = this.node.getChildByName('myNameHolder');
        this.myNameMask = this.node.getChildByName('myNameMask');
        this.opponentNameHolder = this.node.getChildByName('opponentNameHolder');
        this.opponentNameMask = this.node.getChildByName('opponentNameMask');
        this.myNameLabel = this.node.getChildByName('myNameLabel').getComponent(cc.Label);
        this.opponentNameLabel = this.node.getChildByName('opponentNameLabel').getComponent(cc.Label);
        this.showInningChange(false)
        this.showRunsMade(false)
    }

    buildui() {
        // drawCurvedTopBg(this,0,5,this.greyBgSpriteFrame,2);
        // let n1:cc.Node = this.getCardNode(getw(this, 22), "playCard","1",true,"https://cricinshots.com/assets/cards/carder.php");
        if(this.opponentScoreLabel == null) return;
        //position
        let scoreRectangleWidth = getw(this, 20);
        let scoreRectangleHeight = geth(this,10);

        this.myScoreHolder.setPosition(getw(this,50),geth(this,25));
        this.opponentScoreHolder.setPosition(getw(this,50),geth(this,0));
        this.myScoreSpriteMask.setPosition(getw(this,50)-scoreRectangleWidth, scoreRectangleHeight+geth(this,15));
        this.opponentScoreSpriteMask.setPosition(getw(this,50)-scoreRectangleWidth, -scoreRectangleHeight+geth(this,10));

        this.myScoreLabel.node.setPosition(getw(this,50)-getw(this,5), scoreRectangleHeight+geth(this,15));
        this.opponentScoreLabel.node.setPosition(getw(this,50)-getw(this,5), -scoreRectangleHeight+geth(this,10));

        let nameRectangleWidth = getw(this, 40);
        let nameRectangleHeight = geth(this,5);

        this.myNameHolder.setPosition(getw(this,50),-geth(this,40));
        this.opponentNameHolder.setPosition(-getw(this,50),geth(this,40));
        this.myNameMask.setPosition(getw(this,50)-nameRectangleWidth, -geth(this,40));
        this.opponentNameMask.setPosition(-getw(this,50)+nameRectangleWidth, geth(this,40));

        this.myNameLabel.node.setPosition(geth(this,50)-nameRectangleWidth*2.3 - getw(this,5),-geth(this,40));
        this.opponentNameLabel.node.setPosition(-getw(this,50)+getw(this,5),geth(this,40));

        //resize
        this.myScoreHolder.setContentSize(new cc.Size(scoreRectangleWidth,scoreRectangleHeight));
        this.opponentScoreHolder.setContentSize(new cc.Size(scoreRectangleWidth,scoreRectangleHeight));

        //this.myStatus.setContentSize(new cc.Size(scoreRectangleWidth,scoreRectangleHeight));
        //this.opponentStatus.setContentSize(new cc.Size(scoreRectangleWidth,scoreRectangleHeight));

        this.myScoreSpriteMask.setContentSize(new cc.Size(scoreRectangleHeight,scoreRectangleHeight));
        this.opponentScoreSpriteMask.setContentSize(new cc.Size(scoreRectangleHeight,scoreRectangleHeight));
        this.myScoreSpriteMask.getChildByName('myScoreSprite').setContentSize(new cc.Size(scoreRectangleHeight,scoreRectangleHeight));
        this.opponentScoreSpriteMask.getChildByName('opponentScoreSprite').setContentSize(new cc.Size(scoreRectangleHeight,scoreRectangleHeight));

        this.myScoreLabel.node.setContentSize(new cc.Size(scoreRectangleWidth-getw(this,2.5),scoreRectangleHeight));
        this.opponentScoreLabel.node.setContentSize(new cc.Size(scoreRectangleWidth-getw(this,2.5),scoreRectangleHeight));

        //kick names, take ass
        this.myNameHolder.setContentSize(new cc.Size(nameRectangleWidth,nameRectangleHeight));
        this.opponentNameHolder.setContentSize(new cc.Size(nameRectangleWidth,nameRectangleHeight));

        this.myNameMask.setContentSize(new cc.Size(nameRectangleHeight,nameRectangleHeight));
        this.opponentNameMask.setContentSize(new cc.Size(nameRectangleHeight,nameRectangleHeight));
        this.myNameMask.getChildByName('sprite').setContentSize(new cc.Size(nameRectangleWidth,nameRectangleHeight));
        this.opponentNameMask.getChildByName('sprite').setContentSize(new cc.Size(nameRectangleWidth,nameRectangleHeight));

        this.myNameLabel.node.setContentSize(new cc.Size(nameRectangleWidth-getw(this,2.5),nameRectangleHeight/1.7));
        this.opponentNameLabel.node.setContentSize(new cc.Size(nameRectangleWidth-getw(this,2.5),nameRectangleHeight/1.7));

        //Setting myStatus
        this.myStatuswidth=getw(this,this.widthPercentmyStatus)
        this.myStatusYLower=-getw(this,50-this.myStatusYPercent)
        this.myStatusXRight=getw(this,this.myStatusXPercent)
        let origRatioMyStatus:any=this.myStatus.getContentSize()
        origRatioMyStatus=origRatioMyStatus.height/origRatioMyStatus.width
        this.myStatus.setContentSize(this.myStatuswidth,origRatioMyStatus*this.myStatuswidth)
        this.myStatus.setPosition(this.myStatusXRight,this.myStatusYLower)
        this.myStatus.zIndex=cc.macro.MAX_ZINDEX

        //Setting myStatusBack
        this.myStatusBackwidth=getw(this,this.widthPercentmyStatusBack)
        this.myStatusBackYLower=-getw(this,50-this.myStatusBackYPercent)
        this.myStatusBackXRight=getw(this,this.myStatusBackXPercent)
        let origRatioMyStatusBack:any=this.myStatusBack.getContentSize()
        origRatioMyStatusBack=origRatioMyStatusBack.height/origRatioMyStatusBack.width
        this.myStatusBack.setContentSize(this.myStatusBackwidth,origRatioMyStatusBack*this.myStatusBackwidth)
        this.myStatusBack.setPosition(this.myStatusBackXRight,this.myStatusBackYLower)

        //Setting OpponentStatus
        this.opponentStatuswidth=getw(this,this.widthPercentopponentStatus)
        this.opponentStatusYRaise=-getw(this,50-this.opponentStatusYPercent)
        this.opponentStatusXRight=getw(this,this.opponentStatusXPercent)
        let origRatioOpponentStatus:any=this.opponentStatus.getContentSize()
        origRatioOpponentStatus=origRatioOpponentStatus.height/origRatioOpponentStatus.width
        this.opponentStatus.setContentSize(this.opponentStatuswidth,origRatioOpponentStatus*this.opponentStatuswidth)
        this.opponentStatus.setPosition(this.opponentStatusXRight,this.opponentStatusYRaise)
        this.opponentStatus.zIndex=cc.macro.MAX_ZINDEX


        //Setting OpponentStatusBack
        this.opponentStatusBackwidth=getw(this,this.widthPercentopponentStatusBack)
        this.opponentStatusBackYRaise=-getw(this,50-this.opponentStatusBackYPercent)
        this.opponentStatusBackXRight=getw(this,this.opponentStatusBackXPercent)
        let origRatioOpponentStatusBack:any=this.opponentStatusBack.getContentSize()
        origRatioOpponentStatusBack=origRatioOpponentStatusBack.height/origRatioOpponentStatusBack.width
        this.opponentStatusBack.setContentSize(this.opponentStatusBackwidth,origRatioOpponentStatusBack*this.opponentStatusBackwidth)
        this.opponentStatusBack.setPosition(this.opponentStatusBackXRight,this.opponentStatusBackYRaise)


        Log.v(this.node);
        this.setNames();
        this.setScore();
        this.renderAllCards();
    }

    setNames() {
        this.myNameLabel.string = Game.user.uname;
        this.opponentNameLabel.string = Game.opponent.uname;
    }

    renderAllCards() {
        try{
            GameScreen.renderedCards.forEach((card:cc.Node)=>{
                card.destroy();
            });
        }catch(e){}

        for (let i:number=0;i<4;i++) {
            try{
                this.node.getChildByName("card slot "+i.toString()).destroy();
            }catch(e){}
        }

        GameScreen.renderedCards = [];
        for (let i = 0;i<4;i++){
            GameScreen.renderedCards.push(new cc.Node());
        }
        Log.v('rendering all cards');
        for(let i:number=0;i<Game.turn.cards.length;i++) {
            let card:cc.Node = this.getCardNode(this.bottomCardWidthPercent,"playCard",
            i.toString(),true,Game.turn.cards[i]['cardurl']);
            this.renderBottomCard(i+1,card);
        }
    }

    setScore() {
        this.myScoreLabel.string = Game.opponentScore.toString();
        this.opponentScoreLabel.string = Game.myScore.toString();
    }

    getCardNode(width:number, eventHandlerName:string, eventHandlerData:string,
        attachHandler:boolean, imageUrl:string) {
        //loads image from url and returns card
        let lnode1:cc.Node = new cc.Node("card slot "+eventHandlerData);
        lnode1.setAnchorPoint(0,0.5);

        var sprite2 = lnode1.addComponent(cc.Sprite);
        sprite2.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite2.type = cc.Sprite.Type.SIMPLE;
        sprite2.srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
        sprite2.dstBlendFactor = cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA;

        //180x260
        lnode1.parent = this.node;
        this.loadSpriteIntoFrame(lnode1, imageUrl);

        if(attachHandler){
            Log.v("attaching handler");
            //todo: test - I feel not setting button sprites can cause a problem
            let button:cc.Button = lnode1.addComponent(cc.Button);
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "GameScreen";  // This is the code file name
            clickEventHandler.handler = eventHandlerName;
            clickEventHandler.customEventData = eventHandlerData;
            button.clickEvents = [clickEventHandler];
        }
        //todo: unspam
        return lnode1;
    }

    readonly bottomCardWidthPercent = 23;
    renderBottomCard(slot:number, card:cc.Node) {

        //render
        let w:number = getw(this,this.bottomCardWidthPercent);

        // slot is a number from 1 to 4
        let startx = -getw(this,50)-w;
        let space = getw(this,1.8);
        let y = -geth(this,33);

        if(this.width/this.height < 16/9){
            //this is a slightly wider screen
            Log.v('making adjustments for wider screen')
            w = getw(this,this.bottomCardWidthPercent)*0.8;
            space = getw(this,4);
            let y = -geth(this,40);

        }

        //calculate total width and centre align
        let tw = 4*w + 4*space;
        startx = -tw/2-w-space/2;

        card.setAnchorPoint(0,0);
        card.setContentSize(new cc.Size(w,1.44*w));
        card.setPosition((startx)+(space*slot)+w*slot,y);
        GameScreen.renderedCards[slot-1] = card;
        Log.v(GameScreen.renderedCards);
        Log.v("rendered card for slot "+slot.toString());
        Log.v(card);
    }

    loadSpriteIntoFrame(node:cc.Node, url:string) {
        cc.assetManager.loadRemote<cc.Texture2D>(url ,{ext:'.png'}, (err,asset)=>{
            if(err)
                return Log.e(`Could't load image for player ${url}: ${err.message}`)

            Log.v(`placing image`);
            //very expensive
            let sprite:cc.Sprite = node.getComponent(cc.Sprite);
            sprite.spriteFrame = new cc.SpriteFrame(asset);
        });
    }
    oldMyNode:cc.Node =new cc.Node();
    oldOpponentNode:cc.Node =new cc.Node();

    showMyCard() {
        if(this.lastOutcomeShown == Game.turn.outcomeId) {
            return;
        }

        let n1:cc.Node = this.getCardNode(40/1.44,"","",false,Game.turn.outcomeMyCard['cardurl']);
        //place it
        n1.setAnchorPoint(0.5,1);
        n1.setPosition(0,geth(this, 7));
        n1.setContentSize(new cc.Size(geth(this,21)/1.44,geth(this,21)));
        this.oldMyNode= n1;
        this.lastOutcomeShown = Game.turn.outcomeId;
    }

    showOpponentCard() {
        // this.oldOpponentNode.destroy();
        let n1:cc.Node = this.getCardNode(40/1.44,"","",false,Game.turn.outcomeOpponentCard['cardurl']);
        //place it
        n1.setAnchorPoint(0.5,1);
        n1.setPosition(0,geth(this, 35));
        n1.setContentSize(new cc.Size(geth(this,21)/1.44,geth(this,21)));
        this.oldOpponentNode = n1;
    }

    playCard(e,index) {
        //TODO: check this
        let i = parseInt(index);
        Log.v("playing card "+index.toString());
        Log.v(Game.turn.cards[i]);
        Game.turn.playCard(i);
        //remove that card
        GameScreen.renderedCards[i].destroy();
        // delete(GameScreen.renderedCards[i]);
        GameScreen.renderedCards[i]=null;
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

    readonly updateFreq:number = 1;
    lastUpdate:number =0;
    lastOutcomeShown:number = -2;



    innings2:boolean = false;
    gameComplete = false;
    shownInningsChange=false
    showRunsChange=false
    update (dt) {
        if(this.gameComplete) return;
        this.lastUpdate += dt;
        if(Game.turn.id < 0) return;
        if(this.lastUpdate<this.updateFreq)
            return;
        this.lastUpdate=0;
        //check for event change
        if(Game.status<GAME_MAP.GAME_ROUND_1) return;
        this.setScore();
        if(Game.status >= GAME_MAP.GAME_COMEPLETE){
            cc.director.loadScene("EndGameScene");
            this.gameComplete = true;
        }
        
        //Should the next if be moved in Game.turn.isResultShowing()???????
        if(!this.shownInningsChange && Game.status===GAME_MAP.GAME_WAIT_ROUND && !this.innings2) {
            setTimeout(this.showInningChange,1,true)
            setTimeout(this.showInningChange,2000,false)
            return this.shownInningsChange=true
        }
        if(Game.status == GAME_MAP.GAME_ROUND_2 && !this.innings2){
            this.renderAllCards();
            //this.showRunsChange=false
            this.innings2=true;
        }

        if(Game.turn.isResultShowing()){
            //means result of last turn is showing
            //todo: in future, we will have to animate the first time and just keep showing the second time.
            //more state variables will be required
            if(!this.showRunsChange){
                setTimeout(this.showRunsMade,1,true)
                setTimeout(this.showRunsMade,3000,false)
                this.showRunsChange=true;
            }
            if(this.lastOutcomeShown != Game.turn.outcomeId){
                this.showMyCard();
                this.showOpponentCard();
            }
        }else{
            try{
                this.oldMyNode.destroy();
                this.oldOpponentNode.destroy();
            }catch(e){}
            //player gotta play
            //show 4 cards
            //check if a new card needs to be added
            // if(Game.turn.emptyCardInList) {

                let emptyCardsIndices = Game.turn.getEmptyIndices2(GameScreen.renderedCards);
                if(emptyCardsIndices.length>0)
                    Log.v(`found empty cards. rendering them ${emptyCardsIndices.toString()}`);
                Log.v("Before rendering new card:");
                Log.v(Game.turn.cards);
                emptyCardsIndices.forEach((i)=>{
                    //create the card to render
                    let card:cc.Node = this.getCardNode(this.bottomCardWidthPercent,"playCard",
                        i.toString(),true,Game.turn.cards[i]['cardurl']);
                    this.renderBottomCard(i+1,card);
                });
                this.showRunsChange=false
            // }
        }
    }

    showRunsMade=(show:boolean=false)=>{
        let node=this.node.getChildByName("RunsChange")
        let commentaryLabel=node.getChildByName("CommentaryLabel").getComponent(cc.Label)
        
        if(!node) return

        if(show){
            node.active=true
            node.zIndex=cc.macro.MAX_ZINDEX
            this.eventNodeWidth=getw(this,this.widthPercentEventNode)
            this.eventNodeYLower=-getw(this,50-this.eventNodeYPercent)
            let origRatioeventNode:any=node.getContentSize()
            origRatioeventNode=origRatioeventNode.height/origRatioeventNode.width
            node.setContentSize(this.eventNodeWidth,origRatioeventNode*this.eventNodeWidth)
            node.setPosition(0,this.eventNodeYLower)
            commentaryLabel.string=Game.turn.outcomeCommentary
        }
        else {
            //node.setContentSize(0,0)
            node.zIndex=cc.macro.MIN_ZINDEX
            node.active=false
        }
    }

    showInningChange = (show:boolean=false) => {
        let node=this.node.getChildByName("InningsChange")
        if(!node) return

        if(show) {
            node.active=true
            node.zIndex=cc.macro.MAX_ZINDEX
            node.setContentSize(getw(this,100),geth(this,100))
        }
        else {
            node.setContentSize(0,0)
            node.zIndex=cc.macro.MIN_ZINDEX
            node.active=false
        }
    }

    updateTurnTimer() {

    }
}
