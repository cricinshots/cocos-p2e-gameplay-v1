import { geth, getw, Log } from "./common";
import { Game, GAME_MAP } from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TeamsDisplayScreen extends cc.Component {
    @property
    height:number = 0;
    @property
    width:number = 0;

    @property(cc.SpriteFrame)
    playerBg: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    levelBg: cc.SpriteFrame = null;

    // @property
    // heightAbsolutePlayerBox:number=this.playerBg.getOriginalSize().height
    // @property
    // widthAbsolutePlayerBox:number=this.playerBg.getOriginalSize().width
    @property
    ratioHeightToWidthPlayerBox:number=1
    @property
    spacingHoriPercentPlayerBox:number=0
    @property
    spacingVertPercentPlayerBox:number=0
    @property
    spacingVertPercentScreenEdge:number=0
    @property
    spacingVertPercentUserLevel:number=0
    @property
    spacingVertPercentUserName:number=0
    @property
    spacingVertPercentUserHandle:number=0

    // @property
    // heightPercentPlayerBox:number=0
    @property
    widthPercentPlayerBox:number=0
    @property
    widthPercentLevelCircle:number=0
    @property
    heightAdditionalPercentUname:number=0
    @property
    heightAdditionalPercentHandle:number=0
    @property
    widthPercentVersus:number=0

    @property
    fontSizePlayer:number=8
    @property(cc.Font)
    fontFacePlayer:cc.Font=null
    @property
    fontSizeLevel:number=5
    @property
    fontColorLevel:cc.Color=cc.Color.WHITE
    @property(cc.Font)
    fontFaceLevel:cc.Font=null
    @property
    fontSizeUname:number=30
    @property
    fontColorUname:cc.Color=cc.Color.WHITE
    @property(cc.Font)
    fontFaceUname:cc.Font=null
    @property
    fontSizeHandle:number=5
    @property
    fontColorHandle:cc.Color=cc.Color.WHITE

    vertEdgeOffset: number
    cardWidth: number
    cardHeight: number
    vertSpaceBetnCards: number
    horiSpaceBetnCards: number
    _4cardsEdgeSpace: number
    _3cardsEdgeSpace: number
    horiEdgePositionFromMidAnchor: number
    vertEdgePositionFromMidAnchor: number
    gapLevelPlayers: number
    gapUnameLevel: number
    gapHandleUname: number
    levelWidth: number
    levelHeight: number
    unameHeight: number
    handeHeight: number
    versusWidth: number

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
        if(!this.myDataLoaded && Game.user.players && Game.user.players.length) {
            this.myDataLoaded=true
            this.positionAllComponents()
        }
        if(!this.oppDataLoaded && Game.opponent.players && Game.opponent.players.length) {
            this.oppDataLoaded=true
            this.positionAllComponents()
        }
        if(!this.nextScreenOpened && Game.status === GAME_MAP.TOSS_WAITING) {
            Log.v("Navigating to toss...");
            cc.director.loadScene("TossScene")
            this.nextScreenOpened = true
        }
    }

    initui(){
        Log.v(this.node.name);
        this.drawAllComponents()

        // TODO: For debugging only, to be removed!
        let tPlayers=[null,null,null,null,null]
        tPlayers.fill({
            name: "Virat Kohli Dada kasa challay",
            imgurl: "https://resources.pulse.icc-cricket.com/players/284/164.png",
        },0)

        if(!Game.user) Game.user={
            players: tPlayers,
            level: 10,
            uname: "Pranjalgokhale98"
        }

        if(!Game.opponent) Game.opponent={
            players: tPlayers,
            level: 10,
            uname: "Harshawardhan1101"
        }
    }

    buildui(){
        this.doTheMath();
        this.positionAllComponents();
    }

    drawAllComponents() {
        // Top and Bottom cards all 3 rows
        for(let j=0; j<3; ++j)
        for(let i=0; i<4; ++i) {
            if(j===2 && i>2) break;

            //Top card
            let tcard = new cc.Node('top_'+j.toString()+'_'+i.toString())
            tcard.setParent(this.node)
            tcard.setAnchorPoint(0,1)
            tcard.addComponent(cc.Sprite)
            let tImgNode=new cc.Node('pImgNode')
            tImgNode.setAnchorPoint(0,1)
            let tImgSprite=tImgNode.addComponent(cc.Sprite)
            tImgSprite.sizeMode=cc.Sprite.SizeMode.CUSTOM
            tImgSprite.type=cc.Sprite.Type.SIMPLE
            // let tTitle=tImgNode.addComponent(cc.RichText)
            // tTitle.horizontalAlign=cc.macro.TextAlignment.CENTER
            // tTitle.fontSize=this.fontSizePlayer
            // WTF! There is no vertical alignment in RichText
            tcard.addChild(tImgNode,0,'pImgNode')
            let tTitleNode=new cc.Node('pTitleNode')
            tTitleNode.setAnchorPoint(0,1)
            let tTitle=tTitleNode.addComponent(cc.Label)
            tTitle.horizontalAlign=cc.Label.HorizontalAlign.CENTER
            tTitle.verticalAlign=cc.Label.VerticalAlign.BOTTOM
            tTitle.fontSize=this.fontSizePlayer
            if(tTitle.font=this.fontFacePlayer) tTitle.useSystemFont=false
            tTitle.lineHeight=this.fontSizePlayer
            tTitle.overflow=cc.Label.Overflow.CLAMP
            tcard.addChild(tTitleNode,1,'pTitleNode')
            this.nodePlayerMapOpponent.set(j*4+i,tcard)

            // Bottom card
            let bcard = new cc.Node('bottom_'+j.toString()+'_'+i.toString())
            bcard.setParent(this.node)
            bcard.setAnchorPoint(0,0)
            bcard.addComponent(cc.Sprite)
            let bImgNode=new cc.Node('pImgNode')
            bImgNode.setAnchorPoint(0,0)
            let bImgSprite=bImgNode.addComponent(cc.Sprite)
            bImgSprite.sizeMode=cc.Sprite.SizeMode.CUSTOM
            bImgSprite.type=cc.Sprite.Type.SIMPLE
            bcard.addChild(bImgNode,0,'pImgNode')
            let bTitleNode=new cc.Node('pTitleNode')
            bTitleNode.setAnchorPoint(0,0)
            let bTitle=bTitleNode.addComponent(cc.Label)
            bTitle.horizontalAlign=cc.Label.HorizontalAlign.CENTER
            bTitle.verticalAlign=cc.Label.VerticalAlign.BOTTOM
            bTitle.fontSize=this.fontSizePlayer
            if(bTitle.font=this.fontFacePlayer) bTitle.useSystemFont=false
            bTitle.lineHeight=this.fontSizePlayer
            bTitle.overflow=cc.Label.Overflow.CLAMP
            bcard.addChild(bTitleNode,1,'pTitleNode')
            this.nodePlayerMapMine.set(j*4+i,bcard)
        }

        // User levels
        this.levelOp=new cc.Node('top_level')
        this.levelOp.setParent(this.node)
        this.levelOp.setAnchorPoint(0.5,0.5)
        let ls0=this.levelOp.addComponent(cc.Sprite)
        ls0.type=cc.Sprite.Type.SIMPLE
        ls0.spriteFrame=this.levelBg
        ls0.sizeMode=cc.Sprite.SizeMode.CUSTOM
        let ll0=this.levelOp.addComponent(cc.RichText)
        ll0.horizontalAlign=cc.macro.TextAlignment.CENTER
        ll0.handleTouchEvent=false
        ll0.fontSize=this.fontSizeLevel
        ll0.lineHeight=this.fontSizeLevel
        if(ll0.font=this.fontFaceLevel) ll0.useSystemFont=false

        this.levelMy=new cc.Node('bottom_level')
        this.levelMy.setParent(this.node)
        this.levelMy.setAnchorPoint(0.5,0.5)
        let ls1=this.levelMy.addComponent(cc.Sprite)
        ls1.type=cc.Sprite.Type.SIMPLE
        ls1.spriteFrame=this.levelBg
        ls1.sizeMode=cc.Sprite.SizeMode.CUSTOM
        let ll1=this.levelMy.addComponent(cc.RichText)
        ll1.horizontalAlign=cc.macro.TextAlignment.CENTER
        ll1.handleTouchEvent=false
        ll1.fontSize=this.fontSizeLevel
        ll1.lineHeight=this.fontSizeLevel
        if(ll1.font=this.fontFaceLevel) ll1.useSystemFont=false

        // User names
        this.unameOp=new cc.Node('top_uname')
        this.unameOp.setParent(this.node)
        this.unameOp.setAnchorPoint(0.5,1)
        this.unameOp.color=this.fontColorUname
        let lu0=this.unameOp.addComponent(cc.Label)
        lu0.fontSize=this.fontSizeUname
        if(lu0.font=this.fontFaceLevel) lu0.useSystemFont=false
        lu0.horizontalAlign=cc.Label.HorizontalAlign.CENTER
        lu0.verticalAlign=cc.Label.VerticalAlign.TOP
        lu0.enableBold=true
        lu0.enableItalic=true

        this.unameMy=new cc.Node('bottom_uname')
        this.unameMy.setParent(this.node)
        this.unameMy.setAnchorPoint(0.5,0)
        this.unameMy.color=this.fontColorUname
        let lu1=this.unameMy.addComponent(cc.Label)
        lu1.fontSize=this.fontSizeUname
        if(lu1.font=this.fontFaceLevel) lu1.useSystemFont=false
        lu1.horizontalAlign=cc.Label.HorizontalAlign.CENTER
        lu1.verticalAlign=cc.Label.VerticalAlign.BOTTOM
        lu1.enableBold=true
        lu1.enableItalic=true

        // User handles
        this.handeOp=new cc.Node('top_handle')
        this.handeOp.setParent(this.node)
        this.handeOp.setAnchorPoint(0.5,1)
        this.handeOp.color=this.fontColorHandle
        let lh0=this.handeOp.addComponent(cc.Label)
        lh0.fontSize=this.fontSizeHandle
        lh0.horizontalAlign=cc.Label.HorizontalAlign.CENTER
        lh0.verticalAlign=cc.Label.VerticalAlign.TOP

        this.handeMy=new cc.Node('bottom_handle')
        this.handeMy.setParent(this.node)
        this.handeMy.setAnchorPoint(0.5,0)
        this.handeMy.color=this.fontColorHandle
        let lh1=this.handeMy.addComponent(cc.Label)
        lh1.fontSize=this.fontSizeHandle
        lh1.horizontalAlign=cc.Label.HorizontalAlign.CENTER
        lh1.verticalAlign=cc.Label.VerticalAlign.BOTTOM
    }

    positionAllComponents() {
        let vertSpace=this.vertEdgePositionFromMidAnchor-this.vertEdgeOffset

        // Top and Bottom cards 1st and 2nd row
        for(let j=0; j<2; ++j) {
        Log.v(`vertSpace (card row ${j}) = ${vertSpace}`)
        for(let i=0; i<4; ++i) {
            //Top card
            let tcard = this.nodePlayerMapOpponent.get(j*4+i)
            tcard.setPosition(
                this.horiEdgePositionFromMidAnchor+this._4cardsEdgeSpace+i*(this.cardWidth+this.horiSpaceBetnCards),
                vertSpace
            )

            // Bottom card
            let bcard = this.nodePlayerMapMine.get(j*4+i)
            bcard.setPosition(
                this.horiEdgePositionFromMidAnchor+this._4cardsEdgeSpace+i*(this.cardWidth+this.horiSpaceBetnCards),
                -vertSpace
            )
        }
        vertSpace-=this.cardHeight+this.vertSpaceBetnCards
        }

        Log.v(`vertSpace (card row 2) = ${vertSpace}`)

        // Top and Bottom cards 3rd row
        for(let i=0; i<3; ++i) {
            //Top card
            let tcard = this.nodePlayerMapOpponent.get(8+i)
            tcard.setPosition(
                this.horiEdgePositionFromMidAnchor+this._3cardsEdgeSpace+i*(this.cardWidth+this.horiSpaceBetnCards),
                vertSpace
            )

            // Bottom card
            let bcard = this.nodePlayerMapMine.get(8+i)
            bcard.setPosition(
                this.horiEdgePositionFromMidAnchor+this._3cardsEdgeSpace+i*(this.cardWidth+this.horiSpaceBetnCards),
                -vertSpace
            )
        }

        // Insert player data on all nodes and set size
        for(let i=0; i<this.nodePlayerMapMine.size; ++i) {
            let bImgNode=this.nodePlayerMapMine.get(i)
            let tImgNode=this.nodePlayerMapOpponent.get(i)
            bImgNode.getComponent(cc.Sprite).spriteFrame=this.playerBg
            tImgNode.getComponent(cc.Sprite).spriteFrame=this.playerBg
            bImgNode.setContentSize(this.cardWidth,this.cardHeight)
            tImgNode.setContentSize(this.cardWidth,this.cardHeight)
        }

        // Insert player data if available
        for(let i=0; i<this.nodePlayerMapMine.size; ++i) {
            let ply=[(Game.user.players||[])[i], (Game.opponent.players||[])[i]]
            if(ply[0]) {
                this.setUpImageLoader(
                  this.nodePlayerMapMine.get(i).getChildByName('pImgNode'), ply[0].imgurl,
                  new cc.Size(this.cardWidth,this.cardHeight)
                )
                this.nodePlayerMapMine.get(i).getChildByName('pTitleNode').getComponent(cc.Label).string=ply[0].name
                this.nodePlayerMapMine.get(i).getChildByName('pTitleNode').setContentSize(this.cardWidth,this.cardHeight)
            }
            if(ply[1]) {
                this.setUpImageLoader(
                  this.nodePlayerMapOpponent.get(i).getChildByName('pImgNode'), ply[1].imgurl,
                  new cc.Size(this.cardWidth,this.cardHeight)
                )
                this.nodePlayerMapOpponent.get(i).getChildByName('pTitleNode').getComponent(cc.Label).string=ply[1].name
                this.nodePlayerMapOpponent.get(i).getChildByName('pTitleNode').setContentSize(this.cardWidth,this.cardHeight)
            }
        }

        vertSpace-=this.cardHeight+this.gapLevelPlayers+this.levelWidth/2
        Log.v("vertSpace (level) = "+vertSpace.toString())

        // Set user level bubbles
        this.levelOp.getComponent(cc.RichText).string=`<color=#${this.fontColorLevel.toHEX('#rrggbb')}>${Game.opponent.level}</color>`
        this.levelOp.setPosition(0,vertSpace)
        this.levelOp.setContentSize(this.levelWidth,this.levelHeight)
        setTimeout(()=>{this.levelOp.setContentSize(this.levelWidth,this.levelHeight)},99)  // Pro jugaad 💯

        this.levelMy.getComponent(cc.RichText).string=`<color=#${this.fontColorLevel.toHEX('#rrggbb')}>${Game.user.level}</color>`
        this.levelMy.setPosition(0,-vertSpace)
        this.levelMy.setContentSize(this.levelWidth,this.levelHeight)
        setTimeout(()=>{this.levelMy.setContentSize(this.levelWidth,this.levelHeight)},99)  // Pro jugaad 💯

        vertSpace-=this.gapUnameLevel+this.levelHeight/2
        Log.v("vertSpace (uname) = "+vertSpace.toString())

        // Set user names
        this.unameOp.getComponent(cc.Label).string=Game.opponent.uname.toString()
        this.unameOp.setContentSize(getw(this,100),this.unameHeight)
        this.unameOp.setPosition(0,vertSpace)
        this.unameMy.getComponent(cc.Label).string=Game.user.uname.toString()
        this.unameMy.setContentSize(getw(this,100),this.unameHeight)
        this.unameMy.setPosition(0,-vertSpace)

        vertSpace-=this.gapHandleUname+this.unameHeight
        Log.v("vertSpace (hande) = "+vertSpace.toString())

        // Set user handles
        this.handeOp.getComponent(cc.Label).string=Game.opponent.handle || ""//"#GH8676V8K"
        this.handeOp.setContentSize(getw(this,100),this.handeHeight)
        this.handeOp.setPosition(0,vertSpace)
        this.handeMy.getComponent(cc.Label).string=Game.user.handle || ""//"#USGU456GH"
        this.handeMy.setContentSize(getw(this,100),this.handeHeight)
        this.handeMy.setPosition(0,-vertSpace)

        // Set versus symbol
        let nVersus:cc.Node
        if(nVersus=this.node.getChildByName("NodeVersus")) {
            let origRatioVersus:any=nVersus.getContentSize()
            origRatioVersus=origRatioVersus.height/origRatioVersus.width
            nVersus.setContentSize(this.versusWidth,origRatioVersus*this.versusWidth)
        }
    }

    doTheMath() {
        this.vertEdgeOffset=geth(this,this.spacingVertPercentScreenEdge)
        this.cardWidth=getw(this,this.widthPercentPlayerBox)
        // this.cardWidth=this.widthAbsolutePlayerBox
        // this.cardHeight=geth(this,this.heightPercentPlayerBox)
        // this.cardHeight=this.heightAbsolutePlayerBox
        this.cardHeight=this.ratioHeightToWidthPlayerBox*this.cardWidth
        this.vertSpaceBetnCards=geth(this,this.spacingVertPercentPlayerBox)
        this.horiSpaceBetnCards=getw(this,this.spacingHoriPercentPlayerBox)
        this._4cardsEdgeSpace=(getw(this,100)-(4*this.cardWidth)-(3*this.horiSpaceBetnCards))/2
        this._3cardsEdgeSpace=(getw(this,100)-(3*this.cardWidth)-(2*this.horiSpaceBetnCards))/2
        this.horiEdgePositionFromMidAnchor=-getw(this,50)
        this.vertEdgePositionFromMidAnchor=geth(this,50)
        this.gapLevelPlayers=geth(this,this.spacingVertPercentUserLevel)
        this.gapUnameLevel=geth(this,this.spacingVertPercentUserName)
        this.gapHandleUname=geth(this,this.spacingVertPercentUserHandle)
        this.levelWidth=getw(this,this.widthPercentLevelCircle)
        this.levelHeight=(this.levelBg.getOriginalSize().height/this.levelBg.getOriginalSize().width)*this.levelWidth
        this.unameHeight=geth(this,this.heightAdditionalPercentUname)
        this.handeHeight=geth(this,this.heightAdditionalPercentHandle)
        this.versusWidth=getw(this,this.widthPercentVersus)
    }

    setUpImageLoader(node:cc.Node, url:string, size:cc.Size, force:boolean=false) {
        let sprite=node.getComponent(cc.Sprite)
        if(sprite.spriteFrame) {  // If frame already exists
            if(!force)            // and we lack force,
                return node.setContentSize(size)  // then simply reset the node size

            // But if we have force, we do some destruction before proceeding
            sprite.spriteFrame.clearTexture()
            sprite.spriteFrame.clear()
            sprite.spriteFrame.destroy()
        }
        cc.assetManager.loadRemote<cc.Texture2D>(url, {ext:'.jpg'}, (err,asset)=>{
            if(err)
                return //Log.e(`Error while loading image: ${err.message}`)
            sprite.spriteFrame=new cc.SpriteFrame(asset)
            node.setContentSize(size)
        })
    }

    nodePlayerMapMine : Map<number,cc.Node> = new Map<number,cc.Node>()
    nodePlayerMapOpponent : Map<number,cc.Node> = new Map<number,cc.Node>()
    levelOp:cc.Node ; levelMy:cc.Node
    unameOp:cc.Node ; unameMy:cc.Node
    handeOp:cc.Node ; handeMy:cc.Node

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