import { drawCurvedTopBg, geth, getw, Log } from "./common";
import {Game, GAME_MAP} from "./Game";
const {ccclass, property} = cc._decorator;



/*@ccclass
export default class NewClass extends cc.Component {

    @property
    height:number = 0;
    @property
    width:number = 0;

    @property(cc.SpriteFrame)
    aWin: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    aLose: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    hWin: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    hLose: cc.SpriteFrame = null;

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

    initui(){

    }

    buildui(){
        //Check which user
        let gameScore:string=Game.myScore.toString();
        // if(Game.won) {
        //     gameScore = Game.myScore.toString();
        // }else{
        //     gameScore = Game.opponentScore.toString();
        // }
        let scoreShow=this.node.getChildByName('ScoreLabel').getComponent(cc.Label);
        scoreShow.node.setPosition(0,geth(this, 6.5));
        scoreShow.string=gameScore;
        // let backaWon=this.node.getChildByName('Background').getComponent(cc.Sprite).spriteFrame=this.aWin;
        if(Game.user.uname.toLowerCase()[0]=='a'){
            if(Game.won){
                let backaWon=this.node.getChildByName('Background').getComponent(cc.Sprite).spriteFrame=this.aWin;
            }else{
                let backaLose=this.node.getChildByName('Background').getComponent(cc.Sprite).spriteFrame=this.aLose;
            }
        }else{
            if(Game.won){
                let backhWon=this.node.getChildByName('Background').getComponent(cc.Sprite).spriteFrame=this.hWin;
            }else{
                let backhLose=this.node.getChildByName('Background').getComponent(cc.Sprite).spriteFrame=this.hLose;
            }
        }
        this.node.getChildByName('Background').setContentSize(new cc.Size(getw(this, 100),geth(this,100)));
    }

    

    
}*/

@ccclass
export default class NewClass extends cc.Component {
    @property
    height:number = 0;
    @property
    width:number = 0;

    @property
    widthPercentVictory:number=0

    @property
    widthPercentLossMessage:number=0

    @property
    widthPercentWinMessage:number=0

    @property
    widthPercentScoreNode:number=0

    @property
    widthPercentTempNode:number=0

    @property
    widthPercentSmallRect:number=0

    @property
    widthPercentChest:number=0

    @property
    widthPercentCoin:number=0

    @property
    widthPercentBackgroundRect:number=0

    @property
    widthPercentExitButton:number=0

    @property
    widthPercentTrophyNode:number=0

    @property
    widthPercentUserWon:number=0

    @property
    widthPercentScoreShow:number=0

    @property
    widthPercentCoinShow:number=0

    @property
    victoryYPercent:number=0

    @property
    smallRectYPercent:number=0

    @property
    trophyYPercent:number=0

    @property
    winmessageYPercent:number=0

    //@property
    //lossmessageYPercent:number=0

    @property
    exitYPercent:number=0

    @property
    chestYPercent:number=0

    @property
    coinYPercent:number=0

    @property
    exitXPercent:number=0

    @property
    coinXPercent:number=0

    @property
    userWonXPercent:number=0

    @property
    scoreNodeYPercent:number=0

    @property
    tempNodeYPercent:number=0

    @property
    userWonYPercent:number=0

    @property
    scoreShowYPercent:number=0

    @property
    coinShowYPercent:number=0
    

    VictoryNode:cc.Node = null;
    DefeatNode:cc.Node = null;
    SmallRect:cc.Node = null;
    TrophyNode:cc.Node = null;
    background:cc.Node = null;
    ExitButton:cc.Node = null;
    PlayAgainButton:cc.Node = null;
    WinMessage:cc.Node = null;
    LossMessage:cc.Node = null;
    ChestNode:cc.Node = null;
    CoinNode:cc.Node = null;
    ScoreNode:cc.Node = null;
    scoreShow:cc.Node = null;
    UserWon:cc.Node = null;
    coinShow:cc.Node = null;
    TempNode:cc.Node = null;

    winmessagewidth:number
    victorywidth:number
    victoryYRaise:number
    smallRectYRaise:number
    trophyYRaise:number
    smallRectwidth:number
    backgroundRectWidth:number
    exitwidth:number
    scorenodewidth:number
    tempnodewidth:number
    exitYLower:number
    exitXLeft:number
    playagainYLower:number
    playagainXRight:number
    winmessageYLower:number
    lossMessagewidth:number
    lossMessageYLower:number
    chestYLower:number
    chestwidth:number
    coinYLower:number
    coinwidth:number
    coinXLeft:number
    scoreNodeYLower:number
    UserWonYLower:number
    UserWonwidth:number
    UserWonXRight:number
    scoreShowwidth:number
    scoreShowYLower:number
    coinShowwidth:number
    coinShowYLower:number
    coinShowXLeft:number
    trophywidth:number
    tempNodeYLower:number

    start() {
        Log.logToConsole = true;
        if(Game.status < GAME_MAP.TOSS_WAITING){
            //something's wrong
            //todo: take back to matchmaking?
            Log.e("Somethings wrong. Game status: "+Game.status.toString());
        }
        // window.self = '';
        // window.regeneratorRuntime = '';
        this.initui();
        this.onResized();
        if (cc.sys.isMobile) {
            window.addEventListener('resize', this.onResized.bind(this));
        } else {
            cc.view.on('canvas-resize', this.onResized, this);
        } 
    }
    
    nextScreenOpened:boolean=false
    myDataLoaded=false
    oppDataLoaded=false
    update (dt) {
        
    }

    initui(){

    }

    buildui(){
        this.doTheMath();
        this.positionAllComponents();
    }
    demoGameWon:number=1
    demoGamemyScore:string='100'
    demoGameCoinScore:string='200'
    demoString:string='Press BACK to return to Dashboard!'
    positionAllComponents(){
        this.SmallRect=this.node.getChildByName('ScoreRect')
        this.DefeatNode=this.node.getChildByName('DefeatNode')
        this.VictoryNode=this.node.getChildByName('VictoryNode')
        this.TrophyNode=this.node.getChildByName('TrophyNode')
        this.background=this.node.getChildByName('BackgroundRect')
        this.ExitButton=this.node.getChildByName('ExitButton')
        this.PlayAgainButton=this.node.getChildByName('PlayAgainButton')
        this.WinMessage=this.node.getChildByName('WonMessage')
        this.LossMessage=this.node.getChildByName('LossMessage')
        this.ChestNode=this.node.getChildByName('ChestNode')
        this.CoinNode=this.node.getChildByName('CoinNode')
        this.ScoreNode=this.node.getChildByName('ScoreNode')
        this.UserWon=this.node.getChildByName('UserWinNode')
        this.scoreShow=this.node.getChildByName('ScoreLabel1')
        this.coinShow=this.node.getChildByName('CoinLabel')
        this.TempNode=this.node.getChildByName('TempNode')
        let coinScore:number=/*Game.myCoins.toString();*/Game.winner['gold']
        
        let gameScore:string=Game.myScore.toString();//this.demoGamemyScore
        let tempstring:string=this.demoString
        if(Game.won){       //TOUNDO:Replace with Game.won
            //Setting Victory Frame
            let origRatioVictory:any=this.VictoryNode.getContentSize()
            origRatioVictory=origRatioVictory.height/origRatioVictory.width
            this.VictoryNode.setContentSize(this.victorywidth,origRatioVictory*this.victorywidth)
            this.VictoryNode.setPosition(0,this.victoryYRaise)
            //Setting Defeat Node Size to zero
            this.DefeatNode.setContentSize(0,0)
            //Setting Small Rectangle
            let origRatioSmallRect:any=this.SmallRect.getContentSize()
            origRatioSmallRect=origRatioSmallRect.height/origRatioSmallRect.width
            this.SmallRect.setContentSize(this.smallRectwidth,origRatioSmallRect*this.smallRectwidth)
            this.SmallRect.setPosition(0,this.smallRectYRaise)
            //Setting Background
            let origRatioBackRect:any=this.background.getContentSize()
            origRatioBackRect=origRatioBackRect.height/origRatioBackRect.width
            this.background.setContentSize(this.backgroundRectWidth,origRatioBackRect*this.backgroundRectWidth)
            //Setting Trophy Node
            let origRatioTrophyNode:any=this.TrophyNode.getContentSize()
            origRatioTrophyNode=origRatioTrophyNode.height/origRatioTrophyNode.width
            this.TrophyNode.setContentSize(this.trophywidth,origRatioTrophyNode*this.trophywidth)
            this.TrophyNode.setPosition(0,this.trophyYRaise)
            //Setting Exit Button
            //let origRatioExitButton:any=this.ExitButton.getContentSize()
            //origRatioExitButton=origRatioExitButton.height/origRatioExitButton.width
            //this.ExitButton.setContentSize(this.exitwidth,origRatioExitButton*this.exitwidth)
            //this.ExitButton.setPosition(this.exitXLeft,this.exitYLower)
            this.ExitButton.setContentSize(0,0)
            //Setting Play Again Button
            //let origRatioPlayAgainButton:any=this.PlayAgainButton.getContentSize()
            //origRatioPlayAgainButton=origRatioPlayAgainButton.height/origRatioPlayAgainButton.width
            //this.PlayAgainButton.setContentSize(this.exitwidth,origRatioPlayAgainButton*this.exitwidth)
            //this.PlayAgainButton.setPosition(this.playagainXRight,this.playagainYLower)
            this.PlayAgainButton.setContentSize(0,0)
            //Setting Win Message
            let origRatioWinMessage:any=this.WinMessage.getContentSize()
            origRatioWinMessage=origRatioWinMessage.height/origRatioWinMessage.width
            this.WinMessage.setContentSize(this.winmessagewidth,origRatioWinMessage*this.winmessagewidth)
            this.WinMessage.setPosition(0,this.winmessageYLower)
            //Setting size of LossMessage to 0
            this.LossMessage.setContentSize(0,0)
            //Setting Chest Node
            let origRatioChest:any=this.ChestNode.getContentSize()
            origRatioChest=origRatioChest.height/origRatioChest.width
            this.ChestNode.setContentSize(this.chestwidth,origRatioChest*this.chestwidth)
            this.ChestNode.setPosition(0,this.chestYLower)
            //Setting Coin Node
            let origRatioCoin:any=this.CoinNode.getContentSize()
            origRatioCoin=origRatioCoin.height/origRatioCoin.width
            this.CoinNode.setContentSize(this.coinwidth,origRatioCoin*this.coinwidth)
            this.CoinNode.setPosition(this.coinXLeft,this.coinYLower)
            //Setting Score Node
            let origRatioScoreNode:any=this.ScoreNode.getContentSize()
            origRatioScoreNode=origRatioScoreNode.height/origRatioScoreNode.width
            this.ScoreNode.setContentSize(this.scorenodewidth,origRatioScoreNode*this.scorenodewidth)
            this.ScoreNode.setPosition(0,this.scoreNodeYLower)
            //Setting User Win Node
            /*let origRatioUserWon:any=this.UserWon.getContentSize()
            origRatioUserWon=origRatioUserWon.height/origRatioUserWon.width
            this.UserWon.setContentSize(this.UserWonwidth,origRatioUserWon*this.UserWonwidth)
            this.UserWon.setPosition(this.UserWonXRight,this.UserWonYLower)*/
            this.UserWon.setContentSize(0,0)
            //Setting Score Label
            let scoreValue=this.scoreShow.getComponent(cc.RichText)
            let origRatioScoreValue:any=this.scoreShow.getContentSize()
            origRatioScoreValue=origRatioScoreValue.height/origRatioScoreValue.width
            this.scoreShow.setContentSize(this.scoreShowwidth,origRatioScoreValue*this.scoreShowwidth)
            this.scoreShow.setPosition(0,this.scoreShowYLower)
            scoreValue.string=gameScore;
            //Setting Coin Label
            let coinValue=this.coinShow.getComponent(cc.RichText)
            let origRatioCoinValue:any=this.coinShow.getContentSize()
            origRatioCoinValue=origRatioCoinValue.height/origRatioCoinValue.width
            this.coinShow.setContentSize(this.coinShowwidth,origRatioCoinValue*this.coinShowwidth)
            this.coinShow.setPosition(this.coinShowXLeft,this.coinShowYLower)
            Log.v(coinScore)
            coinValue.string=coinScore.toString();
            //Setting Temp Node
            let tempValue=this.TempNode.getComponent(cc.RichText)
            let origRatiotempValue:any=this.coinShow.getContentSize()
            origRatiotempValue=origRatiotempValue.height/origRatiotempValue.width
            this.TempNode.setContentSize(this.tempnodewidth,origRatiotempValue*this.tempnodewidth)
            this.TempNode.setPosition(0,this.tempNodeYLower)
            tempValue.string=tempstring;
        }else{
            //Setting Victory Node size to zero
            let coinscore1:number=Game.loser['gold']
            this.VictoryNode.setContentSize(0,0)
            //Setting Defeat Node
            let origRatioDefeat:any=this.DefeatNode.getContentSize()
            origRatioDefeat=origRatioDefeat.height/origRatioDefeat.width
            this.DefeatNode.setContentSize(this.victorywidth,origRatioDefeat*this.victorywidth)
            this.DefeatNode.setPosition(0,this.victoryYRaise)
            //Setting Small Rectangle
            let origRatioSmallRect:any=this.SmallRect.getContentSize()
            origRatioSmallRect=origRatioSmallRect.height/origRatioSmallRect.width
            this.SmallRect.setContentSize(this.smallRectwidth,origRatioSmallRect*this.smallRectwidth)
            this.SmallRect.setPosition(0,this.smallRectYRaise)
            //Setting Background
            let origRatioBackRect:any=this.background.getContentSize()
            origRatioBackRect=origRatioBackRect.height/origRatioBackRect.width
            this.background.setContentSize(this.backgroundRectWidth,origRatioBackRect*this.backgroundRectWidth)
            //Setting Trophy Node
            let origRatioTrophyNode:any=this.TrophyNode.getContentSize()
            origRatioTrophyNode=origRatioTrophyNode.height/origRatioTrophyNode.width
            this.TrophyNode.setContentSize(this.trophywidth,origRatioTrophyNode*this.trophywidth)
            this.TrophyNode.setPosition(0,this.trophyYRaise)
            //Setting Exit Button
            //let origRatioExitButton:any=this.ExitButton.getContentSize()
            //origRatioExitButton=origRatioExitButton.height/origRatioExitButton.width
            //this.ExitButton.setContentSize(this.exitwidth,origRatioExitButton*this.exitwidth)
            //this.ExitButton.setPosition(this.exitXLeft,this.exitYLower)
            this.ExitButton.setContentSize(0,0)
            //Setting Play Again Button
            //let origRatioPlayAgainButton:any=this.PlayAgainButton.getContentSize()
            //origRatioPlayAgainButton=origRatioPlayAgainButton.height/origRatioPlayAgainButton.width
            //this.PlayAgainButton.setContentSize(this.exitwidth,origRatioPlayAgainButton*this.exitwidth)
            //this.PlayAgainButton.setPosition(this.playagainXRight,this.playagainYLower)
            this.PlayAgainButton.setContentSize(0,0)
            //Setting Better Luck next time Message
            let origRatioBetterLuckMessage:any=this.LossMessage.getContentSize()
            origRatioBetterLuckMessage=origRatioBetterLuckMessage.height/origRatioBetterLuckMessage.width
            this.LossMessage.setContentSize(this.lossMessagewidth,origRatioBetterLuckMessage*this.lossMessagewidth)
            this.LossMessage.setPosition(0,this.winmessageYLower)
            //Setting size of win Message to 0
            this.WinMessage.setContentSize(0,0)
            //Setting Chest Node sizee to 0
            this.ChestNode.setContentSize(0,0)
            //Setting Coin Node
            let origRatioCoin:any=this.CoinNode.getContentSize()
            origRatioCoin=origRatioCoin.height/origRatioCoin.width
            this.CoinNode.setContentSize(this.coinwidth,origRatioCoin*this.coinwidth)
            this.CoinNode.setPosition(this.coinXLeft,this.coinYLower)
            //Setting Score Node
            let origRatioScoreNode:any=this.ScoreNode.getContentSize()
            origRatioScoreNode=origRatioScoreNode.height/origRatioScoreNode.width
            this.ScoreNode.setContentSize(this.scorenodewidth,origRatioScoreNode*this.scorenodewidth)
            this.ScoreNode.setPosition(0,this.scoreNodeYLower)
            //Setting User Win Node size to 0
            this.UserWon.setContentSize(0,0)
            //Setting Score Label
            let scoreValue=this.scoreShow.getComponent(cc.RichText)
            let origRatioScoreValue:any=this.scoreShow.getContentSize()
            origRatioScoreValue=origRatioScoreValue.height/origRatioScoreValue.width
            this.scoreShow.setContentSize(this.scoreShowwidth,origRatioScoreValue*this.scoreShowwidth)
            this.scoreShow.setPosition(0,this.scoreShowYLower)
            scoreValue.string=gameScore;
            //Setting Coin Label
            let coinValue=this.coinShow.getComponent(cc.RichText)
            let origRatioCoinValue:any=this.coinShow.getContentSize()
            origRatioCoinValue=origRatioCoinValue.height/origRatioCoinValue.width
            this.coinShow.setContentSize(this.coinShowwidth,origRatioCoinValue*this.coinShowwidth)
            this.coinShow.setPosition(this.coinShowXLeft,this.coinShowYLower)
            coinValue.string=coinscore1.toString();
            //Setting Temp Node
            let tempValue=this.TempNode.getComponent(cc.RichText)
            let origRatiotempValue:any=this.coinShow.getContentSize()
            origRatiotempValue=origRatiotempValue.height/origRatiotempValue.width
            this.TempNode.setContentSize(this.tempnodewidth,origRatiotempValue*this.tempnodewidth)
            this.TempNode.setPosition(0,this.tempNodeYLower)
            tempValue.string=tempstring;
        }
    }

    doTheMath(){
        this.tempnodewidth=getw(this,this.widthPercentTempNode)//To remove
        this.scorenodewidth=getw(this,this.widthPercentScoreNode)
        this.trophywidth=getw(this,this.widthPercentTrophyNode)
        this.scoreShowwidth=getw(this,this.widthPercentScoreShow)
        this.coinShowwidth=getw(this,this.widthPercentCoinShow)
        this.UserWonwidth=getw(this,this.widthPercentUserWon)
        this.winmessagewidth=getw(this,this.widthPercentWinMessage)
        this.chestwidth=getw(this,this.widthPercentChest)
        this.coinwidth=getw(this,this.widthPercentCoin)
        this.lossMessagewidth=getw(this,this.widthPercentLossMessage)
        this.victorywidth=getw(this,this.widthPercentVictory)
        this.exitwidth=getw(this,this.widthPercentExitButton)
        this.smallRectwidth=getw(this,this.widthPercentSmallRect)
        this.backgroundRectWidth=getw(this,this.widthPercentBackgroundRect)
        this.victoryYRaise=getw(this,50-this.victoryYPercent)
        this.smallRectYRaise=getw(this,50-this.smallRectYPercent)
        this.trophyYRaise=getw(this,50-this.trophyYPercent)
        this.exitYLower=-getw(this,50-this.exitYPercent)
        this.tempNodeYLower=-getw(this,50-this.exitYPercent)//To remove
        this.exitXLeft=-getw(this,this.exitXPercent)
        this.playagainYLower=-getw(this,50-this.exitYPercent)
        this.playagainXRight=getw(this,this.exitXPercent)
        this.winmessageYLower=-getw(this,50-this.winmessageYPercent)
        this.lossMessageYLower=-getw(this,50-this.winmessageYPercent)
        this.chestYLower=-getw(this,50-this.chestYPercent)
        this.coinYLower=-getw(this,50-this.coinYPercent)
        this.coinXLeft=-getw(this,this.coinXPercent)
        this.scoreNodeYLower=getw(this,50-this.scoreNodeYPercent)
        this.UserWonXRight=getw(this,this.userWonXPercent)
        this.UserWonYLower=-getw(this,50-this.userWonYPercent)
        this.scoreShowYLower=getw(this,50-this.scoreShowYPercent)
        this.coinShowYLower=-getw(this,50-this.coinShowYPercent)
        this.coinShowXLeft=getw(this,this.coinXPercent)
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
        
        Log.v(this.node);

        // const scale = Math.max(mySize.width / deviceSize.width, mySize.height / deviceSize.height); 
        // this.node.setContentSize(deviceSize.width * scale, deviceSize.height * scale);
    }

}
